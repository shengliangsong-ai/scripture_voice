import { BIBLE_BOOKS } from '../data/bibleBooks';
import {
  BibleChapter,
  BibleManifest,
  BibleManifestBook,
  SearchIndexEntry,
  SupportedLang,
} from '../types/scripture';

export interface BibleDataService {
  loadManifest(): Promise<BibleManifest>;
  loadBook(bookSlug: string): Promise<BibleChapter[]>;
  getCachedBook(bookSlug: string): BibleChapter[] | undefined;
  clearBookCache(bookSlug?: string): void;
}

const BOOK_ORDER_INDEX = new Map<string, number>(BIBLE_BOOKS.map((b, idx) => [b.slug, idx]));

let manifestCache: BibleManifest | null = null;
let manifestInFlight: Promise<BibleManifest> | null = null;
let manifestSource: 'split' | 'legacy-index' | null = null;

const bookCache = new Map<string, BibleChapter[]>();
const bookInFlight = new Map<string, Promise<BibleChapter[]>>();

let fullIndexCache: SearchIndexEntry[] | null = null;
let fullIndexInFlight: Promise<SearchIndexEntry[]> | null = null;

async function fetchJsonChecked<T>(url: string, label: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} while loading ${label}`);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error(`Invalid JSON payload while loading ${label}`);
  }
}

function buildManifestFromLegacyIndex(records: SearchIndexEntry[]): BibleManifest {
  const grouped = new Map<string, SearchIndexEntry[]>();
  for (const rec of records) {
    if (!rec || typeof rec.bookSlug !== 'string') continue;
    const list = grouped.get(rec.bookSlug);
    if (list) {
      list.push(rec);
    } else {
      grouped.set(rec.bookSlug, [rec]);
    }
  }

  const sortedSlugs = Array.from(grouped.keys()).sort((a, b) => {
    const ia = BOOK_ORDER_INDEX.get(a) ?? 999;
    const ib = BOOK_ORDER_INDEX.get(b) ?? 999;
    return ia !== ib ? ia - ib : a.localeCompare(b);
  });

  const books: BibleManifestBook[] = [];
  for (const slug of sortedSlugs) {
    const bookRecords = grouped.get(slug)!.slice().sort((a, b) => a.chapter - b.chapter);
    bookCache.set(slug, bookRecords);

    const langFreq = new Map<string, { langs: SupportedLang[]; count: number }>();
    const chapterLangs: Record<string, SupportedLang[]> = {};
    for (const r of bookRecords) {
      if (Array.isArray(r.availableLangs)) {
        const sig = r.availableLangs.join(',');
        const prev = langFreq.get(sig);
        if (prev) {
          prev.count += 1;
        } else {
          langFreq.set(sig, { langs: r.availableLangs, count: 1 });
        }
        chapterLangs[String(r.chapter)] = r.availableLangs;
      }
    }

    let defaultLangs: SupportedLang[] | undefined;
    let bestCount = -1;
    for (const item of langFreq.values()) {
      if (item.count > bestCount) {
        bestCount = item.count;
        defaultLangs = item.langs;
      }
    }

    const exceptions: Record<string, SupportedLang[]> = {};
    if (defaultLangs) {
      const defaultSig = defaultLangs.join(',');
      for (const [ch, langs] of Object.entries(chapterLangs)) {
        if (langs.join(',') !== defaultSig) {
          exceptions[ch] = langs;
        }
      }
    }

    books.push({
      bookSlug: slug,
      file: `books/${slug}.json`,
      chapterCount: bookRecords.length,
      chapters: bookRecords.map((r) => r.chapter),
      ...(defaultLangs ? { defaultLangs } : {}),
      ...(Object.keys(exceptions).length > 0 ? { chapterLangs: exceptions } : {}),
    });
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    totalBooks: books.length,
    totalChapters: records.length,
    books,
  };
}

export async function loadManifest(): Promise<BibleManifest> {
  if (manifestCache) return manifestCache;
  if (manifestInFlight) return manifestInFlight;

  manifestInFlight = (async () => {
    try {
      const res = await fetch('/data/books-manifest.json');
      if (res.ok) {
        let parsed: BibleManifest;
        try {
          parsed = (await res.json()) as BibleManifest;
        } catch {
          throw new Error('Invalid JSON in /data/books-manifest.json');
        }
        if (!parsed || !Array.isArray(parsed.books)) {
          throw new Error('Malformed books-manifest.json structure');
        }
        manifestCache = parsed;
        manifestSource = 'split';
        return parsed;
      }

      // Temporary dev fallback to monolithic index.json if split manifest is not yet present (404)
      if (res.status === 404) {
        const legacy = await fetchJsonChecked<SearchIndexEntry[]>(
          '/data/index.json',
          'fallback /data/index.json'
        );
        if (!Array.isArray(legacy)) {
          throw new Error('Malformed fallback /data/index.json');
        }
        fullIndexCache = legacy;
        const derived = buildManifestFromLegacyIndex(legacy);
        manifestCache = derived;
        manifestSource = 'legacy-index';
        return derived;
      }

      throw new Error(`HTTP ${res.status} while loading /data/books-manifest.json`);
    } finally {
      manifestInFlight = null;
    }
  })();

  return manifestInFlight;
}

export function getCachedManifest(): BibleManifest | null {
  return manifestCache;
}

export function getCachedBook(bookSlug: string): BibleChapter[] | undefined {
  return bookCache.get(bookSlug);
}

export async function loadBook(bookSlug: string): Promise<BibleChapter[]> {
  const slug = bookSlug.trim().toLowerCase();
  if (!slug) {
    throw new Error('Book slug is required');
  }

  const cached = bookCache.get(slug);
  if (cached) return cached;

  const existingPromise = bookInFlight.get(slug);
  if (existingPromise) return existingPromise;

  const requestPromise = (async () => {
    try {
      const url = `/data/books/${encodeURIComponent(slug)}.json`;
      const res = await fetch(url);
      if (!res.ok) {
        // Legacy fallback when manifest came from monolithic index.json
        if (res.status === 404 && manifestSource === 'legacy-index' && fullIndexCache) {
          const filtered = fullIndexCache
            .filter((entry) => entry.bookSlug === slug)
            .sort((a, b) => a.chapter - b.chapter);
          bookCache.set(slug, filtered);
          return filtered;
        }
        throw new Error(`Failed to load book "${slug}" (HTTP ${res.status})`);
      }

      let parsed: unknown;
      try {
        parsed = await res.json();
      } catch {
        throw new Error(`Invalid JSON in /data/books/${slug}.json`);
      }

      if (!Array.isArray(parsed)) {
        throw new Error(`Expected array of chapters in /data/books/${slug}.json`);
      }

      const chapters = parsed as BibleChapter[];
      bookCache.set(slug, chapters);
      return chapters;
    } finally {
      // Remove from in-flight tracking on both success and error so failed requests can be retried
      bookInFlight.delete(slug);
    }
  })();

  bookInFlight.set(slug, requestPromise);
  return requestPromise;
}

export function clearBookCache(bookSlug?: string): void {
  if (bookSlug) {
    const slug = bookSlug.trim().toLowerCase();
    bookCache.delete(slug);
    bookInFlight.delete(slug);
  } else {
    bookCache.clear();
    bookInFlight.clear();
  }
}

export function clearAllBibleDataCaches(): void {
  manifestCache = null;
  manifestInFlight = null;
  manifestSource = null;
  bookCache.clear();
  bookInFlight.clear();
  fullIndexCache = null;
  fullIndexInFlight = null;
}

/**
 * Loads the full-Bible search index ONLY when the user explicitly invokes full-Bible keyword search.
 * Assembles entries from split per-book JSONs (cached individually in bookCache and PWA storage),
 * avoiding any duplicate monolithic index.json file.
 */
export async function loadFullSearchIndex(): Promise<SearchIndexEntry[]> {
  if (fullIndexCache) return fullIndexCache;
  if (fullIndexInFlight) return fullIndexInFlight;

  fullIndexInFlight = (async () => {
    try {
      const manifest = await loadManifest();
      if (fullIndexCache) return fullIndexCache;

      const BATCH_SIZE = 10;
      const allEntries: SearchIndexEntry[] = [];
      for (let i = 0; i < manifest.books.length; i += BATCH_SIZE) {
        const batch = manifest.books.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
          batch.map((b) => loadBook(b.bookSlug).catch(() => [] as BibleChapter[]))
        );
        for (const bookEntries of results) {
          allEntries.push(...bookEntries);
        }
      }

      fullIndexCache = allEntries;
      return allEntries;
    } finally {
      fullIndexInFlight = null;
    }
  })();

  return fullIndexInFlight;
}

export function getAvailableChapterKeysFromManifest(
  manifest: BibleManifest | null,
  lang: SupportedLang
): Set<string> {
  const keys = new Set<string>();
  if (!manifest) return keys;

  for (const book of manifest.books) {
    for (const ch of book.chapters) {
      const explicitLangs = book.chapterLangs?.[String(ch)] ?? book.defaultLangs;
      if (!explicitLangs || explicitLangs.includes(lang)) {
        keys.add(`${book.bookSlug}_${ch}`);
      }
    }
  }
  return keys;
}

export function getAvailableLanguagesFromManifest(
  manifest: BibleManifest | null
): SupportedLang[] {
  const active = new Set<SupportedLang>(['en', 'zh', 'zh-CN']);
  if (manifest) {
    for (const book of manifest.books) {
      if (book.defaultLangs) {
        for (const l of book.defaultLangs) active.add(l);
      }
      if (book.chapterLangs) {
        for (const langs of Object.values(book.chapterLangs)) {
          for (const l of langs) active.add(l);
        }
      }
    }
  }
  return Array.from(active);
}

export const bibleDataService: BibleDataService = {
  loadManifest,
  loadBook,
  getCachedBook,
  clearBookCache,
};
