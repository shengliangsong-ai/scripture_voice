import { Download, ExternalLink, Laptop, Share, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUiStrings } from '../data/uiStrings';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { SupportedLang } from '../types/scripture';

interface PWAInstallButtonProps {
  lang: SupportedLang;
}

export function PWAInstallButton({ lang }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>(isIOS ? 'mobile' : 'desktop');
  const ui = getUiStrings(lang);

  useEffect(() => {
    setActiveTab(isIOS ? 'mobile' : 'desktop');
  }, [isIOS]);

  useEffect(() => {
    if (!showGuide) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGuide(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showGuide]);

  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      void install();
      return;
    }
    setActiveTab(isIOS ? 'mobile' : 'desktop');
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-bible-700 ${
          isInstallable
            ? 'text-white bg-bible-800 hover:bg-bible-900'
            : 'text-bible-800 bg-bible-50 border border-bible-200 hover:bg-bible-100'
        }`}
      >
        {isIOS && !isInstallable ? (
          <Smartphone className="w-3.5 h-3.5 text-bible-700 shrink-0" />
        ) : (
          <Download className={`w-3.5 h-3.5 shrink-0 ${isInstallable ? 'text-white' : 'text-bible-700'}`} />
        )}
        <span>{isIOS && !isInstallable ? ui.addToHome : ui.installApp}</span>
      </button>

      {showGuide && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-bible-900/40 backdrop-blur-[1px]"
            onClick={() => setShowGuide(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-install-title"
            className="relative z-10 w-full max-w-md bg-white border border-bible-200 rounded-xl shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id="pwa-install-title" className="font-display text-base font-semibold text-bible-900">
                {ui.desktopGuide.modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label={ui.iosGuide.gotIt}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-bible-700 hover:bg-bible-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isInIframe && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <p className="text-xs text-amber-900 leading-relaxed">
                  {ui.desktopGuide.iframeNotice}
                </p>
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bible-900 underline underline-offset-4 hover:text-bible-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{ui.desktopGuide.openNewTab}</span>
                </a>
              </div>
            )}

            {/* Platform Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-bible-50 border border-bible-200 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`inline-flex items-center justify-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'desktop'
                    ? 'bg-white text-bible-900 shadow-xs border border-bible-200'
                    : 'text-bible-700 hover:text-bible-900'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>{ui.desktopGuide.tabDesktop}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mobile')}
                className={`inline-flex items-center justify-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'mobile'
                    ? 'bg-white text-bible-900 shadow-xs border border-bible-200'
                    : 'text-bible-700 hover:text-bible-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{ui.desktopGuide.tabMobile}</span>
              </button>
            </div>

            {activeTab === 'desktop' ? (
              <div className="space-y-3 text-xs text-bible-800 leading-relaxed">
                <div className="p-3 bg-[#FAFAF9] border border-bible-200 rounded-lg space-y-1.5">
                  <p className="font-semibold text-bible-900">{ui.desktopGuide.safariTitle}</p>
                  <ol className="list-decimal list-inside space-y-1 text-bible-700">
                    <li>{ui.desktopGuide.safariStep1}</li>
                    <li>{ui.desktopGuide.safariStep2}</li>
                  </ol>
                </div>

                <div className="p-3 bg-[#FAFAF9] border border-bible-200 rounded-lg space-y-1.5">
                  <p className="font-semibold text-bible-900">{ui.desktopGuide.chromeTitle}</p>
                  <ol className="list-decimal list-inside space-y-1 text-bible-700">
                    <li>{ui.desktopGuide.chromeStep1}</li>
                    <li>{ui.desktopGuide.chromeStep2}</li>
                  </ol>
                </div>

                <p className="text-[11px] text-bible-500">{ui.desktopGuide.desktopTip}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-bible-900">{ui.iosGuide.title}</p>
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
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
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
