import { Pause, Play, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getUiStrings } from '../data/uiStrings';
import { AudioSegment, NarratorVoice, SupportedLang } from '../types/scripture';

interface AudioPlayerProps {
  lang: SupportedLang;
  title: string;
  segments: AudioSegment[];
  onClose: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function splitLongSpokenLine(line: string, isCjk: boolean): string[] {
  const maxLen = isCjk ? 65 : 150;
  if (line.length <= maxLen) return [line];

  const parts = line
    .split(/(?<=[，、；：,;:])\s*/)
    .map((p) => p.trim())
    .filter(Boolean);

  const grouped: string[] = [];
  let buf = '';
  for (const p of parts) {
    if ((buf + ' ' + p).trim().length > maxLen && buf.length > 0) {
      grouped.push(buf.trim());
      buf = p;
    } else {
      buf = buf ? `${buf}${isCjk ? '' : ' '}${p}` : p;
    }
  }
  if (buf.trim()) grouped.push(buf.trim());
  return grouped.length > 0 ? grouped : [line];
}

function getVoiceTuning(voiceName: NarratorVoice): {
  pitch: number;
  rate: number;
  preferFemale: boolean;
} {
  switch (voiceName) {
    case 'Kore':
      return { pitch: 1.03, rate: 0.96, preferFemale: true };
    case 'Zephyr':
      return { pitch: 1.07, rate: 0.95, preferFemale: true };
    case 'Puck':
      return { pitch: 1.01, rate: 1.0, preferFemale: false };
    case 'Charon':
      return { pitch: 0.88, rate: 0.91, preferFemale: false };
    case 'Fenrir':
    default:
      return { pitch: 0.94, rate: 0.94, preferFemale: false };
  }
}

function pickHumanFriendlyVoice(
  availableVoices: SpeechSynthesisVoice[],
  bcp47: string,
  narrator: NarratorVoice
): SpeechSynthesisVoice | null {
  if (!availableVoices || availableVoices.length === 0) return null;

  const targetLower = bcp47.toLowerCase();
  const langPrefix = targetLower.split('-')[0];

  // Match exact locale first (e.g. zh-TW vs zh-CN, en-US), then language prefix
  const exactMatches = availableVoices.filter(
    (v) => v.lang.toLowerCase().replace('_', '-') === targetLower
  );
  const prefixMatches = availableVoices.filter((v) =>
    v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
  );

  const pool = exactMatches.length > 0 ? exactMatches : prefixMatches;
  if (pool.length === 0) return null;

  const { preferFemale } = getVoiceTuning(narrator);

  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase();
    let score = 0;

    if (v.lang.toLowerCase().replace('_', '-') === targetLower) score += 40;
    if (!v.localService) score += 10; // Cloud/enhanced neural voices when available in Chrome/Edge
    if (
      name.includes('natural') ||
      name.includes('neural') ||
      name.includes('google') ||
      name.includes('microsoft') ||
      name.includes('siri') ||
      name.includes('enhanced') ||
      name.includes('premium')
    ) {
      score += 25;
    }

    // Popular high-clarity OS voices for Chinese and English
    if (
      name.includes('xiaoxiao') ||
      name.includes('yunxi') ||
      name.includes('mei-jia') ||
      name.includes('ting-ting') ||
      name.includes('hsiaochen') ||
      name.includes('yunjhe') ||
      name.includes('samantha') ||
      name.includes('daniel') ||
      name.includes('aria') ||
      name.includes('guy') ||
      name.includes('jenny')
    ) {
      score += 20;
    }

    const looksFemale =
      name.includes('female') ||
      name.includes('xiaoxiao') ||
      name.includes('mei-jia') ||
      name.includes('ting-ting') ||
      name.includes('hsiaochen') ||
      name.includes('samantha') ||
      name.includes('aria') ||
      name.includes('jenny') ||
      name.includes('karen') ||
      name.includes('ava');

    const looksMale =
      name.includes('male') ||
      name.includes('yunxi') ||
      name.includes('yunjhe') ||
      name.includes('daniel') ||
      name.includes('guy') ||
      name.includes('alex');

    if (preferFemale && looksFemale) score += 8;
    if (!preferFemale && looksMale) score += 8;

    return score;
  };

