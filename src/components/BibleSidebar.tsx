import { AlertCircle, ChevronDown, ChevronRight, Loader2, RotateCcw, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BIBLE_BOOKS, FEATURED_CHAPTER_KEYS, getBookBySlug, getBookName } from '../data/bibleBooks';
import { getUiStrings } from '../data/uiStrings';
import {
  bibleDataService,
  getAvailableChapterKeysFromManifest,
} from '../services/offlineDataService';
import { BibleChapter, BibleManifest, SupportedLang, Testament } from '../types/scripture';

interface BibleSidebarProps {
  lang: SupportedLang;
  activeBookSlug: string;
  activeChapter: number;
  onSelectChapter: (bookSlug: string, chapter: number) => void;
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function BibleSidebar({
  lang,
  activeBookSlug,
  activeChapter,
  onSelectChapter,
  isDesktopOpen,
  isMobileOpen,
  onCloseMobile,
}: BibleSidebarProps) {
  const [filterText, setFilterText] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<Testament>('NT');
  const [expandedBook, setExpandedBook] = useState<string>(activeBookSlug);
  const [manifest, setManifest] = useState<BibleManifest | null>(null);
  const [loadedBooksMap, setLoadedBooksMap] = useState<Record<string, BibleChapter[]>>({});
  const [loadingBookSlug, setLoadingBookSlug] = useState<string | null>(null);
  const [bookErrorSlug, setBookErrorSlug] = useState<string | null>(null);

  const initialBookRef = useRef(activeBookSlug);
  const latestBookRequestRef = useRef(0);
  const ui = getUiStrings(lang);

  // Startup: fetch ONLY lightweight books-manifest.json
  useEffect(() => {
    let cancelled = false;
    void bibleDataService
      .loadManifest()
      .then((loadedManifest) => {
        if (!cancelled) setManifest(loadedManifest);
      })
      .catch(() => {
        // Sidebar still functions via static BIBLE_BOOKS catalog
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ensureBookLoaded = useCallback((bookSlug: string) => {
    const cached = bibleDataService.getCachedBook(bookSlug);
    if (cached) {
      setLoadedBooksMap((prev) => (prev[bookSlug] ? prev : { ...prev, [bookSlug]: cached }));
      setBookErrorSlug((prev) => (prev === bookSlug ? null : prev));
      setLoadingBookSlug((prev) => (prev === bookSlug ? null : prev));
      return;
    }

    const requestId = ++latestBookRequestRef.current;
    setLoadingBookSlug(bookSlug);
    setBookErrorSlug((prev) => (prev === bookSlug ? null : prev));

    void bibleDataService
      .loadBook(bookSlug)
      .then((chapters) => {
        if (latestBookRequestRef.current !== requestId) return;
        setLoadedBooksMap((prev) => ({ ...prev, [bookSlug]: chapters }));
        setLoadingBookSlug(null);
      })
      .catch(() => {
        if (latestBookRequestRef.current !== requestId) return;
        setLoadingBookSlug(null);
        setBookErrorSlug(bookSlug);
      });
  }, []);

  // Sync testament tab, expansion, and lazy-load when navigating to a different book after startup
  useEffect(() => {
    if (activeBookSlug !== initialBookRef.current) {
      initialBookRef.current = activeBookSlug;
      const activeBook = getBookBySlug(activeBookSlug);
      if (activeBook) {
        setTestamentFilter(activeBook.testament);
      }
      setExpandedBook(activeBookSlug);
      ensureBookLoaded(activeBookSlug);
    }
  }, [activeBookSlug, ensureBookLoaded]);

  const handleToggleBook = (bookSlug: string) => {
    if (expandedBook === bookSlug) {
      setExpandedBook('');
      return;
    }
    setExpandedBook(bookSlug);
    ensureBookLoaded(bookSlug);
  };

  const availableKeys = useMemo(() => {
    const merged = new Set(FEATURED_CHAPTER_KEYS);
    const manifestKeys = getAvailableChapterKeysFromManifest(manifest, lang);
    for (const key of manifestKeys) {
      merged.add(key);
    }
    for (const chapters of Object.values(loadedBooksMap)) {
      for (const entry of chapters) {
        if (!entry.availableLangs || entry.availableLangs.includes(lang)) {
          merged.add(entry.id);
        }
      }
    }
    return merged;
  }, [manifest, loadedBooksMap, lang]);

  const filteredBooks = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return BIBLE_BOOKS.filter((b) => {
      if (b.testament !== testamentFilter) return false;
      if (!q) return true;
      const localized = getBookName(b, lang).toLowerCase();
      return localized.includes(q) || b.englishName.toLowerCase().includes(q) || b.slug.includes(q);
    });
  }, [filterText, testamentFilter, lang]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-bible-200">
      <div className="p-4 border-b border-bible-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold tracking-wider text-bible-900">
            {ui.canonicalIndexTitle}
          </h2>
          <span className="text-xs text-bible-500 tabular-nums">{ui.booksCountLabel}</span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label={ui.closeIndexAria}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-700 hover:bg-bible-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-bible-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={ui.filterBooksPlaceholder}
            aria-label={ui.filterBooksPlaceholder}
            className="w-full h-9 pl-8 pr-3 text-xs bg-[#FAFAF9] border border-bible-200 rounded-md text-bible-900 placeholder:text-bible-500 focus-visible:outline-2 focus-visible:outline-bible-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 bg-[#F5F5F4] rounded-md">
          {(['OT', 'NT'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTestamentFilter(tab)}
              className={`h-7 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                testamentFilter === tab
                  ? 'bg-white text-bible-900 shadow-xs'
                  : 'text-bible-700 hover:text-bible-900'
              }`}
            >
              {tab === 'OT' ? ui.filterOld : ui.filterNew}
            </button>
          ))}
        </div>
      </div>

      <nav
        aria-label={ui.canonicalIndexTitle}
        className="flex-1 overflow-y-auto parchment-scrollbar p-2 space-y-0.5"
      >
        {filteredBooks.map((book) => {
          const isExpanded = expandedBook === book.slug;
          const isActiveBook = activeBookSlug === book.slug;
          const isBookLoading = loadingBookSlug === book.slug;
          const hasBookError = bookErrorSlug === book.slug;
          const displayName = getBookName(book, lang);

          return (
            <div key={book.slug} className="rounded-md">
              <button
                type="button"
                onClick={() => handleToggleBook(book.slug)}
                aria-expanded={isExpanded}
                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md transition-colors text-xs ${
                  isActiveBook
                    ? 'bg-bible-100 text-bible-900 font-semibold'
                    : 'text-bible-800 hover:bg-bible-50 font-medium'
                }`}
              >
                <span className="flex items-center gap-1.5 min-w-0 pr-2">
                  <span className="text-[11px] text-bible-400 tabular-nums w-5 shrink-0 text-right">
                    {book.id}.
                  </span>
                  <span className="truncate">{displayName}</span>
                </span>
                <span className="flex items-center gap-1.5 shrink-0 text-bible-500 tabular-nums">
                  <span className="text-[11px]">{ui.chapterCountShort(book.chapters)}</span>
                  {isBookLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-bible-700" />
                  ) : isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>

              {isExpanded && (
                <div className="bg-[#FAFAF9] border-t border-bible-100">
                  {isBookLoading && (
                    <div className="px-3 py-1.5 text-[11px] text-bible-500 flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{ui.loadingBookLabel(displayName)}</span>
                    </div>
                  )}

                  {hasBookError && (
                    <div className="mx-2 mt-2 px-2.5 py-2 rounded border border-red-200 bg-red-50 text-[11px] text-red-800 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{ui.bookLoadError(displayName)}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => ensureBookLoaded(book.slug)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-red-200 text-red-900 font-medium hover:bg-red-100 shrink-0"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{ui.retryButton}</span>
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-5 gap-1 px-2 py-2">
                    {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => {
                      const isCurrent = isActiveBook && activeChapter === ch;
                      const isFeatured = availableKeys.has(`${book.slug}_${ch}`);
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => {
                            onSelectChapter(book.slug, ch);
                            onCloseMobile();
                          }}
                          title={ui.featuredChapterTooltip(`${displayName} ${ch}`, isFeatured)}
                          className={`h-8 text-xs rounded tabular-nums transition-colors ${
                            isCurrent
                              ? 'bg-bible-800 text-white font-semibold'
                              : isFeatured
                              ? 'bg-bible-100 text-bible-900 font-semibold hover:bg-bible-200 underline decoration-bible-500 underline-offset-2'
                              : 'text-bible-700 hover:bg-bible-100'
                          }`}
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredBooks.length === 0 && (
          <p className="text-xs text-bible-500 text-center py-8 px-4">
            {ui.noMatchingBooks(filterText)}
          </p>
        )}
      </nav>

      <div className="px-4 py-2.5 border-t border-bible-200 bg-[#FAFAF9] text-[11px] text-bible-500">
        {ui.sidebarFooterHint}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      {isDesktopOpen && (
        <aside className="no-print hidden lg:block w-72 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Slide-out Drawer */}
      {isMobileOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-bible-900/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-80 max-w-[85vw] h-full shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
