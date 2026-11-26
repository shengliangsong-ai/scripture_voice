import { Download, Share, Smartphone, X } from 'lucide-react';
import { useState } from 'react';
import { getUiStrings } from '../data/uiStrings';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { SupportedLang } from '../types/scripture';

interface PWAInstallButtonProps {
  lang: SupportedLang;
}

export function PWAInstallButton({ lang }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const ui = getUiStrings(lang);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-white bg-bible-800 hover:bg-bible-900 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{ui.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-bible-800 bg-bible-50 border border-bible-200 hover:bg-bible-100 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700"
        >
          <Smartphone className="w-3.5 h-3.5 text-bible-700" />
          <span>{ui.addToHome}</span>
        </button>

        {showIOSGuide && (
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-bible-900/40 backdrop-blur-[1px]"
              onClick={() => setShowIOSGuide(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ios-install-title"
              className="relative z-10 w-full max-w-sm bg-white border border-bible-200 rounded-xl shadow-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 id="ios-install-title" className="font-display text-base font-semibold text-bible-900">
                  {ui.iosGuide.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={ui.iosGuide.gotIt}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-bible-700 hover:bg-bible-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ol className="space-y-2.5 text-xs text-bible-800 leading-relaxed list-decimal list-inside">
                <li>
                  {ui.iosGuide.step1Before}
                  <strong>{ui.iosGuide.step1Bold}</strong>
                  {ui.iosGuide.step1After}
                </li>
                <li>
                  {ui.iosGuide.step2Before}
                  <Share className="inline w-3.5 h-3.5 mx-0.5 text-bible-700" />{' '}
                  <strong>{ui.iosGuide.step2Bold}</strong>
                  {ui.iosGuide.step2After}
                </li>
                <li>
                  {ui.iosGuide.step3Before}
                  <strong>{ui.iosGuide.step3Bold}</strong>
                </li>
              </ol>

              <p className="text-[11px] text-bible-500">{ui.iosGuide.desc}</p>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full h-10 text-xs font-medium text-bible-900 bg-bible-100 hover:bg-bible-200 rounded-md transition-colors"
              >
                {ui.iosGuide.gotIt}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
