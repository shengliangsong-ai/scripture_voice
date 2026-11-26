export type SupportedLang =
  | 'en'
  | 'zh'
  | 'zh-CN'
  | 'hi'
  | 'es'
  | 'fr'
  | 'pt'
  | 'ja'
  | 'ko'
  | 'it'
  | 'de';

export type DevotionalLength = 1 | 3 | 5 | 10 | 15;

export type NarratorVoice = 'Fenrir' | 'Kore' | 'Puck' | 'Charon' | 'Zephyr';

export type Testament = 'OT' | 'NT';

export interface BibleBookMeta {
  id: number;
  slug: string;
  chapters: number;
  testament: Testament;
  englishName: string;
  names: Record<SupportedLang, string>;
  aliases: string[];
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface ChapterScripture {
  bookSlug: string;
  bookName: string;
  chapter: number;
  lang: SupportedLang;
  translation: string;
  verses: BibleVerse[];
  isPreseeded: boolean;
}

export interface DevotionalVariant {
  length: DevotionalLength;
  title: string;
  estimatedMinutes: number;
  historicalBackground: string;
  theologicalContext: string;
  practicalApplication: string;
  reflectionPrayer: string;
}

export interface ChapterDevotionalBundle {
  bookSlug: string;
  chapter: number;
  lang: SupportedLang;
  reference: string;
  variants: Record<string, DevotionalVariant>;
}

export interface SongLyrics {
  bookSlug: string;
  chapter: number;
  lang: SupportedLang;
  title: string;
  tempoNote: string;
  verse1: string[];
  chorus: string[];
  verse2: string[];
  bridge: string[];
}

export interface AudioSegment {
  part: number;
  totalParts: number;
  role: 'scripture' | 'devotional' | 'lyrics';
  voice: NarratorVoice;
  label: string;
  durationSec: number;
  bcp47: string;
  lang: SupportedLang;
  spokenLines: string[];
}

export interface SearchIndexEntry {
  id: string;
  bookSlug: string;
  chapter: number;
  reference: string;
  title: string;
  topics: string[];
  snippet: Record<SupportedLang, string>;
  tokens: Record<string, number>;
  verseMap: Array<{ verse: number; text: string }>;
  hasArtwork: boolean;
  artworkUrl?: string;
  availableLangs?: SupportedLang[];
}

export type BibleChapter = SearchIndexEntry;

export interface BibleManifestBook {
  bookSlug: string;
  file: string;
  chapterCount: number;
  chapters: number[];
  defaultLangs?: SupportedLang[];
  chapterLangs?: Record<string, SupportedLang[]>;
}

export interface BibleManifest {
  version: number;
  generatedAt: string;
  totalBooks: number;
  totalChapters: number;
  books: BibleManifestBook[];
}

export interface SearchResultItem {
  bookSlug: string;
  chapter: number;
  verse?: number;
  reference: string;
  title: string;
  snippet: string;
  score: number;
  matchedTopics: string[];
}

export interface ReadingHistoryItem {
  id: string;
  bookSlug: string;
  chapter: number;
  reference: string;
  lang: SupportedLang;
  visitedAt: number;
}
