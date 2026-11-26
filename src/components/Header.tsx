import { BookOpen, Clock, HelpCircle, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import {
  DEFAULT_UI_LANGS,
  DEVOTIONAL_LENGTHS,
  NARRATOR_VOICES,
  SUPPORTED_LANGUAGES,
} from '../data/bibleBooks';
import { getUiStrings } from '../data/uiStrings';
import { DevotionalLength, NarratorVoice, SupportedLang } from '../types/scripture';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  lang: SupportedLang;
  availableLangs?: SupportedLang[];
  onLangChange: (lang: SupportedLang) => void;
  devotionalLength: DevotionalLength;
  onLengthChange: (len: DevotionalLength) => void;
  voice: NarratorVoice;
  onVoiceChange: (voice: NarratorVoice) => void;
  isSidebarOpen: boolean;
  onToggleDesktopSidebar: () => void;
  onOpenMobileSidebar: () => void;
  onOpenHistory: () => void;
  onOpenHowItWorks: () => void;
  historyCount: number;
}

export function Header({
  lang,
  availableLangs = DEFAULT_UI_LANGS,
  onLangChange,
  devotionalLength,
  onLengthChange,
  voice,
  onVoiceChange,
  isSidebarOpen,
  onToggleDesktopSidebar,
  onOpenMobileSidebar,
  onOpenHistory,
  onOpenHowItWorks,
  historyCount,
}: HeaderProps) {
  const ui = getUiStrings(lang);
  const visibleLanguages = SUPPORTED_LANGUAGES.filter(
    (opt) => availableLangs.includes(opt.code) || opt.code === lang
  );

  return (
    <>
      <header className="no-print sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-bible-200">
        <div className="max-w-[1440px] mx-auto h-full px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Sidebar trigger + Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              aria-label={ui.openIndexAria}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-bible-800 hover:bg-bible-100 transition-colors focus-visible:outline-2 focus-visible:outline-bible-700"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onToggleDesktopSidebar}
              aria-label={isSidebarOpen ? ui.collapseIndexAria : ui.expandIndexAria}
              title={isSidebarOpen ? ui.collapseIndexAria : ui.expandIndexAria}
              className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-lg text-bible-700 hover:bg-bible-100 transition-colors focus-visible:outline-2 focus-visible:outline-bible-700"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>

            <a
              href="#top"
              title={`v${__APP_VERSION__} (${__BUILD_TIME__})`}
              className="inline-flex items-baseline gap-2 text-bible-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700 rounded"
            >
              <BookOpen className="w-5 h-5 text-bible-700 stroke-[1.75] self-center" />
              <span className="font-display text-lg font-semibold tracking-wide">
                {ui.appName}
              </span>
              <span className="text-[11px] font-mono text-bible-500 tabular-nums">
                v{__APP_VERSION__}
              </span>
            </a>
          </div>

          {/* Center: Desktop study controls */}
          <div className="hidden lg:flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-bible-700 whitespace-nowrap">
              <span className="font-medium text-bible-500">{ui.languageLabel}</span>
              <select
                aria-label={ui.languageLabel}
                value={lang}
                onChange={(e) => onLangChange(e.target.value as SupportedLang)}
                className="h-9 pl-2.5 pr-7 text-xs font-medium text-bible-900 bg-bible-50 border border-bible-200 rounded-md hover:border-bible-400 focus-visible:outline-2 focus-visible:outline-bible-700 transition-colors cursor-pointer"
              >
                {visibleLanguages.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-bible-700 whitespace-nowrap">
              <span className="font-medium text-bible-500">{ui.lengthLabel}</span>
              <select
                aria-label={ui.lengthLabel}
                value={devotionalLength}
                onChange={(e) => onLengthChange(Number(e.target.value) as DevotionalLength)}
                className="h-9 pl-2.5 pr-7 text-xs font-medium text-bible-900 bg-bible-50 border border-bible-200 rounded-md hover:border-bible-400 focus-visible:outline-2 focus-visible:outline-bible-700 transition-colors cursor-pointer tabular-nums"
              >
                {DEVOTIONAL_LENGTHS.map((min) => (
                  <option key={min} value={min}>
                    {min} {ui.minuteUnit}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-bible-700 whitespace-nowrap">
              <span className="font-medium text-bible-500">{ui.narratorLabel}</span>
              <select
                aria-label={ui.narratorLabel}
                value={voice}
                onChange={(e) => onVoiceChange(e.target.value as NarratorVoice)}
                className="h-9 pl-2.5 pr-7 text-xs font-medium text-bible-900 bg-bible-50 border border-bible-200 rounded-md hover:border-bible-400 focus-visible:outline-2 focus-visible:outline-bible-700 transition-colors cursor-pointer"
              >
                {NARRATOR_VOICES.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} · {ui.voiceTimbres[v.name]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Right: Install, History & Architecture Modal */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton lang={lang} />

            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-bible-800 hover:bg-bible-100 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700"
            >
              <Clock className="w-4 h-4 text-bible-700" />
              <span>{ui.historyButton}</span>
              {historyCount > 0 && (
                <span className="text-bible-500 tabular-nums">({historyCount})</span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenHowItWorks}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-bible-800 hover:bg-bible-100 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700"
            >
              <HelpCircle className="w-4 h-4 text-bible-700" />
              <span className="hidden sm:inline">{ui.howItWorksButton}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Non-sticky mobile/tablet selector bar (keeps mobile sticky height <= 56px) */}
      <div className="no-print lg:hidden bg-[#F5F5F4] border-b border-bible-200 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label={ui.languageLabel}
            value={lang}
            onChange={(e) => onLangChange(e.target.value as SupportedLang)}
            className="flex-1 min-w-[140px] h-10 px-2.5 text-xs font-medium text-bible-900 bg-white border border-bible-200 rounded-md"
          >
            {visibleLanguages.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.nativeLabel}
              </option>
            ))}
          </select>

          <select
            aria-label={ui.lengthLabel}
            value={devotionalLength}
            onChange={(e) => onLengthChange(Number(e.target.value) as DevotionalLength)}
            className="h-10 px-2.5 text-xs font-medium text-bible-900 bg-white border border-bible-200 rounded-md tabular-nums"
          >
            {DEVOTIONAL_LENGTHS.map((min) => (
              <option key={min} value={min}>
                {min} {ui.minuteUnit}
              </option>
            ))}
          </select>

          <select
            aria-label={ui.narratorLabel}
            value={voice}
            onChange={(e) => onVoiceChange(e.target.value as NarratorVoice)}
            className="h-10 px-2.5 text-xs font-medium text-bible-900 bg-white border border-bible-200 rounded-md"
          >
            {NARRATOR_VOICES.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
