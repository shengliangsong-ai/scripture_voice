import { useCallback, useEffect, useState } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { BibleSidebar } from './components/BibleSidebar';
import { Header } from './components/Header';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PassageReader } from './components/PassageReader';
import { SearchBar } from './components/SearchBar';
import {
  DEFAULT_UI_LANGS,
  DEVOTIONAL_LENGTHS,
  NARRATOR_VOICES,
  SUPPORTED_LANGUAGES,
  getBookBySlug,
  getBookName,
  getComplementaryVoice,
  getLanguageOption,
} from './data/bibleBooks';
import { getUiStrings } from './data/uiStrings';
import {
  LoadedChapterBundle,
  bibleDataService,
  getAvailableLanguagesFromManifest,
  loadChapterBundle,
  precacheBookChapters,
} from './services/offlineDataService';
import {
  AudioSegment,
  DevotionalLength,
  NarratorVoice,
  ReaderFontSize,
  ReadingHistoryItem,
  SupportedLang,
  VerseBookmark,
} from './types/scripture';

const HISTORY_STORAGE_KEY = 'scripture_voice_history_v1';
const BOOKMARKS_STORAGE_KEY = 'scripture_voice_bookmarks_v1';
const PREFS_STORAGE_KEY = 'scripture_voice_prefs_v1';

interface StoredPrefs {
  lang?: SupportedLang;
  devotionalLength?: DevotionalLength;
  voice?: NarratorVoice;
  fontSize?: ReaderFontSize;
}

function readStoredPrefs(): StoredPrefs {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredPrefs;
  } catch {
    return {};
  }
}

const FLAGSHIP_PASSAGES: Array<{ bookSlug: string; chapter: number }> = [
  { bookSlug: 'genesis', chapter: 1 },
  { bookSlug: 'exodus', chapter: 1 },
  { bookSlug: 'ezra', chapter: 2 },
  { bookSlug: 'psalm', chapter: 23 },
  { bookSlug: 'psalm', chapter: 91 },
  { bookSlug: 'proverbs', chapter: 3 },
  { bookSlug: 'isaiah', chapter: 40 },
  { bookSlug: 'matthew', chapter: 5 },
  { bookSlug: 'john', chapter: 3 },
  { bookSlug: 'romans', chapter: 8 },
  { bookSlug: '1corinthians', chapter: 13 },
  { bookSlug: 'philippians', chapter: 4 },
  { bookSlug: 'revelation', chapter: 1 },
];

