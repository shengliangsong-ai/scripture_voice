import {
  BIBLE_BOOKS,
  getBookBySlug,
  getBookName,
  getChapterArtwork,
  getLanguageOption,
} from '../data/bibleBooks';
import { getUiStrings } from '../data/uiStrings';
import {
  BibleBookMeta,
  ChapterDevotionalBundle,
  ChapterScripture,
  DevotionalLength,
  SearchIndexEntry,
  SearchResultItem,
  SongLyrics,
  SupportedLang,
} from '../types/scripture';
import {
  bibleDataService,
  getAvailableChapterKeysFromManifest,
  getAvailableLanguagesFromManifest,
  getCachedBook,
  getCachedManifest,
  loadBook,
  loadFullSearchIndex,
  loadManifest,
} from './bibleDataService';

export {
  bibleDataService,
  getAvailableChapterKeysFromManifest,
  getAvailableLanguagesFromManifest,
  getCachedBook,
  getCachedManifest,
  loadBook,
  loadManifest,
};

export interface LoadedChapterBundle {
  scripture: ChapterScripture;
  devotional: ChapterDevotionalBundle;
  lyrics: SongLyrics;
  artwork?: { url: string; caption: string };
}

export type SearchScope = 'all' | 'book';

export interface SearchOptions {
  scope?: SearchScope;
  bookSlug?: string;
}

const chapterBundleCache = new Map<string, LoadedChapterBundle>();
const chapterBundleInFlight = new Map<string, Promise<LoadedChapterBundle>>();

export function parseBibleReferenceQuery(
  rawQuery: string
): { book: BibleBookMeta; chapter: number; verse?: number } | null {
  const q = rawQuery.trim();
  if (!q) return null;

  // Match patterns like "John 3:16", "1 Corinthians 13", "Psalm 23:4", "創世記 1:1"
  const match = q.match(/^(.+?)\s*(\d+)(?:\s*[:：]\s*(\d+))?$/);
  if (!match) return null;

  const bookPart = match[1].trim().toLowerCase();
  const chapterNum = Number.parseInt(match[2], 10);
  const verseNum = match[3] ? Number.parseInt(match[3], 10) : undefined;

  if (!Number.isFinite(chapterNum) || chapterNum < 1) return null;

  const foundBook = BIBLE_BOOKS.find((b) =>
    b.aliases.some((alias) => alias.toLowerCase() === bookPart || alias.toLowerCase().startsWith(bookPart))
  );

  if (!foundBook || chapterNum > foundBook.chapters) return null;
  return { book: foundBook, chapter: chapterNum, verse: verseNum };
}

function tokenizeQuery(query: string): string[] {
  const words = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  const cjkChars = query.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu) ?? [];
  const bigrams: string[] = [];
  for (let i = 0; i < cjkChars.length - 1; i++) {
    bigrams.push(cjkChars[i] + cjkChars[i + 1]);
  }
  return Array.from(new Set([...words, ...cjkChars, ...bigrams]));
}

function pickTopicsForLang(topics: string[], lang: SupportedLang): string[] {
  if (lang === 'zh' || lang === 'zh-CN') {
    const hanTopics = topics.filter((t) => /[\p{Script=Han}]/u.test(t));
    if (hanTopics.length > 0) return hanTopics;
  } else {
    const nonHanTopics = topics.filter((t) => !/[\p{Script=Han}]/u.test(t));
    if (nonHanTopics.length > 0) return nonHanTopics;
  }
  return topics;
}

function buildReferenceHit(
  refMatch: { book: BibleBookMeta; chapter: number; verse?: number },
  indexed: SearchIndexEntry | undefined,
  lang: SupportedLang
): SearchResultItem {
  const ui = getUiStrings(lang);
  const localizedRef = `${getBookName(refMatch.book, lang)} ${refMatch.chapter}${
    refMatch.verse ? `:${refMatch.verse}` : ''
  }`;
  const isCjkLang = lang === 'zh' || lang === 'zh-CN';
  const matchedVerse =
    !isCjkLang && refMatch.verse
      ? indexed?.verseMap.find((v) => v.verse === refMatch.verse)?.text
      : undefined;

  const localizedTopics = indexed
    ? pickTopicsForLang(indexed.topics, lang).slice(0, 3)
    : [ui.unseeded.referenceTopic];

  return {
    bookSlug: refMatch.book.slug,
    chapter: refMatch.chapter,
    verse: refMatch.verse,
    reference: localizedRef,
    title: ui.unseeded.searchTitle(localizedRef),
    snippet:
      matchedVerse ??
      indexed?.snippet[lang] ??
      indexed?.snippet.en ??
      ui.unseeded.searchSnippet(localizedRef),
    score: 1000,
    matchedTopics: localizedTopics,
  };
}

