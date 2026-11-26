import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUiStrings } from '../data/uiStrings';
import { SupportedLang } from '../types/scripture';

interface OfflineIndicatorProps {
  lang: SupportedLang;
}

export function OfflineIndicator({ lang }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const ui = getUiStrings(lang);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="no-print fixed bottom-20 left-4 z-40 inline-flex items-center gap-2 px-3 py-2 bg-bible-900 text-bible-50 text-xs font-medium rounded-md shadow-md border border-bible-700"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>{ui.offlineBanner}</span>
    </div>
  );
}
