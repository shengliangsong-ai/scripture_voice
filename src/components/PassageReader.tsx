import {
  Bookmark,
  BookMarked,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  HardDriveDownload,
  Headphones,
  Music,
  Play,
  Share2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getAdjacentChapter } from '../data/bibleBooks';
import { getUiStrings } from '../data/uiStrings';
import { LoadedChapterBundle } from '../services/offlineDataService';
import { DevotionalLength, NarratorVoice, ReaderFontSize } from '../types/scripture';
import {
  buildPlainTextPassage,
  copyRichPassageToClipboard,
  exportStudySheetToPdf,
} from '../utils/exportUtils';

interface PassageReaderProps {
  bundle: LoadedChapterBundle;
  isLoading: boolean;
  devotionalLength: DevotionalLength;
  voice: NarratorVoice;
  highlightVerse?: number;
  activeSpokenVerse?: number;
  fontSize: ReaderFontSize;
  onFontSizeChange: (size: ReaderFontSize) => void;
  bookmarkedVerses: Set<number>;
  onToggleBookmarkVerse: (verse: { verse: number; text: string }) => void;
  onCacheBookOffline: () => Promise<void>;
  isCachingBook: boolean;
  onNavigateChapter: (bookSlug: string, chapter: number) => void;
  onPlayPodcast: () => void;
  onPlayLyrics: () => void;
}

const SCRIPTURE_SIZE_CLASSES: Record<ReaderFontSize, string> = {
  sm: 'text-[15px] leading-[1.75]',
  md: 'text-[17px] leading-[1.8]',
  lg: 'text-[19.5px] leading-[1.85]',
};

const DEVOTIONAL_SIZE_CLASSES: Record<ReaderFontSize, string> = {
  sm: 'text-[14.5px] leading-[1.75]',
  md: 'text-[15.5px] leading-[1.8]',
  lg: 'text-[17.5px] leading-[1.85]',
};

