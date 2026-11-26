# Scripture Voice

**Scripture Voice** is an offline-capable, installable PWA Bible audio, study, and devotional reader designed to run **100% locally on static scripture JSON, lightweight vector/image artwork, and your device's built-in voice synthesis**—with **zero runtime LLM, cloud TTS, translation, or image generation API calls**.

## Key Features

- **Zero Runtime AI or Server Dependencies**: All Bible passages, multi-length devotionals (`1`, `3`, `5`, `10`, `15` min), worship song lyrics, artwork plates, and search indexes load directly from static files in `public/data/` and `src/assets/images/`.
- **Lazy-Loaded 66-Book Architecture**: On startup, the app fetches only the lightweight `7.1 KB` manifest (`public/data/books-manifest.json`), then lazy-loads individual per-book JSON bundles (`public/data/books/{book}.json`) on demand with in-memory caching and request deduplication.
- **66-Book Canonical Sidebar**: Browse all Old Testament (`1`–`39`) and New Testament (`40`–`66`) books with **Old** / **New** testament tabs, explicit chapter counts, chapter grids, and localized book names.
- **Scoped Client-Side BM25 & Voice Search**: Query keywords, themes (`"Comfort in anxiety"`, `"焦慮中的安慰"`), or scripture references (`"John 3:16"`, `"約翰福音 3:16"`) with CJK character/bigram tokenization across either **This Book only** or the **Full Bible** (assembled from split `books/*.json` bundles without a duplicate monolith), plus optional microphone voice search via the browser Web Speech API.
- **Real-Time OS Voice Synthesis & Follow-Along Highlighting**: Reads localized scripture verses, devotional commentary, and worship lyrics aloud in real time via **`window.speechSynthesis`** matched to the active locale (`en-US`, `zh-TW`, `zh-CN`, etc.)—with a direct **installed OS voice picker**, narrator timbre tuning (`Fenrir`, `Kore`, `Puck`, `Charon`, `Zephyr`), playback speed control (`0.85×`–`1.3×`), live spoken subtitles, lock-screen Media Session controls, and automatic verse-by-verse highlighting & scrolling as audio plays. **Zero pre-generated `.wav`/`.mp3` files are shipped.**
- **Default English & Chinese (`en`, `zh`, `zh-CN`) + On-Demand Languages**: Ships streamlined with English, Traditional Chinese, and Simplified Chinese (`276` tracked files, `~8.5 MB` working tree), while supporting on-demand generation of 8 additional languages (`es`, `fr`, `de`, `pt`, `it`, `ja`, `ko`, `hi`) via `scripts/pregenerate.ts`.
- **Artwork Plates**: Features 4 flagship classical oil paintings (`Genesis 1`, `Psalm 23`, `1 Corinthians 13`, `John 3` in `src/assets/images/`) plus 66 bespoke archival SVG book plates (`public/data/images/books/{book}.svg`, `145 KB` total).
- **Study Library, Font Sizing & Installable PWA**: Includes a reader font-size toggle (`Compact` / `Standard` / `Large`), per-verse bookmarks & reading history stored privately in `localStorage`, one-tap **Save Book Offline** precaching via Workbox, iPhone **Add to Home Screen** guidance, clipboard copy, Web Share, and printable PDF study sheets via `html2canvas` and `jspdf`.

## Current Offline Content Coverage

| Tier | Scope | Details |
| --- | --- | --- |
| **Canonical Index** | **66 books / 76 chapters** pre-generated (`Genesis 1`–`Revelation 1`, flagship chapters, and `Ezra 2`) | Default languages: `en`, `zh`, `zh-CN` (`public/data/books-manifest.json` + `public/data/books/*.json`) |
| **Artwork Plates** | 4 oil paintings (`3.7 MB`) + 66 SVG book plates (`145 KB`) | Flagship scenes + custom archival vector plate per canonical book |
| **Full Canon Expansion** | All `66` books / `1,189` chapters navigable | Run `npm run pregenerate -- --all-canon` (or per-book commands) to populate remaining chapters |