  return [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? pool[0];
}

export function AudioPlayer({ lang, title, segments, onClose }: AudioPlayerProps) {
  const ui = getUiStrings(lang);
  const supportsSpeech =
    typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

  const utteranceSessionRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>(() =>
    supportsSpeech ? window.speechSynthesis.getVoices() : []
  );
  const [audioError, setAudioError] = useState<string | null>(null);

  const activeSegment = segments[activeIndex];

  const spokenChunks = useMemo(() => {
    if (!activeSegment) return [];
    const isCjk =
      activeSegment.lang === 'zh' ||
      activeSegment.lang === 'zh-CN' ||
      activeSegment.lang === 'ja' ||
      activeSegment.lang === 'ko';
    const raw = activeSegment.spokenLines ?? [];
    return raw.flatMap((line) => splitLongSpokenLine(line, isCjk));
  }, [activeSegment]);

  // Listen for async voice list load in Chrome/Safari
  useEffect(() => {
    if (!supportsSpeech) return;
    const refreshVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    refreshVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refreshVoices);
    };
  }, [supportsSpeech]);

  // Cancel any ongoing speech on unmount
  useEffect(() => {
    return () => {
      utteranceSessionRef.current += 1;
      if (supportsSpeech) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supportsSpeech]);

  // Reset playlist position whenever segments change
  useEffect(() => {
    utteranceSessionRef.current += 1;
    if (supportsSpeech) {
      window.speechSynthesis.cancel();
    }
    setActiveIndex(0);
    setLineIndex(0);
    setIsPlaying(true);
    setAudioError(null);
  }, [segments, supportsSpeech]);

  const speakCurrentChunk = useCallback(
    (segIdx: number, chunkIdx: number) => {
      if (!supportsSpeech) return;
      const seg = segments[segIdx];
      if (!seg) return;

      const isCjk =
        seg.lang === 'zh' || seg.lang === 'zh-CN' || seg.lang === 'ja' || seg.lang === 'ko';
      const chunks = (seg.spokenLines ?? []).flatMap((l) => splitLongSpokenLine(l, isCjk));
      const text = chunks[chunkIdx];
      if (!text) return;

      const session = ++utteranceSessionRef.current;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = seg.bcp47;

      const voicesNow =
        availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const matchedVoice = pickHumanFriendlyVoice(voicesNow, seg.bcp47, seg.voice);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang || seg.bcp47;
      }

      const tuning = getVoiceTuning(seg.voice);
      utterance.pitch = tuning.pitch;
      utterance.rate = Math.min(2, Math.max(0.5, tuning.rate * playbackRate));
      utterance.volume = 1;

      utterance.onend = () => {
        if (utteranceSessionRef.current !== session) return;

        if (chunkIdx < chunks.length - 1) {
          setLineIndex(chunkIdx + 1);
        } else if (segIdx < segments.length - 1) {
          setActiveIndex(segIdx + 1);
          setLineIndex(0);
        } else {
          setIsPlaying(false);
          setLineIndex(0);
        }
      };

      utterance.onerror = (ev) => {
        if (utteranceSessionRef.current !== session) return;
        // 'interrupted' / 'canceled' happen normally on skip/pause
        if (ev.error === 'interrupted' || ev.error === 'canceled') return;
        setAudioError(ui.audioSynthUnavailable(seg.bcp47));
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [supportsSpeech, segments, availableVoices, playbackRate, ui]
  );

  // Drive SpeechSynthesis whenever activeIndex, lineIndex, or isPlaying updates
  useEffect(() => {
    if (!activeSegment) return;
    if (!supportsSpeech) {
      setAudioError(ui.audioSynthUnavailable(activeSegment.bcp47));
      setIsPlaying(false);
      return;
    }

    if (isPlaying) {
      speakCurrentChunk(activeIndex, lineIndex);
    } else {
      utteranceSessionRef.current += 1;
      window.speechSynthesis.cancel();
    }
  }, [supportsSpeech, activeSegment, activeIndex, lineIndex, isPlaying, speakCurrentChunk, ui]);

  // Register lock-screen / headphone Media Session controls when available
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !activeSegment) {
      return;
    }
    const ms = navigator.mediaSession;
    ms.metadata = new MediaMetadata({
      title,
      artist: `${activeSegment.voice} · ${activeSegment.bcp47}`,
      album: ui.appName,
    });
    ms.playbackState = isPlaying ? 'playing' : 'paused';
    ms.setActionHandler('play', () => setIsPlaying(true));
    ms.setActionHandler('pause', () => setIsPlaying(false));
    ms.setActionHandler('previoustrack', () => {
      if (activeIndex > 0) {
        setActiveIndex((i) => i - 1);
        setLineIndex(0);
        setIsPlaying(true);
      } else {
        setLineIndex(0);
      }
    });
    ms.setActionHandler('nexttrack', () => {
      if (activeIndex < segments.length - 1) {
        setActiveIndex((i) => i + 1);
        setLineIndex(0);
        setIsPlaying(true);
      }
    });
  }, [title, activeSegment, activeIndex, segments.length, isPlaying, ui.appName]);

  if (!activeSegment) return null;

  const totalChunks = Math.max(1, spokenChunks.length);
  const progressFraction = supportsSpeech ? (lineIndex + 1) / totalChunks : 0;
  const estElapsed = supportsSpeech
    ? Math.round(activeSegment.durationSec * (lineIndex / totalChunks))
    : 0;
  const estTotal = activeSegment.durationSec;

  const currentSpokenLine = spokenChunks[lineIndex] ?? '';

  const handleTogglePlay = () => {
    setAudioError(null);
    setIsPlaying((prev) => !prev);
  };

  const handlePrevPart = () => {
    setAudioError(null);
    if (activeIndex > 0) {
      setActiveIndex((i) => i - 1);
      setLineIndex(0);
      setIsPlaying(true);
    } else {
      setLineIndex(0);
      setIsPlaying(true);
    }
  };

  const handleNextPart = () => {
    setAudioError(null);
    if (activeIndex < segments.length - 1) {
      setActiveIndex((i) => i + 1);
      setLineIndex(0);
      setIsPlaying(true);
    }
  };

  const handleSeek = (val: number) => {
    if (supportsSpeech) {
      const targetLine = Math.min(
        totalChunks - 1,
        Math.max(0, Math.floor((val / Math.max(1, estTotal)) * totalChunks))
      );
      setLineIndex(targetLine);
      setIsPlaying(true);
    }
  };

  const handleClose = () => {
    utteranceSessionRef.current += 1;
    if (supportsSpeech) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  return (
    <div
      role="region"
      aria-label="Offline voice scripture player"
      className="no-print fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-bible-200 shadow-lg"
    >

      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        {/* Track Info + Live Spoken Line */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-80 shrink-0">
          <div className="w-9 h-9 rounded-md bg-bible-100 flex items-center justify-center shrink-0 text-bible-800">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xs font-semibold text-bible-900 truncate">
              {title} · {activeSegment.bcp47}
            </p>
            <p className="text-[11px] text-bible-700 truncate tabular-nums">
              {audioError
                ? audioError
                : currentSpokenLine
                ? `${ui.partProgress(activeIndex + 1, segments.length)}: ${currentSpokenLine}`
                : ui.playingPartProgress(activeIndex + 1, segments.length, activeSegment.label)}
            </p>
          </div>
        </div>

        {/* Transport & Seek Bar */}
        <div className="flex-1 w-full flex items-center gap-3">
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={activeIndex === 0 && lineIndex === 0}
              onClick={handlePrevPart}
              aria-label="Previous segment"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-700 hover:bg-bible-100 disabled:opacity-35 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause reading' : 'Play reading'}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-bible-800 hover:bg-bible-900 text-white transition-colors focus-visible:outline-2 focus-visible:outline-bible-700"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              disabled={activeIndex >= segments.length - 1}
              onClick={handleNextPart}
              aria-label="Next segment"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-700 hover:bg-bible-100 disabled:opacity-35 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] text-bible-700 tabular-nums w-9 text-right shrink-0">
            {formatTime(estElapsed)}
          </span>

          <input
            type="range"
            aria-label="Audio seek progress"
            min={0}
            max={estTotal || 1}
            step={1}
            value={supportsSpeech ? Math.round(progressFraction * estTotal) : 0}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="flex-1 h-1.5 accent-bible-800 cursor-pointer"
          />

          <span className="text-[11px] text-bible-500 tabular-nums w-9 shrink-0">
            {formatTime(estTotal)}
          </span>
        </div>

        {/* Speed & Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              const speeds = [0.85, 1, 1.15, 1.3];
              const idx = speeds.indexOf(playbackRate);
              setPlaybackRate(speeds[(idx + 1) % speeds.length]);
            }}
            aria-label="Playback speed"
            className="h-8 px-2 text-[11px] font-medium tabular-nums text-bible-800 bg-bible-50 border border-bible-200 hover:bg-bible-100 rounded-md transition-colors whitespace-nowrap"
          >
            {playbackRate === 1 ? '1.0×' : `${playbackRate}×`}
          </button>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close audio player"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-bible-500 hover:text-bible-900 hover:bg-bible-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
