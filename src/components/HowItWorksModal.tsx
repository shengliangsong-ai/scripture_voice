import { BookOpen, Cpu, Globe2, HardDrive, Headphones, Search, X } from 'lucide-react';
import { getUiStrings } from '../data/uiStrings';
import { SupportedLang } from '../types/scripture';

interface HowItWorksModalProps {
  lang: SupportedLang;
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ lang, isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;
  const ui = getUiStrings(lang);
  const hw = ui.howItWorks;
  const cardIcons = [BookOpen, Search, Headphones, HardDrive];

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-bible-900/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
        className="relative z-10 w-full max-w-2xl bg-white border border-bible-200 rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-bible-200 flex items-center justify-between bg-[#FAFAF9]">
          <h2 id="how-it-works-title" className="font-display text-lg font-semibold text-bible-900">
            {hw.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={ui.iosGuide.gotIt}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-700 hover:bg-bible-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto parchment-scrollbar space-y-5 text-sm text-bible-800 leading-relaxed">
          <p className="font-serif text-[15px] text-bible-900">
            {hw.leadBeforeBold}
            <strong>{hw.leadBold}</strong>
            {hw.leadAfterBold}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {hw.cards.map((card, idx) => {
              const Icon = cardIcons[idx] ?? BookOpen;
              return (
                <div
                  key={card.title}
                  className="p-4 bg-[#FAFAF9] border border-bible-200 rounded-lg space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-bible-900">
                    <Icon className="w-4 h-4 text-bible-700" />
                    <span>{card.title}</span>
                  </div>
                  <p className="text-xs text-bible-700">
                    {card.body}
                    {card.code && <code className="text-bible-900">{card.code}</code>}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-[#FAFAF9] border border-bible-200 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-bible-900">
              <Globe2 className="w-4 h-4 text-bible-700" />
              <span>{hw.scopeTitle}</span>
            </div>
            <p className="text-xs text-bible-700">{hw.scopeDesc}</p>
          </div>

          <div className="p-4 bg-bible-50 border border-bible-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-bible-900">
              <Cpu className="w-4 h-4 text-bible-700" />
              <span>{hw.pipelineTitle}</span>
            </div>
            <p className="text-xs text-bible-700">{hw.pipelineDesc}</p>
            <pre className="p-2.5 bg-white border border-bible-200 rounded text-xs text-bible-900 overflow-x-auto">
              npm run pregenerate -- --chapters=genesis_1,psalm_23 --langs=en,zh,es
            </pre>
          </div>

          <p className="text-[11px] text-bible-500 text-right font-mono tabular-nums pt-1">
            v{__APP_VERSION__} · {__BUILD_TIME__}
          </p>
        </div>
      </div>
    </div>
  );
}
