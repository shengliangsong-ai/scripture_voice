import { useEffect, useState } from 'react';

export const OS_VOICE_STORAGE_KEY = 'scripture_voice_os_voice_v2';

export const LOW_QUALITY_OR_NOVELTY_HINTS = [
  'eddy',
  'flo',
  'reed',
  'rocko',
  'sandy',
  'shelley',
  'grandma',
  'grandpa',
  'albert',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'fred',
  'good news',
  'jester',
  'junior',
  'kathy',
  'organ',
  'ralph',
  'superstar',
  'trinoids',
  'eloquence',
  'whisper',
  'wobble',
  'zarvox',
];

export function isLowQualityVoice(v: SpeechSynthesisVoice): boolean {
  const name = v.name.toLowerCase();
  const uri = v.voiceURI.toLowerCase();
  return LOW_QUALITY_OR_NOVELTY_HINTS.some((hint) => name.includes(hint) || uri.includes(hint));
}

export function scoreOsVoice(v: SpeechSynthesisVoice, bcp47: string): number {
  const targetLower = bcp47.toLowerCase().replace('_', '-');
  const name = v.name.toLowerCase();
  let score = 0;

  if (v.lang.toLowerCase().replace('_', '-') === targetLower) score += 40;
  if (!v.localService) score += 10;
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
  if (
    name.includes('xiaoxiao') ||
    name.includes('xiaoyi') ||
    name.includes('yunxi') ||
    name.includes('yunyang') ||
    name.includes('meijia') ||
    name.includes('mei-jia') ||
    name.includes('tingting') ||
    name.includes('ting-ting') ||
    name.includes('lilian') ||
    name.includes('shanshan') ||
    name.includes('yu-shu') ||
    name.includes('yushu') ||
    name.includes('hsiaochen') ||
    name.includes('yunjhe') ||
    name.includes('samantha') ||
    name.includes('daniel') ||
    name.includes('aria') ||
    name.includes('guy') ||
    name.includes('jenny') ||
    name.includes('ava') ||
    name.includes('karen')
  ) {
    score += 20;
  }
  if (isLowQualityVoice(v)) {
    score -= 100;
  }
  return score;
}

export function getNaturalVoicesForLanguage(
  availableVoices: SpeechSynthesisVoice[],
  bcp47: string
): SpeechSynthesisVoice[] {
  if (!availableVoices || availableVoices.length === 0) return [];
  const targetLower = bcp47.toLowerCase().replace('_', '-');
  const langPrefix = targetLower.split('-')[0];
  const exactMatches = availableVoices.filter(
    (v) => v.lang.toLowerCase().replace('_', '-') === targetLower
  );
  const prefixMatches = availableVoices.filter((v) =>
    v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
  );
  const basePool = exactMatches.length > 0 ? exactMatches : prefixMatches;
  return basePool
    .filter((v) => !isLowQualityVoice(v))
    .sort((a, b) => scoreOsVoice(b, bcp47) - scoreOsVoice(a, bcp47));
}

export function pickNaturalOsVoice(
  availableVoices: SpeechSynthesisVoice[],
  bcp47: string,
  preferredVoiceURI?: string
): SpeechSynthesisVoice | null {
  const pool = getNaturalVoicesForLanguage(availableVoices, bcp47);
  if (pool.length === 0) return null;

  if (preferredVoiceURI) {
    const manual = pool.find((v) => v.voiceURI === preferredVoiceURI);
    if (manual) return manual;
  }

  return pool[0] ?? null;
}

export function readSavedOsVoices(): Record<string, string> {
  try {
    const raw = localStorage.getItem(OS_VOICE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveOsVoiceForLocale(
  prev: Record<string, string>,
  bcp47: string,
  voiceURI: string
): Record<string, string> {
  const next = { ...prev };
  if (voiceURI) {
    next[bcp47] = voiceURI;
  } else {
    delete next[bcp47];
  }
  try {
    localStorage.setItem(OS_VOICE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors
  }
  return next;
}

export function useSpeechVoices(): {
  supportsSpeech: boolean;
  voices: SpeechSynthesisVoice[];
} {
  const supportsSpeech =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined';

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() =>
    supportsSpeech ? window.speechSynthesis.getVoices() : []
  );

  useEffect(() => {
    if (!supportsSpeech) return;
    const refreshVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    refreshVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refreshVoices);
    };
  }, [supportsSpeech]);

  return { supportsSpeech, voices };
}
