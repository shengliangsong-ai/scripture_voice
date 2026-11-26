import { Mic, MicOff, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { getBookBySlug, getBookName, getLanguageOption } from '../data/bibleBooks';
import { getUiStrings } from '../data/uiStrings';
import { SearchScope, searchLocalCorpus } from '../services/offlineDataService';
import { SearchResultItem, SupportedLang } from '../types/scripture';

interface SearchBarProps {
  lang: SupportedLang;
  activeBookSlug: string;
  onSelectResult: (bookSlug: string, chapter: number, highlightVerse?: number) => void;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function SearchBar({ lang, activeBookSlug, onSelectResult }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const latestSearchIdRef = useRef(0);
  const ui = getUiStrings(lang);

  const activeBook = getBookBySlug(activeBookSlug);
  const activeBookName = activeBook ? getBookName(activeBook, lang) : activeBookSlug;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const executeSearch = async (text: string, targetScope: SearchScope = scope) => {
    const trimmed = text.trim();
    if (!trimmed) {
      latestSearchIdRef.current += 1;
      setResults([]);
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    const searchId = ++latestSearchIdRef.current;
    setIsSearching(true);
    const hits = await searchLocalCorpus(trimmed, lang, {
      scope: targetScope,
      bookSlug: activeBookSlug,
    });

    if (latestSearchIdRef.current !== searchId) return;
    setResults(hits);
    setIsSearching(false);
    setIsOpen(true);
  };

  const runSearch = async (text: string) => {
    setQuery(text);
    await executeSearch(text, scope);
  };

  const handleScopeChange = (nextScope: SearchScope) => {
    setScope(nextScope);
    if (query.trim()) {
      void executeSearch(query, nextScope);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const searchId = ++latestSearchIdRef.current;
    setIsSearching(true);
    const hits = await searchLocalCorpus(query, lang, {
      scope,
      bookSlug: activeBookSlug,
    });
    if (latestSearchIdRef.current !== searchId) return;
    setIsSearching(false);
    setResults(hits);
    if (hits.length > 0 && results.length === 0) {
      setIsOpen(true);
    } else if (hits.length > 0) {
      onSelectResult(hits[0].bookSlug, hits[0].chapter, hits[0].verse);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const toggleVoiceSearch = () => {
    setSpeechNotice(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRec = win.SpeechRecognition ?? win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechNotice(ui.speechUnsupportedNotice);
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = getLanguageOption(lang).bcp47;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      if (transcript) {
        void runSearch(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setSpeechNotice(ui.speechMicErrorNotice);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  return (
    <div ref={containerRef} className="no-print relative max-w-3xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="w-4 h-4 text-bible-500 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => void runSearch(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={ui.searchPlaceholder}
          aria-label={ui.searchPlaceholder}
          className="w-full h-12 pl-11 pr-24 bg-white border border-bible-200 rounded-lg text-sm text-bible-900 placeholder:text-bible-500 shadow-xs focus-visible:outline-2 focus-visible:outline-bible-700"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                latestSearchIdRef.current += 1;
                setQuery('');
                setResults([]);
                setIsSearching(false);
                setIsOpen(false);
              }}
              aria-label={ui.clearSearchAria}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-500 hover:text-bible-900 hover:bg-bible-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleVoiceSearch}
            aria-label={isListening ? ui.stopVoiceSearchAria : ui.voiceSearchAria}
            title={`${ui.voiceSearchAria} (${getLanguageOption(lang).bcp47})`}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-bible-700 ${
              isListening
                ? 'bg-bible-800 text-white'
                : 'text-bible-700 hover:bg-bible-100'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Starter queries + search scope toggle */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-xs text-bible-500">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{ui.tryLabel}</span>
          {ui.starterQueries.map((starter, idx) => (
            <span key={starter} className="inline-flex items-center gap-2">
              {idx > 0 && <span aria-hidden="true">·</span>}
              <button
                type="button"
                onClick={() => void runSearch(starter)}
                className="text-bible-700 hover:text-bible-900 underline decoration-bible-200 hover:decoration-bible-700 underline-offset-4 transition-colors whitespace-nowrap"
              >
                {starter}
              </button>
            </span>
          ))}
          {isListening && (
            <span className="ml-2 font-medium text-bible-800">
              {ui.listeningLabel} ({getLanguageOption(lang).bcp47})…
            </span>
          )}
          {isSearching && (
            <span className="ml-2 text-bible-600">{ui.searchingLabel}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span>{ui.searchScopeLabel}</span>
          <button
            type="button"
            onClick={() => handleScopeChange('all')}
            aria-pressed={scope === 'all'}
            className={`transition-colors whitespace-nowrap ${
              scope === 'all'
                ? 'font-semibold text-bible-900 underline decoration-bible-700 underline-offset-4'
                : 'text-bible-600 hover:text-bible-900'
            }`}
          >
            {ui.searchScopeAll}
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => handleScopeChange('book')}
            aria-pressed={scope === 'book'}
            className={`transition-colors whitespace-nowrap ${
              scope === 'book'
                ? 'font-semibold text-bible-900 underline decoration-bible-700 underline-offset-4'
                : 'text-bible-600 hover:text-bible-900'
            }`}
          >
            {ui.searchScopeBook(activeBookName)}
          </button>
        </div>
      </div>

      {speechNotice && (
        <p className="mt-1.5 text-xs text-bible-700">{speechNotice}</p>
      )}

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[3.25rem] z-40 bg-white border border-bible-200 rounded-lg shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <ul className="divide-y divide-bible-100 max-h-80 overflow-y-auto parchment-scrollbar">
              {results.map((item) => (
                <li key={`${item.bookSlug}-${item.chapter}-${item.verse ?? 0}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectResult(item.bookSlug, item.chapter, item.verse);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-bible-50 transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-sm font-semibold text-bible-900">
                        {item.reference}
                      </span>
                      <span className="text-xs text-bible-500 truncate">
                        {item.matchedTopics.join(' · ')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-bible-700 line-clamp-2 font-serif leading-relaxed">
                      {item.snippet}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-xs text-bible-500">
              {ui.noSearchResults}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