## Repository Structure

```text
scripture_voice/
├── src/
│   ├── assets/images/          # 4 flagship classical oil-painting JPEG plates
│   ├── components/             # AudioPlayer, BibleSidebar, Header, PassageReader, SearchBar, modals
│   ├── data/                   # 66-book metadata, UI translations (uiStrings.ts), seeded corpus
│   ├── services/               # bibleDataService.ts (lazy manifest/book loader) & offlineDataService.ts
│   ├── types/                  # TypeScript interfaces for scripture, devotionals, lyrics & audio segments
│   └── utils/                  # Rich/plain clipboard copy & PDF export helpers
├── public/
│   └── data/
│       ├── books-manifest.json # Lightweight 7.1 KB manifest of all 66 books & chapter lists
│       ├── books/              # 66 per-book search & index JSON files (lazy-loaded)
│       ├── bible/              # Chapter scripture JSON by language (en/, zh/, zh-CN/)
│       ├── devotionals/        # Multi-length devotional bundles (1/3/5/10/15 min)
│       ├── lyrics/             # Worship song lyrics per featured chapter
│       └── images/             # 66 SVG book plates (books/*.svg) + manifest.json
├── scripts/
│   ├── pregenerate.ts          # Public-domain crawler & static JSON bundle compiler
│   └── generate_book_plates.py # Generator for the 66 bespoke SVG book plates
├── split_bible.py              # Splits index.json into books-manifest.json + books/*.json
├── PREGENERATE_66_BOOKS.md     # Quick-copy per-book pre-generation commands (1–66)
├── package.json
└── vite.config.ts              # Vite + VitePWA Workbox configuration
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server** (port `3000`):
   ```bash
   npm run dev
   ```

3. **Type-check & build for production**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Preview the production PWA & test offline mode locally**:
   ```bash
   npm run preview
   ```
   Open DevTools → Application → Service Workers (or toggle Offline) to verify precaching and runtime book caching.

## Expanding the Dataset & Pre-Generation Pipeline

All static JSON bundles under `public/data/` are compiled at build time by `scripts/pregenerate.ts` using curated chapters (`src/data/seededCorpus.ts`), the keyless public-domain crawler (`bible.helloao.org`), and local cache (`scripts/.cache/`). No LLM or TTS API keys are used:

```bash
# Rebuild seeded + cached chapters for default languages (en, zh, zh-CN)
npm run pregenerate

# Generate additional languages (or all 11 supported languages) on demand
npm run pregenerate -- --langs=es,fr,ja
npm run pregenerate -- --langs=all

# Crawl Chapter 1 of all 66 Bible books + flagship chapters
npm run pregenerate -- --all-books

# Crawl >=50% of New Testament books in Chinese
npm run pregenerate -- --nt-half --langs=zh,zh-CN

# Crawl a single chapter or an entire book by slug or number (1-66)
npm run pregenerate -- --chapters=ezra_2
npm run pregenerate -- --book=ezra
npm run pregenerate -- --book=24 chapter=all

# Crawl the entire 66-book, 1,189-chapter public-domain Bible
npm run pregenerate -- --all-canon --langs=en,zh,zh-CN

# Rebuild purely from local cache without network access
npm run pregenerate -- --chapters=ezra_2 --no-crawl
```

Utilities for split indexes and SVG book plates:

```bash
# Re-split public/data/index.json into books-manifest.json + 66 books/*.json files
python3 split_bible.py --force

# Regenerate the 66 bespoke 16:9 archival SVG plates under public/data/images/books/
python3 scripts/generate_book_plates.py
```

> **Per-Book Command Reference**: See [`PREGENERATE_66_BOOKS.md`](./PREGENERATE_66_BOOKS.md) for all **66 individual book commands** (Genesis through Revelation).
