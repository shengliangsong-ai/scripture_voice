#!/usr/bin/env python3
"""Split Bible public/data/index.json into lightweight books-manifest.json and books/{bookSlug}.json."""

import argparse
import json
import os
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


CANONICAL_BOOK_ORDER: List[str] = [
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
    "joshua", "judges", "ruth", "1samuel", "2samuel",
    "1kings", "2kings", "1chronicles", "2chronicles", "ezra",
    "nehemiah", "esther", "job", "psalm", "proverbs",
    "ecclesiastes", "songofsolomon", "isaiah", "jeremiah", "lamentations",
    "ezekiel", "daniel", "hosea", "joel", "amos",
    "obadiah", "jonah", "micah", "nahum", "habakkuk",
    "zephaniah", "haggai", "zechariah", "malachi",
    "matthew", "mark", "luke", "john", "acts",
    "romans", "1corinthians", "2corinthians", "galatians", "ephesians",
    "philippians", "colossians", "1thessalonians", "2thessalonians", "1timothy",
    "2timothy", "titus", "philemon", "hebrews", "james",
    "1peter", "2peter", "1john", "2john", "3john",
    "jude", "revelation",
]

BOOK_ORDER_INDEX: Dict[str, int] = {
    slug: idx for idx, slug in enumerate(CANONICAL_BOOK_ORDER)
}


def format_bytes(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    if num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.2f} KB"
    return f"{num_bytes / (1024 * 1024):.2f} MB"


def build_book_manifest_entry(
    book_slug: str, records: List[Dict[str, Any]]
) -> Dict[str, Any]:
    chapters = [int(r["chapter"]) for r in records if "chapter" in r]

    # Compress per-chapter availableLangs via mode + exceptions so 1,189 chapters stay tiny
    lang_tuples: List[tuple] = []
    per_chapter_langs: Dict[str, List[str]] = {}
    for rec in records:
        langs = rec.get("availableLangs")
        if isinstance(langs, list):
            lang_tuples.append(tuple(langs))
            per_chapter_langs[str(rec["chapter"])] = langs

    entry: Dict[str, Any] = {
        "bookSlug": book_slug,
        "file": f"books/{book_slug}.json",
        "chapterCount": len(records),
        "chapters": chapters,
    }

    if lang_tuples:
        most_common_tuple, _ = Counter(lang_tuples).most_common(1)[0]
        default_langs = list(most_common_tuple)
        entry["defaultLangs"] = default_langs

        exceptions = {
            ch_key: langs
            for ch_key, langs in per_chapter_langs.items()
            if langs != default_langs
        }
        if exceptions:
            entry["chapterLangs"] = exceptions

    return entry


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Split Bible index.json into one JSON file per book."
    )
    parser.add_argument(
        "--input",
        default="public/data/index.json",
        help="Source index.json",
    )
    parser.add_argument(
        "--output",
        default="public/data",
        help="Output data directory",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Allow overwriting generated output files",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_dir = Path(args.output)
    books_dir = output_dir / "books"
    manifest_path = output_dir / "books-manifest.json"

    if not input_path.is_file():
        print(f"Error: Input file not found: {input_path}", file=sys.stderr)
        return 1

    if not args.force:
        existing_book_files = list(books_dir.glob("*.json")) if books_dir.exists() else []
        if manifest_path.exists() or existing_book_files:
            print(
                f"Error: Output already exists ({manifest_path} or {len(existing_book_files)} book files). "
                "Pass --force to overwrite.",
                file=sys.stderr,
            )
            return 1

    print(f"Reading {input_path} ({format_bytes(input_path.stat().st_size)})...")
    with input_path.open("r", encoding="utf-8") as f:
        records = json.load(f)

    if not isinstance(records, list):
        print("Error: Expected top-level JSON array in index.json.", file=sys.stderr)
        return 1

    grouped: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for rec in records:
        if not isinstance(rec, dict) or "bookSlug" not in rec:
            print(f"Error: Invalid chapter record missing bookSlug: {rec}", file=sys.stderr)
            return 1
        grouped[str(rec["bookSlug"])].append(rec)

    books_dir.mkdir(parents=True, exist_ok=True)

    sorted_slugs = sorted(
        grouped.keys(),
        key=lambda slug: (BOOK_ORDER_INDEX.get(slug, 999), slug),
    )

    manifest_books: List[Dict[str, Any]] = []
    total_written_records = 0
    total_book_bytes = 0

    for slug in sorted_slugs:
        book_records = sorted(grouped[slug], key=lambda r: int(r.get("chapter", 0)))
        book_path = books_dir / f"{slug}.json"
        serialized = json.dumps(book_records, ensure_ascii=False, separators=(",", ":"))
        book_path.write_text(serialized, encoding="utf-8")

        total_written_records += len(book_records)
        total_book_bytes += book_path.stat().st_size
        manifest_books.append(build_book_manifest_entry(slug, book_records))

    manifest = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        "totalBooks": len(manifest_books),
        "totalChapters": total_written_records,
        "books": manifest_books,
    }
    manifest_text = json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))
    manifest_path.write_text(manifest_text, encoding="utf-8")

    # Verification pass: re-read generated files and assert exact count parity
    verified_records = 0
    for slug in sorted_slugs:
        loaded = json.loads((books_dir / f"{slug}.json").read_text(encoding="utf-8"))
        if not isinstance(loaded, list):
            print(f"Verification error: {slug}.json is not a JSON array.", file=sys.stderr)
            return 1
        verified_records += len(loaded)

    if verified_records != len(records):
        print(
            f"Verification error: expected {len(records)} records, found {verified_records}.",
            file=sys.stderr,
        )
        return 1

    manifest_size = manifest_path.stat().st_size
    avg_book_size = total_book_bytes // max(1, len(sorted_slugs))
    max_book = max(
        ((slug, (books_dir / f"{slug}.json").stat().st_size) for slug in sorted_slugs),
        key=lambda item: item[1],
    )

    print("Split complete and verified:")
    print(f"  Original index.json : {format_bytes(input_path.stat().st_size)} ({len(records)} records) [untouched]")
    print(f"  books-manifest.json : {format_bytes(manifest_size)} ({len(manifest_books)} books)")
    print(f"  books/*.json total  : {format_bytes(total_book_bytes)} across {len(sorted_slugs)} files")
    print(f"  Avg / Largest book  : {format_bytes(avg_book_size)} avg, {max_book[0]}.json = {format_bytes(max_book[1])}")
    print(f"  Records verified    : {verified_records}/{len(records)} preserved")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
