import { Bookmark, Clock, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { getLanguageOption } from '../data/bibleBooks';
import { getUiStrings } from '../data/uiStrings';
import { ReadingHistoryItem, SupportedLang, VerseBookmark } from '../types/scripture';

interface HistoryDrawerProps {
  lang: SupportedLang;
  isOpen: boolean;
  items: ReadingHistoryItem[];
  bookmarks: VerseBookmark[];
  onClose: () => void;
  onSelect: (item: ReadingHistoryItem) => void;
  onSelectBookmark: (bookmark: VerseBookmark) => void;
  onRemoveBookmark: (id: string) => void;
  onClear: () => void;
  onClearBookmarks: () => void;
}

export function HistoryDrawer({
  lang,
  isOpen,
  items,
  bookmarks,
  onClose,
  onSelect,
  onSelectBookmark,
  onRemoveBookmark,
  onClear,
  onClearBookmarks,
}: HistoryDrawerProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'bookmarks'>('history');

  if (!isOpen) return null;
  const ui = getUiStrings(lang);

  const showClear =
    (activeTab === 'history' && items.length > 0) ||
    (activeTab === 'bookmarks' && bookmarks.length > 0);

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-bible-900/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        aria-label={ui.historyTitle}
        className="relative z-10 w-80 max-w-[90vw] h-full bg-white border-l border-bible-200 shadow-xl flex flex-col"
      >
        <div className="px-5 py-4 border-b border-bible-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'history' ? (
              <Clock className="w-4 h-4 text-bible-700" />
            ) : (
              <Bookmark className="w-4 h-4 text-bible-700" />
            )}
            <h2 className="font-display text-sm font-semibold text-bible-900">
              {ui.historyTitle}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {showClear && (
              <button
                type="button"
                onClick={activeTab === 'history' ? onClear : onClearBookmarks}
                aria-label={activeTab === 'history' ? ui.clearHistoryAria : ui.clearBookmarksAria}
                title={activeTab === 'history' ? ui.clearHistoryAria : ui.clearBookmarksAria}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-500 hover:text-bible-900 hover:bg-bible-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={ui.closeHistoryAria}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-700 hover:bg-bible-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History / Bookmarks segmented tabs */}
        <div className="px-4 py-2.5 border-b border-bible-200 bg-[#FAFAF9]">
          <div className="grid grid-cols-2 gap-1 p-1 bg-bible-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`py-1.5 text-xs font-medium rounded-md transition-colors tabular-nums ${
                activeTab === 'history'
                  ? 'bg-white text-bible-900 shadow-xs'
                  : 'text-bible-600 hover:text-bible-900'
              }`}
            >
              {ui.historyTab} ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bookmarks')}
              className={`py-1.5 text-xs font-medium rounded-md transition-colors tabular-nums ${
                activeTab === 'bookmarks'
                  ? 'bg-white text-bible-900 shadow-xs'
                  : 'text-bible-600 hover:text-bible-900'
              }`}
            >
              {ui.bookmarksTab} ({bookmarks.length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto parchment-scrollbar divide-y divide-bible-100">
          {activeTab === 'history' ? (
            items.length === 0 ? (
              <div className="px-6 py-12 text-center text-xs text-bible-500 leading-relaxed">
                {ui.emptyHistory}
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full text-left px-5 py-3.5 hover:bg-bible-50 transition-colors"
                >
                  <p className="font-display text-sm font-semibold text-bible-900">
                    {item.reference}
                  </p>
                  <p className="mt-1 text-[11px] text-bible-500 tabular-nums">
                    {getLanguageOption(item.lang).nativeLabel} ·{' '}
                    {new Date(item.visitedAt).toLocaleString(getLanguageOption(lang).bcp47, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </button>
              ))
            )
          ) : bookmarks.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs text-bible-500 leading-relaxed">
              {ui.emptyBookmarks}
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="px-5 py-3.5 hover:bg-bible-50 transition-colors flex items-start gap-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectBookmark(bm);
                    onClose();
                  }}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="font-display text-sm font-semibold text-bible-900">
                    {bm.reference}
                  </p>
                  <p className="mt-1 text-xs font-serif text-bible-700 line-clamp-2">
                    {bm.text}
                  </p>
                  <p className="mt-1 text-[11px] text-bible-500 tabular-nums">
                    {getLanguageOption(bm.lang).nativeLabel}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveBookmark(bm.id)}
                  aria-label={ui.removeBookmarkAria}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-bible-400 hover:text-bible-900 hover:bg-bible-100 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