function readStoredHistory(): ReadingHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStoredBookmarks(): VerseBookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [initialPrefs] = useState<StoredPrefs>(() => readStoredPrefs());
  const [availableLangs, setAvailableLangs] = useState<SupportedLang[]>(DEFAULT_UI_LANGS);
  const [lang, setLang] = useState<SupportedLang>(() =>
    DEFAULT_UI_LANGS.includes(initialPrefs.lang as SupportedLang) ? initialPrefs.lang! : 'en'
  );
  const [devotionalLength, setDevotionalLength] = useState<DevotionalLength>(() =>
    DEVOTIONAL_LENGTHS.includes(initialPrefs.devotionalLength as DevotionalLength)
      ? initialPrefs.devotionalLength!
      : 5
  );
  const [voice, setVoice] = useState<NarratorVoice>(() =>
    NARRATOR_VOICES.some((v) => v.name === initialPrefs.voice) ? initialPrefs.voice! : 'Fenrir'
  );
  const [fontSize, setFontSize] = useState<ReaderFontSize>(() =>
    initialPrefs.fontSize === 'sm' || initialPrefs.fontSize === 'md' || initialPrefs.fontSize === 'lg'
      ? initialPrefs.fontSize
      : 'md'
  );

  useEffect(() => {
    let cancelled = false;
    void bibleDataService
      .loadManifest()
      .then((manifest) => {
        if (cancelled) return;
        const manifestLangs = getAvailableLanguagesFromManifest(manifest);
        setAvailableLangs(manifestLangs);
        if (
          initialPrefs.lang &&
          SUPPORTED_LANGUAGES.some((l) => l.code === initialPrefs.lang) &&
          manifestLangs.includes(initialPrefs.lang)
        ) {
          setLang(initialPrefs.lang);
        }
      })
      .catch(() => {
        // Keep DEFAULT_UI_LANGS
      });
    return () => {
      cancelled = true;
    };
  }, [initialPrefs.lang]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PREFS_STORAGE_KEY,
        JSON.stringify({ lang, devotionalLength, voice, fontSize })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [lang, devotionalLength, voice, fontSize]);

  const [activeBookSlug, setActiveBookSlug] = useState<string>('psalm');
  const [activeChapter, setActiveChapter] = useState<number>(23);
  const [highlightVerse, setHighlightVerse] = useState<number | undefined>(undefined);
  const [spokenVerse, setSpokenVerse] = useState<number | undefined>(undefined);

  const [bundle, setBundle] = useState<LoadedChapterBundle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCachingBook, setIsCachingBook] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [reloadNonce, setReloadNonce] = useState<number>(0);

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  const [history, setHistory] = useState<ReadingHistoryItem[]>(() => readStoredHistory());
  const [bookmarks, setBookmarks] = useState<VerseBookmark[]>(() => readStoredBookmarks());

  const [activeAudio, setActiveAudio] = useState<{
    title: string;
    segments: AudioSegment[];
  } | null>(null);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  const recordHistory = useCallback(
    (bookSlug: string, chapter: number, activeLang: SupportedLang) => {
      const book = getBookBySlug(bookSlug);
      const ref = `${book ? getBookName(book, activeLang) : bookSlug} ${chapter}`;
      const id = `${bookSlug}_${chapter}_${activeLang}`;

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        const next: ReadingHistoryItem[] = [
          {
            id,
            bookSlug,
            chapter,
            reference: ref,
            lang: activeLang,
            visitedAt: Date.now(),
          },
          ...filtered,
        ].slice(0, 30);

        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(false);
    setAudioNotice(null);

    // Never leave stale content from a different book visible while loading
    setBundle((prev) =>
      prev && prev.scripture.bookSlug !== activeBookSlug ? null : prev
    );

    loadChapterBundle(activeBookSlug, activeChapter, lang)
      .then((loaded) => {
        if (cancelled) return;
        setBundle(loaded);
        setIsLoading(false);
        recordHistory(activeBookSlug, activeChapter, lang);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeBookSlug, activeChapter, lang, reloadNonce, recordHistory]);

  const buildLiveSegments = useCallback(
    (
      loadedBundle: LoadedChapterBundle,
      activeLang: SupportedLang,
      primaryVoice: NarratorVoice,
      len: DevotionalLength
    ): AudioSegment[] => {
      const langOpt = getLanguageOption(activeLang);
      const compVoice = getComplementaryVoice(primaryVoice);
      const verses = loadedBundle.scripture.verses;
      const dev =
        loadedBundle.devotional.variants[String(len)] ??
        loadedBundle.devotional.variants['5'] ??
        Object.values(loadedBundle.devotional.variants)[0];

      const splitSentences = (text: string): string[] =>
        text
          .split(/(?<=[。！？.!?])\s+|\n+/)
          .map((s) => s.trim())
          .filter(Boolean);

      const mid = Math.max(1, Math.ceil(verses.length / 2));
      const intro =
        activeLang === 'zh' || activeLang === 'zh-CN'
          ? `${loadedBundle.scripture.bookName}第${loadedBundle.scripture.chapter}章。`
          : `${loadedBundle.scripture.bookName}, chapter ${loadedBundle.scripture.chapter}.`;

      const p1 = [intro, ...verses.slice(0, mid).map((v) => v.text)];
      const p1Verses: Array<number | undefined> = [
        undefined,
        ...verses.slice(0, mid).map((v) => v.verse),
      ];
      const p2 = verses.slice(mid).map((v) => v.text);
      const p2Verses: Array<number | undefined> = verses.slice(mid).map((v) => v.verse);
      const p3 = [
        dev.title,
        ...splitSentences(dev.historicalBackground),
        ...splitSentences(dev.theologicalContext),
      ];
      const p4 = [
        ...splitSentences(dev.practicalApplication),
        ...splitSentences(dev.reflectionPrayer),
      ];
      const ui = getUiStrings(activeLang);
      const hasP2 = p2.length > 0;
      const linesByPart = [p1, hasP2 ? p2 : p1, p3, p4];
      const verseNumsByPart: Array<Array<number | undefined> | undefined> = [
        p1Verses,
        hasP2 ? p2Verses : p1Verses,
        undefined,
        undefined,
      ];
      const labels = [
        ui.scripturePartLabel(1, primaryVoice),
        ui.scripturePartLabel(2, primaryVoice),
        ui.devotionalPartLabel(compVoice, false),
        ui.devotionalPartLabel(compVoice, true),
      ];

      return linesByPart.map((lines, idx) => {
        const isCjk =
          activeLang === 'zh' ||
          activeLang === 'zh-CN' ||
          activeLang === 'ja' ||
          activeLang === 'ko';
        const estSec = Math.max(4, Math.round(lines.join('').length / (isCjk ? 4.2 : 13.5)));
        return {
          part: idx + 1,
          totalParts: 4,
          role: idx < 2 ? 'scripture' : 'devotional',
          voice: idx < 2 ? primaryVoice : compVoice,
          label: labels[idx],
          durationSec: estSec,
          bcp47: langOpt.bcp47,
          lang: activeLang,
          spokenLines: lines,
          spokenVerseNumbers: verseNumsByPart[idx],
        };
      });
    },
    []
  );

  // If language, voice, or chapter changes while audio is open, refresh or close cleanly
  useEffect(() => {
    if (!activeAudio || !bundle) return;
    if (
      bundle.scripture.bookSlug !== activeBookSlug ||
      bundle.scripture.chapter !== activeChapter ||
      bundle.scripture.lang !== lang
    ) {
      return;
    }

    const isLyricsMode = activeAudio.segments.length === 1 && activeAudio.segments[0]?.role === 'lyrics';
    const langOpt = getLanguageOption(lang);
    const ui = getUiStrings(lang);
    const ref = `${bundle.scripture.bookName} ${bundle.scripture.chapter}`;

    if (isLyricsMode) {
      const lyr = bundle.lyrics;
      const spokenLines = [lyr.title, ...lyr.verse1, ...lyr.chorus, ...lyr.verse2, ...lyr.bridge];
      setActiveAudio({
        title: `${ref} · ${ui.lyricsModeLabel}`,
        segments: [
          {
            ...activeAudio.segments[0],
            voice,
            label: ui.lyricsReadingLabel(voice),
            bcp47: langOpt.bcp47,
            lang,
            spokenLines,
          },
        ],
      });
    } else {
      setActiveAudio({
        title: `${ref} · ${ui.podcastLabel}`,
        segments: buildLiveSegments(bundle, lang, voice, devotionalLength),
      });
    }
  }, [lang, voice, devotionalLength, bundle, activeBookSlug, activeChapter, buildLiveSegments]);

  const navigateToChapter = (bookSlug: string, chapter: number, verse?: number) => {
    setActiveBookSlug(bookSlug);
    setActiveChapter(chapter);
    setHighlightVerse(verse);
    setSpokenVerse(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayPodcast = () => {
    setAudioNotice(null);
    if (!bundle) return;
    const ui = getUiStrings(lang);
    const book = getBookBySlug(activeBookSlug);
    const ref = `${book ? getBookName(book, lang) : activeBookSlug} ${activeChapter}`;
    const segments = buildLiveSegments(bundle, lang, voice, devotionalLength);
    setActiveAudio({
      title: `${ref} · ${ui.podcastLabel}`,
      segments,
    });
  };

  const handlePlayLyrics = () => {
    setAudioNotice(null);
    if (!bundle) return;
    const ui = getUiStrings(lang);
    const langOpt = getLanguageOption(lang);
    const book = getBookBySlug(activeBookSlug);
    const ref = `${book ? getBookName(book, lang) : activeBookSlug} ${activeChapter}`;
    const lyr = bundle.lyrics;
    const spokenLines = [lyr.title, ...lyr.verse1, ...lyr.chorus, ...lyr.verse2, ...lyr.bridge];

    setActiveAudio({
      title: `${ref} · ${ui.lyricsModeLabel}`,
      segments: [
        {
          part: 1,
          totalParts: 1,
          role: 'lyrics',
          voice,
          label: ui.lyricsReadingLabel(voice),
          durationSec: Math.max(4, Math.round(spokenLines.join('').length / 10)),
          bcp47: langOpt.bcp47,
          lang,
          spokenLines,
        },
      ],
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const persistBookmarks = (next: VerseBookmark[]) => {
    setBookmarks(next);
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const handleToggleBookmarkVerse = (v: { verse: number; text: string }) => {
    const id = `${activeBookSlug}_${activeChapter}_${v.verse}_${lang}`;
    const existing = bookmarks.some((b) => b.id === id);
    if (existing) {
      persistBookmarks(bookmarks.filter((b) => b.id !== id));
      return;
    }
    const book = getBookBySlug(activeBookSlug);
    const ref = `${book ? getBookName(book, lang) : activeBookSlug} ${activeChapter}:${v.verse}`;
    const item: VerseBookmark = {
      id,
      bookSlug: activeBookSlug,
      chapter: activeChapter,
      verse: v.verse,
      reference: ref,
      text: v.text,
      lang,
      savedAt: Date.now(),
    };
    persistBookmarks([item, ...bookmarks].slice(0, 100));
  };

  const handleRemoveBookmark = (id: string) => {
    persistBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const handleClearBookmarks = () => {
    persistBookmarks([]);
  };

  const handleCacheBookOffline = async () => {
    if (isCachingBook) return;
    setIsCachingBook(true);
    setAudioNotice(null);
    try {
      const cachedCount = await precacheBookChapters(activeBookSlug, lang);
      const book = getBookBySlug(activeBookSlug);
      const bookName = book ? getBookName(book, lang) : activeBookSlug;
      setAudioNotice(getUiStrings(lang).bookCachedNotice(bookName, cachedCount));
    } finally {
      setIsCachingBook(false);
    }
  };

  const activeBookmarkedVerses = new Set(
    bookmarks
      .filter((b) => b.bookSlug === activeBookSlug && b.chapter === activeChapter && b.lang === lang)
      .map((b) => b.verse)
  );

  const ui = getUiStrings(lang);

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Header
        lang={lang}
        availableLangs={availableLangs}
        onLangChange={setLang}
        devotionalLength={devotionalLength}
        onLengthChange={setDevotionalLength}
        voice={voice}
        onVoiceChange={setVoice}
        isSidebarOpen={isDesktopSidebarOpen}
        onToggleDesktopSidebar={() => setIsDesktopSidebarOpen((v) => !v)}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        historyCount={history.length}
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        <BibleSidebar
          lang={lang}
          activeBookSlug={activeBookSlug}
          activeChapter={activeChapter}
          onSelectChapter={(slug, ch) => navigateToChapter(slug, ch)}
          isDesktopOpen={isDesktopSidebarOpen}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main
          className={`flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6 ${
            activeAudio ? 'pb-28' : 'pb-12'
          }`}
        >
          <SearchBar
            lang={lang}
            activeBookSlug={activeBookSlug}
            onSelectResult={(slug, ch, verse) => navigateToChapter(slug, ch, verse)}
          />

          {/* Quick Flagship Editions Strip */}
          <div className="no-print max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-bible-500 border-b border-bible-200/80 pb-3">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span>{ui.featuredEditionsLabel}</span>
              {FLAGSHIP_PASSAGES.map((item, idx) => {
                const isSelected =
                  activeBookSlug === item.bookSlug && activeChapter === item.chapter;
                const bookMeta = getBookBySlug(item.bookSlug);
                const localizedLabel = `${bookMeta ? getBookName(bookMeta, lang) : item.bookSlug} ${item.chapter}`;
                return (
                  <span key={`${item.bookSlug}_${item.chapter}`} className="inline-flex items-center gap-2.5">
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <button
                      type="button"
                      onClick={() => navigateToChapter(item.bookSlug, item.chapter)}
                      className={`transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'font-semibold text-bible-900 underline decoration-bible-700 underline-offset-4'
                          : 'text-bible-700 hover:text-bible-900'
                      }`}
                    >
                      {localizedLabel}
                    </button>
                  </span>
                );
              })}
            </div>
            <span className="text-[11px] text-bible-500 tabular-nums">
              {ui.offlineArchiveBadge} · v{__APP_VERSION__} ({__BUILD_TIME__})
            </span>
          </div>

          {audioNotice && (
            <div
              role="status"
              className="no-print max-w-4xl mx-auto px-4 py-3 bg-bible-50 border border-bible-200 rounded-lg text-xs text-bible-800"
            >
              {audioNotice}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {loadError ? (
              <div className="bg-white border border-red-200 rounded-xl p-10 text-center space-y-3">
                <p className="text-sm text-red-800">
                  {ui.bookLoadError(
                    (() => {
                      const b = getBookBySlug(activeBookSlug);
                      return b ? getBookName(b, lang) : activeBookSlug;
                    })()
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setReloadNonce((n) => n + 1)}
                  className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-medium bg-bible-800 text-white rounded-md hover:bg-bible-900 transition-colors"
                >
                  {ui.retryButton}
                </button>
              </div>
            ) : bundle && bundle.scripture.bookSlug === activeBookSlug ? (
              <PassageReader
                bundle={bundle}
                isLoading={isLoading}
                devotionalLength={devotionalLength}
                voice={voice}
                highlightVerse={highlightVerse}
                activeSpokenVerse={spokenVerse}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                bookmarkedVerses={activeBookmarkedVerses}
                onToggleBookmarkVerse={handleToggleBookmarkVerse}
                onCacheBookOffline={handleCacheBookOffline}
                isCachingBook={isCachingBook}
                onNavigateChapter={(slug, ch) => navigateToChapter(slug, ch)}
                onPlayPodcast={() => void handlePlayPodcast()}
                onPlayLyrics={() => void handlePlayLyrics()}
              />
            ) : (
              <div className="bg-white border border-bible-200 rounded-xl p-12 text-center text-sm text-bible-500">
                {ui.loadingBookLabel(
                  (() => {
                    const b = getBookBySlug(activeBookSlug);
                    return b ? getBookName(b, lang) : activeBookSlug;
                  })()
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {activeAudio && (
        <AudioPlayer
          lang={lang}
          title={activeAudio.title}
          segments={activeAudio.segments}
          onClose={() => {
            setActiveAudio(null);
            setSpokenVerse(undefined);
          }}
          onActiveVerseChange={setSpokenVerse}
        />
      )}

      <HistoryDrawer
        lang={lang}
        isOpen={isHistoryOpen}
        items={history}
        bookmarks={bookmarks}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={(item) => {
          setLang(item.lang);
          navigateToChapter(item.bookSlug, item.chapter);
        }}
        onSelectBookmark={(bm) => {
          setLang(bm.lang);
          navigateToChapter(bm.bookSlug, bm.chapter, bm.verse);
        }}
        onRemoveBookmark={handleRemoveBookmark}
        onClear={handleClearHistory}
        onClearBookmarks={handleClearBookmarks}
      />

      <HowItWorksModal
        lang={lang}
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <OfflineIndicator lang={lang} />
    </div>
  );
}