function scoreEntriesBm25(
  entries: SearchIndexEntry[],
  trimmed: string,
  lang: SupportedLang,
  excludeMatch?: { bookSlug: string; chapter: number }
): SearchResultItem[] {
  const queryTokens = tokenizeQuery(trimmed);
  if (queryTokens.length === 0 || entries.length === 0) return [];

  const ui = getUiStrings(lang);
  const N = Math.max(1, entries.length);
  const docFreq: Record<string, number> = {};
  for (const token of queryTokens) {
    let df = 0;
    for (const doc of entries) {
      if ((doc.tokens[token] ?? 0) > 0) df += 1;
    }
    docFreq[token] = df;
  }

  let totalTokens = 0;
  for (const doc of entries) {
    for (const count of Object.values(doc.tokens)) {
      totalTokens += count;
    }
  }
  const avgDocLen = totalTokens / N || 1;

  const k1 = 1.4;
  const b = 0.75;
  const isCjkLang = lang === 'zh' || lang === 'zh-CN';
  const lowerQ = trimmed.toLowerCase();
  const results: SearchResultItem[] = [];

  for (const doc of entries) {
    if (excludeMatch && doc.bookSlug === excludeMatch.bookSlug && doc.chapter === excludeMatch.chapter) {
      continue;
    }

    let docLen = 0;
    for (const c of Object.values(doc.tokens)) {
      docLen += c;
    }
    docLen = docLen || 1;

    let score = 0;
    const matchedTopics: string[] = [];

    for (const qt of queryTokens) {
      const tf = doc.tokens[qt] ?? 0;
      if (tf > 0) {
        const df = docFreq[qt] || 1;
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        const bm25 = (tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * docLen) / avgDocLen));
        score += idf * bm25;
      }

      if (doc.topics.some((t) => t.toLowerCase().includes(qt) || qt.includes(t.toLowerCase()))) {
        score += 2.2;
        for (const topic of pickTopicsForLang(doc.topics, lang)) {
          if ((topic.includes(qt) || qt.includes(topic)) && !matchedTopics.includes(topic)) {
            matchedTopics.push(topic);
          }
        }
      }
    }

    // Exact phrase boost in English verse map
    const matchedVerseObj = doc.verseMap.find((v) => v.text.toLowerCase().includes(lowerQ));
    if (matchedVerseObj) {
      score += 8.0;
    }

    if (score > 0.25) {
      const bookMeta = getBookBySlug(doc.bookSlug);
      const bookName = bookMeta ? getBookName(bookMeta, lang) : doc.reference;
      const fallbackTopics = pickTopicsForLang(doc.topics, lang).slice(0, 2);
      results.push({
        bookSlug: doc.bookSlug,
        chapter: doc.chapter,
        verse: matchedVerseObj?.verse,
        reference: `${bookName} ${doc.chapter}${matchedVerseObj ? `:${matchedVerseObj.verse}` : ''}`,
        title: ui.unseeded.searchTitle(`${bookName} ${doc.chapter}`),
        snippet:
          (!isCjkLang ? matchedVerseObj?.text : undefined) ??
          doc.snippet[lang] ??
          doc.snippet.en,
        score,
        matchedTopics: matchedTopics.length > 0 ? matchedTopics : fallbackTopics,
      });
    }
  }

  return results;
}