export function PassageReader({
  bundle,
  isLoading,
  devotionalLength,
  voice,
  highlightVerse,
  activeSpokenVerse,
  fontSize,
  onFontSizeChange,
  bookmarkedVerses,
  onToggleBookmarkVerse,
  onCacheBookOffline,
  isCachingBook,
  onNavigateChapter,
  onPlayPodcast,
  onPlayLyrics,
}: PassageReaderProps) {
  const [showLyrics, setShowLyrics] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [imageError, setImageError] = useState(false);

  const printableRef = useRef<HTMLDivElement | null>(null);
  const shareMenuRef = useRef<HTMLDivElement | null>(null);
  const lyricsPanelRef = useRef<HTMLElement | null>(null);
  const verseRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const { scripture, devotional, lyrics, artwork } = bundle;
  const ui = getUiStrings(scripture.lang);
  const artworkKey = `${scripture.bookSlug}_${scripture.chapter}`;
  const reference = `${scripture.bookName} ${scripture.chapter}`;
  const localizedCaption =
    ui.artworkCaptions[artworkKey] ?? `${ui.offlinePlateLabel} · ${reference}`;
  const activeDevotional =
    devotional.variants[String(devotionalLength)] ??
    devotional.variants['5'] ??
    Object.values(devotional.variants)[0];

  const prevChapter = getAdjacentChapter(scripture.bookSlug, scripture.chapter, 'prev');
  const nextChapter = getAdjacentChapter(scripture.bookSlug, scripture.chapter, 'next');

  useEffect(() => {
    setImageError(false);
  }, [artwork?.url, scripture.bookSlug, scripture.chapter]);

  useEffect(() => {
    if (!activeSpokenVerse) return;
    const el = verseRefs.current[activeSpokenVerse];
    if (!el) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [activeSpokenVerse]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const notify = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleCopyRich = async () => {
    setShareMenuOpen(false);
    const ok = await copyRichPassageToClipboard(scripture, activeDevotional, artwork?.url);
    notify(ok ? ui.copiedRichNotice : ui.clipboardUnavailableNotice);
  };

  const handleCopyPlain = async () => {
    setShareMenuOpen(false);
    try {
      const plain = buildPlainTextPassage(scripture, activeDevotional, lyrics);
      await navigator.clipboard.writeText(plain);
      notify(ui.copiedPlainNotice);
    } catch {
      notify(ui.clipboardUnavailableNotice);
    }
  };

  const handleNativeShare = async () => {
    setShareMenuOpen(false);
    const plain = buildPlainTextPassage(scripture, activeDevotional);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${reference} — ${ui.appName}`,
          text: plain.slice(0, 800),
        });
        return;
      } catch {
        // User cancelled or share unsupported
      }
    }
    await handleCopyPlain();
  };

  const handleExportPdf = async () => {
    setShareMenuOpen(false);
    setIsExportingPdf(true);
    try {
      await exportStudySheetToPdf({
        scripture,
        devotional: activeDevotional,
        artworkUrl: artwork?.url,
        artworkCaption: localizedCaption,
        lyrics: showLyrics ? lyrics : undefined,
        filename: `${scripture.bookSlug}_${scripture.chapter}_scripture_voice.pdf`,
      });
      notify(ui.pdfExportedNotice);
    } catch (err) {
      console.error('[Scripture Voice] PDF export failed:', err);
      notify(ui.pdfFailedNotice);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyLyrics = async () => {
    const text = [
      lyrics.title,
      '',
      ...lyrics.verse1,
      '',
      `[${ui.chorusLabel}]`,
      ...lyrics.chorus,
      '',
      ...lyrics.verse2,
      '',
      `[${ui.bridgeLabel}]`,
      ...lyrics.bridge,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLyrics(true);
      window.setTimeout(() => setCopiedLyrics(false), 2000);
    } catch {
      notify(ui.clipboardUnavailableNotice);
    }
  };

  const handleToggleLyrics = () => {
    const next = !showLyrics;
    setShowLyrics(next);
    if (next) {
      window.setTimeout(() => {
        lyricsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  };

  return (
    <article
      ref={printableRef}
      className="print-only-prose bg-white border border-bible-200 rounded-xl shadow-xs overflow-hidden"
    >
      {/* Editorial Card Header */}
      <header className="px-6 py-5 sm:px-10 sm:py-7 border-b border-bible-200 bg-[#FAFAF9]/60">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                disabled={!prevChapter}
                onClick={() => prevChapter && onNavigateChapter(prevChapter.bookSlug, prevChapter.chapter)}
                aria-label={ui.prevChapterAria}
                className="no-print inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium text-bible-700 bg-white border border-bible-200 rounded-md hover:bg-bible-100 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{ui.prevButton}</span>
              </button>

              <button
                type="button"
                disabled={!nextChapter}
                onClick={() => nextChapter && onNavigateChapter(nextChapter.bookSlug, nextChapter.chapter)}
                aria-label={ui.nextChapterAria}
                className="no-print inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium text-bible-700 bg-white border border-bible-200 rounded-md hover:bg-bible-100 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap"
              >
                <span>{ui.nextButton}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-bible-900 text-balance">
              {reference}
            </h1>

            {/* Zero-pill metadata line */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-bible-500">
              <span>{scripture.translation}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {scripture.verses.length} {ui.versesUnit}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {activeDevotional.estimatedMinutes} {ui.reflectionUnit}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {ui.voiceLabel}: {voice}
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="no-print flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onPlayPodcast}
              className="inline-flex items-center gap-2 h-10 px-4 text-xs font-semibold text-white bg-bible-800 hover:bg-bible-900 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{ui.playPodcastButton}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleLyrics}
              aria-expanded={showLyrics}
              className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs font-medium border rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700 ${
                showLyrics
                  ? 'bg-bible-100 border-bible-400 text-bible-900'
                  : 'bg-white border-bible-200 text-bible-800 hover:bg-bible-50'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-bible-700" />
              <span>{showLyrics ? ui.hideLyricsButton : ui.viewLyricsButton}</span>
            </button>

            <button
              type="button"
              disabled={isExportingPdf}
              onClick={() => void handleExportPdf()}
              className="inline-flex items-center gap-2 h-10 px-3.5 text-xs font-medium bg-white border border-bible-200 text-bible-800 hover:bg-bible-50 disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700"
            >
              <Download className="w-3.5 h-3.5 text-bible-700" />
              <span>{isExportingPdf ? ui.exportingLabel : ui.downloadPdfButton}</span>
            </button>

            <div ref={shareMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShareMenuOpen((v) => !v)}
                aria-expanded={shareMenuOpen}
                className="inline-flex items-center gap-2 h-10 px-3.5 text-xs font-medium bg-white border border-bible-200 text-bible-800 hover:bg-bible-50 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700"
              >
                <Share2 className="w-3.5 h-3.5 text-bible-700" />
                <span>{ui.shareExportButton}</span>
              </button>

              {shareMenuOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-56 bg-white border border-bible-200 rounded-lg shadow-lg py-1 z-30">
                  <button
                    type="button"
                    onClick={() => void handleCopyRich()}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs text-bible-800 hover:bg-bible-50 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-bible-500" />
                    <span>{ui.copyRichText}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCopyPlain()}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs text-bible-800 hover:bg-bible-50 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-bible-500" />
                    <span>{ui.copyPlainText}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleNativeShare()}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs text-bible-800 hover:bg-bible-50 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-bible-500" />
                    <span>{ui.shareViaDevice}</span>
                  </button>
                  <div className="my-1 border-t border-bible-100" />
                  <button
                    type="button"
                    onClick={() => void handleExportPdf()}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium text-bible-900 hover:bg-bible-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-bible-700" />
                    <span>{ui.exportPdf}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {toastMessage && (
          <p role="status" className="mt-3 text-xs font-medium text-bible-800">
            {toastMessage}
          </p>
        )}
      </header>

      {/* Main Content Body */}
      <div className={`px-6 py-7 sm:px-10 sm:py-9 space-y-9 transition-opacity ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
        {/* Classical Oil-Painting Illustration Banner */}
        <figure className="space-y-2">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-bible-200 bg-[#F5F5F4]">
            {artwork && !imageError ? (
              <img
                src={artwork.url}
                alt={localizedCaption}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-bible-50 via-[#F5F5F4] to-bible-100">
                <BookMarked className="w-9 h-9 text-bible-400 stroke-[1.25] mb-3" />
                <p className="font-display text-lg sm:text-xl text-bible-800 tracking-wide">
                  {reference}
                </p>
                <p className="mt-1 text-xs text-bible-500 max-w-md">
                  {ui.archivalPlateSubtitle(scripture.translation)}
                </p>
              </div>
            )}
          </div>
          <figcaption className="text-xs font-serif italic text-bible-500">
            {artwork && !imageError
              ? `${ui.figurePrefix} — ${localizedCaption}`
              : `${ui.figurePrefix} — ${ui.offlinePlateLabel} · ${reference}`}
          </figcaption>
        </figure>

        {/* Reader Preferences Bar: Font Size + Offline Book Cache */}
        <div className="no-print max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div
            role="group"
            aria-label={ui.fontSizeAria}
            className="inline-flex items-center gap-1 p-1 bg-bible-50 border border-bible-200 rounded-lg"
          >
            {(['sm', 'md', 'lg'] as ReaderFontSize[]).map((sizeKey) => (
              <button
                key={sizeKey}
                type="button"
                onClick={() => onFontSizeChange(sizeKey)}
                aria-pressed={fontSize === sizeKey}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  fontSize === sizeKey
                    ? 'bg-white text-bible-900 shadow-xs'
                    : 'text-bible-600 hover:text-bible-900'
                }`}
              >
                {ui.fontSizes[sizeKey]}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={isCachingBook}
            onClick={() => void onCacheBookOffline()}
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-bible-800 bg-white border border-bible-200 hover:bg-bible-50 disabled:opacity-60 rounded-md transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-bible-700"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-bible-700" />
            <span>{isCachingBook ? ui.cachingBookLabel : ui.cacheBookButton}</span>
          </button>
        </div>

        {/* Styled Scripture Blockquote (subtle top/bottom hairline rules, decorative quotation marks) */}
        <section aria-label="Scripture passage" className="max-w-2xl mx-auto">
          <div className="relative py-8 border-y border-bible-200">
            <span
              aria-hidden="true"
              className="block font-display text-5xl leading-none text-bible-400 select-none mb-2"
            >
              “
            </span>

            <blockquote className={`space-y-4 font-serif text-bible-900 ${SCRIPTURE_SIZE_CLASSES[fontSize]}`}>
              {scripture.verses.map((v, idx) => {
                const isSearchHit = highlightVerse === v.verse;
                const isSpoken = activeSpokenVerse === v.verse;
                const isBookmarked = bookmarkedVerses.has(v.verse);
                return (
                  <p
                    key={v.verse}
                    ref={(el) => {
                      verseRefs.current[v.verse] = el;
                    }}
                    className={`group relative rounded px-2 py-1 pr-9 transition-colors ${
                      isSpoken
                        ? 'bg-bible-100 ring-1 ring-bible-300'
                        : isSearchHit
                        ? 'bg-bible-100'
                        : 'hover:bg-bible-50/70'
                    } ${
                      idx === 0
                        ? 'first-letter:text-4xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:text-bible-800'
                        : ''
                    }`}
                  >
                    <sup className="mr-1.5 font-sans text-[11px] font-semibold text-bible-500 tabular-nums select-none">
                      {v.verse}
                    </sup>
                    <span>{v.text}</span>
                    <button
                      type="button"
                      onClick={() => onToggleBookmarkVerse(v)}
                      aria-label={ui.bookmarkVerseAria(v.verse, isBookmarked)}
                      aria-pressed={isBookmarked}
                      className={`no-print absolute right-1.5 top-1.5 inline-flex items-center justify-center w-7 h-7 rounded transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-bible-700 ${
                        isBookmarked
                          ? 'opacity-100 text-bible-800 hover:bg-bible-100'
                          : 'opacity-40 sm:opacity-0 group-hover:opacity-100 text-bible-400 hover:text-bible-800 hover:bg-bible-100'
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`}
                      />
                    </button>
                  </p>
                );
              })}
            </blockquote>

            <span
              aria-hidden="true"
              className="block text-right font-display text-5xl leading-none text-bible-400 select-none mt-2"
            >
              ”
            </span>
          </div>
        </section>

        {/* Devotional Reading Section */}
        <section aria-label={ui.devotionalKicker} className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-sans tracking-widest uppercase text-bible-500">
              {ui.devotionalKicker} · {activeDevotional.estimatedMinutes} {ui.minuteUnit}
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-bible-900 text-balance">
              {activeDevotional.title}
            </h2>
          </div>

          <div className={`space-y-6 font-serif text-bible-800 ${DEVOTIONAL_SIZE_CLASSES[fontSize]}`}>
            <div className="space-y-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-bible-700">
                {ui.historicalBackground}
              </h3>
              {activeDevotional.historicalBackground.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-bible-700">
                {ui.theologicalContext}
              </h3>
              {activeDevotional.theologicalContext.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-bible-700">
                {ui.practicalApplication}
              </h3>
              {activeDevotional.practicalApplication.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-bible-200 space-y-1.5">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-bible-700">
                {ui.reflectionPrayer}
              </h3>
              <p className="italic text-bible-900">{activeDevotional.reflectionPrayer}</p>
            </div>
          </div>
        </section>

        {/* Expandable Worship Song Lyrics Panel */}
        {showLyrics && (
          <section
            ref={lyricsPanelRef}
            aria-label={ui.hymnKicker}
            className="max-w-2xl mx-auto pt-8 border-t border-bible-200 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest uppercase text-bible-500">
                  {ui.hymnKicker}
                </p>
                <h2 className="font-display text-xl font-semibold text-bible-900 mt-0.5">
                  {lyrics.title}
                </h2>
                <p className="text-xs text-bible-500 mt-0.5">{lyrics.tempoNote}</p>
              </div>

              <div className="no-print flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onPlayLyrics}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-white bg-bible-800 hover:bg-bible-900 rounded-md transition-colors whitespace-nowrap"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{ui.readLyricsButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleCopyLyrics()}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium text-bible-800 bg-[#FAFAF9] border border-bible-200 hover:bg-bible-100 rounded-md transition-colors whitespace-nowrap"
                >
                  {copiedLyrics ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-bible-800" />
                      <span>{ui.copiedLabel}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-bible-700" />
                      <span>{ui.copyLyricsButton}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 bg-[#FAFAF9] border border-bible-200 rounded-lg p-6 font-serif text-sm leading-relaxed text-bible-800">
              <div className="space-y-1.5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-bible-500">
                  {ui.verse1Label}
                </p>
                {lyrics.verse1.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="space-y-1.5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-bible-700">
                  {ui.chorusLabel}
                </p>
                {lyrics.chorus.map((line, i) => (
                  <p key={i} className="font-semibold text-bible-900">
                    {line}
                  </p>
                ))}
              </div>

              <div className="space-y-1.5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-bible-500">
                  {ui.verse2Label}
                </p>
                {lyrics.verse2.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="space-y-1.5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-bible-500">
                  {ui.bridgeLabel}
                </p>
                {lyrics.bridge.map((line, i) => (
                  <p key={i} className="italic">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
