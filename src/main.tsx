import { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  error: Error | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Scripture Voice] Render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] p-6 text-bible-900">
          <div className="max-w-md w-full bg-white border border-bible-200 rounded-xl p-6 space-y-4 text-center shadow-sm">
            <h1 className="font-display text-lg font-semibold">Scripture Voice</h1>
            <p className="text-sm text-bible-700">
              Something went wrong while loading the reader ({this.state.error.message}).
            </p>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.clear();
                } catch {
                  // Ignore
                }
                window.location.reload();
              }}
              className="inline-flex items-center justify-center h-10 px-4 text-xs font-medium bg-bible-800 text-white rounded-md hover:bg-bible-900 transition-colors"
            >
              Reset Local Preferences & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

if (import.meta.env.DEV) {
  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        void reg.unregister();
      }
    });
  }
  if ('caches' in window) {
    void caches.keys().then((keys) => {
      for (const key of keys) {
        if (key.includes('workbox') || key.includes('precache')) {
          void caches.delete(key);
        }
      }
    });
  }
} else {
  if ('serviceWorker' in navigator) {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        void registration.update();
      }
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