export async function searchLocalCorpus(
  query: string,
  lang: SupportedLang,
  options: SearchOptions = {}
): Promise<SearchResultItem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const scope: SearchScope = options.scope ?? 'all';
  const refMatch = parseBibleReferenceQuery(trimmed);

  // Scoped single-book search: loads ONLY the requested book JSON, never index.json or other books
  if (scope === 'book' && options.bookSlug) {
    let bookEntries: SearchIndexEntry[] = [];
    try {
      bookEntries = await loadBook(options.bookSlug);
    } catch {
      bookEntries = [];
    }

    const results: SearchResultItem[] = [];
    if (refMatch && refMatch.book.slug === options.bookSlug) {
      const indexed = bookEntries.find((e) => e.chapter === refMatch.chapter);
      results.push(buildReferenceHit(refMatch, indexed, lang));
    }

    const bm25Hits = scoreEntriesBm25(
      bookEntries,
      trimmed,
      lang,
      refMatch ? { bookSlug: refMatch.book.slug, chapter: refMatch.chapter } : undefined
    );
    return [...results, ...bm25Hits].sort((a, b) => b.score - a.score).slice(0, 8);
  }

  // Exact Bible reference queries resolve using just that book's JSON (avoids loading full index.json)
  if (refMatch) {
    let targetBookEntries: SearchIndexEntry[] = getCachedBook(refMatch.book.slug) ?? [];
    if (targetBookEntries.length === 0) {
      try {
        targetBookEntries = await loadBook(refMatch.book.slug);
      } catch {
        targetBookEntries = [];
      }
    }
    const indexed = targetBookEntries.find((e) => e.chapter === refMatch.chapter);
    return [buildReferenceHit(refMatch, indexed, lang)];
  }

  // Full-Bible keyword/topic search: loads full search index lazily ONLY when invoked
  let fullIndex: SearchIndexEntry[] = [];
  try {
    fullIndex = await loadFullSearchIndex();
  } catch {
    // Graceful fallback: search whatever books are currently cached if offline/unavailable
    const fallbackEntries: SearchIndexEntry[] = [];
    for (const book of BIBLE_BOOKS) {
      const cached = getCachedBook(book.slug);
      if (cached) fallbackEntries.push(...cached);
    }
    fullIndex = fallbackEntries;
  }

  return scoreEntriesBm25(fullIndex, trimmed, lang)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export async function loadChapterBundle(
  bookSlug: string,
  chapter: number,
  lang: SupportedLang
): Promise<LoadedChapterBundle> {
  const key = `${bookSlug}_${chapter}`;
  const cacheKey = `${lang}:${key}`;
  const cached = chapterBundleCache.get(cacheKey);
  if (cached) return cached;

  const existingInFlight = chapterBundleInFlight.get(cacheKey);
  if (existingInFlight) return existingInFlight;

  const requestPromise = (async (): Promise<LoadedChapterBundle> => {
    try {
      const bookMeta = getBookBySlug(bookSlug) ?? BIBLE_BOOKS[0];
      const bookName = getBookName(bookMeta, lang);
      const langOpt = getLanguageOption(lang);
      const artwork = getChapterArtwork(bookSlug, chapter);
      const ui = getUiStrings(lang);

      try {
        const [bibleRes, devRes, lyricsRes] = await Promise.all([
          fetch(`/data/bible/${lang}/${key}.json`),
          fetch(`/data/devotionals/${lang}/${key}.json`),
          fetch(`/data/lyrics/${lang}/${key}.json`),
        ]);

        if (bibleRes.ok && devRes.ok && lyricsRes.ok) {
          const [scripture, devotional, lyrics] = await Promise.all([
            bibleRes.json() as Promise<ChapterScripture>,
            devRes.json() as Promise<ChapterDevotionalBundle>,
            lyricsRes.json() as Promise<SongLyrics>,
          ]);

          const loadedBundle: LoadedChapterBundle = { scripture, devotional, lyrics, artwork };
          chapterBundleCache.set(cacheKey, loadedBundle);
          return loadedBundle;
        }
      } catch {
        // Fall through to unseeded canonical study sheet
      }

      // Fallback for canonical chapters not yet pre-generated in public/data/
      const ref = `${bookName} ${chapter}`;
      const testamentLabel = bookMeta.testament === 'OT' ? ui.unseeded.otLabel : ui.unseeded.ntLabel;

      const fallbackScripture: ChapterScripture = {
        bookSlug,
        bookName,
        chapter,
        lang,
        translation: langOpt.translationName,
        isPreseeded: false,
        verses: [
          {
            verse: 1,
            text: ui.unseeded.verse1(ref, testamentLabel, bookMeta.chapters),
          },
          {
            verse: 2,
            text: ui.unseeded.verse2(ref, key),
          },
        ],
      };

      const fallbackDevotional: ChapterDevotionalBundle = {
        bookSlug,
        chapter,
        lang,
        reference: ref,
        variants: Object.fromEntries(
          ([1, 3, 5, 10, 15] as DevotionalLength[]).map((len) => [
            String(len),
            {
              length: len,
              title: ui.unseeded.devTitle(ref),
              estimatedMinutes: len,
              historicalBackground: ui.unseeded.historicalBackground(bookName, bookMeta.id, testamentLabel),
              theologicalContext: ui.unseeded.theologicalContext(),
              practicalApplication: ui.unseeded.practicalApplication(ref),
              reflectionPrayer: ui.unseeded.reflectionPrayer(ref),
            },
          ])
        ),
      };

      const fallbackLyrics: SongLyrics = {
        bookSlug,
        chapter,
        lang,
        title: ui.unseeded.songTitle(ref),
        tempoNote: ui.unseeded.tempoNote,
        verse1: ui.unseeded.songVerse1(ref),
        chorus: ui.unseeded.songChorus,
        verse2: ui.unseeded.songVerse2,
        bridge: ui.unseeded.songBridge,
      };

      const fallbackBundle: LoadedChapterBundle = {
        scripture: fallbackScripture,
        devotional: fallbackDevotional,
        lyrics: fallbackLyrics,
        artwork,
      };
      chapterBundleCache.set(cacheKey, fallbackBundle);
      return fallbackBundle;
    } finally {
      chapterBundleInFlight.delete(cacheKey);
    }
  })();

  chapterBundleInFlight.set(cacheKey, requestPromise);
  return requestPromise;
}
