import { Clock, Trash2, X } from 'lucide-react';
import { getLanguageOption } from '../data/bibleBooks';
import { getUiStrings } from '../data/uiStrings';
import { ReadingHistoryItem, SupportedLang } from '../types/scripture';

interface HistoryDrawerProps {
  lang: SupportedLang;
  isOpen: boolean;
  items: ReadingHistoryItem[];
  onClose: () => void;
  onSelect: (item: ReadingHistoryItem) => void;
  onClear: () => void;
}

export function HistoryDrawer({
  lang,
  isOpen,
  items,
  onClose,
  onSelect,
  onClear,
}: HistoryDrawerProps) {
  if (!isOpen) return null;
  const ui = getUiStrings(lang);

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
            <Clock className="w-4 h-4 text-bible-700" />
            <h2 className="font-display text-sm font-semibold text-bible-900">
              {ui.historyTitle}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                aria-label={ui.clearHistoryAria}
                title={ui.clearHistoryAria}
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

        <div className="flex-1 overflow-y-auto parchment-scrollbar divide-y divide-bible-100">
          {items.length === 0 ? (
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
          )}
        </div>
      </aside>
    </div>
  );
}
