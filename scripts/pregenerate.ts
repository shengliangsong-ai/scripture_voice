import fs from 'node:fs';
import path from 'node:path';
import {
  BIBLE_BOOKS,
  CHAPTER_ARTWORK_MAP,
  SUPPORTED_LANGUAGES,
  getBookBySlug,
  getBookName,
  getChapterArtwork,
  getLanguageOption,
} from '../src/data/bibleBooks';
import { SEEDED_CORPUS, SeededChapterData, buildDevotionalVariants } from '../src/data/seededCorpus';
import {
  BibleManifest,
  BibleManifestBook,
  BibleVerse,
  SearchIndexEntry,
  SupportedLang,
} from '../src/types/scripture';

interface CliOptions {
  chapters: string[] | 'all';
  books: string[];
  allBooks: boolean;
  ntHalf: boolean;
  allCanon: boolean;
  langs: SupportedLang[];
  crawl: boolean;
}

const SLUG_TO_USFM: Record<string, string> = {
  genesis: 'GEN',
  exodus: 'EXO',
  leviticus: 'LEV',
  numbers: 'NUM',
  deuteronomy: 'DEU',
  joshua: 'JOS',
  judges: 'JDG',
  ruth: 'RUT',
  '1samuel': '1SA',
  '2samuel': '2SA',
  '1kings': '1KI',
  '2kings': '2KI',
  '1chronicles': '1CH',
  '2chronicles': '2CH',
  ezra: 'EZR',
  nehemiah: 'NEH',
  esther: 'EST',
  job: 'JOB',
  psalm: 'PSA',
  proverbs: 'PRO',
  ecclesiastes: 'ECC',
  songofsolomon: 'SNG',
  isaiah: 'ISA',
  jeremiah: 'JER',
  lamentations: 'LAM',
  ezekiel: 'EZK',
  daniel: 'DAN',
  hosea: 'HOS',
  joel: 'JOL',
  amos: 'AMO',
  obadiah: 'OBA',
  jonah: 'JON',
  micah: 'MIC',
  nahum: 'NAM',
  habakkuk: 'HAB',
  zephaniah: 'ZEP',
  haggai: 'HAG',
  zechariah: 'ZEC',
  malachi: 'MAL',
  matthew: 'MAT',
  mark: 'MRK',
  luke: 'LUK',
  john: 'JHN',
  acts: 'ACT',
  romans: 'ROM',
  '1corinthians': '1CO',
  '2corinthians': '2CO',
  galatians: 'GAL',
  ephesians: 'EPH',
  philippians: 'PHP',
  colossians: 'COL',
  '1thessalonians': '1TH',
  '2thessalonians': '2TH',
  '1timothy': '1TI',
  '2timothy': '2TI',
  titus: 'TIT',
  philemon: 'PHM',
  hebrews: 'HEB',
  james: 'JAS',
  '1peter': '1PE',
  '2peter': '2PE',
  '1john': '1JN',
  '2john': '2JN',
  '3john': '3JN',
  jude: 'JUD',
  revelation: 'REV',
};

const HELLOAO_TRANSLATIONS: Record<SupportedLang, string> = {
  en: 'ENGWEBP',
  zh: 'cmn_cuv',
  'zh-CN': 'cmn_cu1',
  es: 'spa_r09',
  fr: 'fra_lsg',
  de: 'deu_l12',
  pt: 'por_blj',
  it: 'ita_riv',
  ja: 'jpn_kou',
  ko: 'kor_old',
  hi: 'HINIRV',
};

const CACHE_ROOT = path.resolve(process.cwd(), 'scripts', '.cache');
const HELLOAO_CACHE_DIR = path.join(CACHE_ROOT, 'helloao');
const CRAWLED_CORPUS_DIR = path.join(CACHE_ROOT, 'crawled_corpus');

function findBookByIdentifier(raw: string) {
  const trimmed = raw.trim().toLowerCase();
  if (/^\d+$/.test(trimmed)) {
    const id = Number.parseInt(trimmed, 10);
    return BIBLE_BOOKS.find((b) => b.id === id);
  }
  return getBookBySlug(trimmed) ?? BIBLE_BOOKS.find((b) => b.englishName.toLowerCase() === trimmed);
}

function parseArgs(argv: string[]): CliOptions {
  let chapters: string[] | 'all' = 'all';
  let books: string[] = [];
  let allBooks = false;
  let ntHalf = false;
  let allCanon = false;
  let langs: SupportedLang[] = ['en', 'zh', 'zh-CN'];
  let crawl = true;

  for (const rawArg of argv) {
    const arg = rawArg.startsWith('--') ? rawArg : `--${rawArg}`;
    if (arg.startsWith('--chapters=') || arg.startsWith('--chapter=')) {
      const val = arg.slice(arg.indexOf('=') + 1).trim();
      chapters = val.toLowerCase() === 'all' ? 'all' : val.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    } else if (arg.startsWith('--book=') || arg.startsWith('--books=')) {
      const val = arg.slice(arg.indexOf('=') + 1).trim();
      books = val.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    } else if (arg === '--all-books') {
      allBooks = true;
    } else if (arg === '--nt-half') {
      ntHalf = true;
    } else if (arg === '--all-canon') {
      allCanon = true;
    } else if (arg.startsWith('--langs=')) {
      const val = arg.slice('--langs='.length).trim();
      if (val === 'all') {
        langs = SUPPORTED_LANGUAGES.map((l) => l.code);
      } else {
        langs = val.split(',').map((s) => s.trim() as SupportedLang);
      }
    } else if (arg === '--no-crawl') {
      crawl = false;
    }
  }

  return { chapters, books, allBooks, ntHalf, allCanon, langs, crawl };
}

const ensuredDirs = new Set<string>();
function ensureDir(dirPath: string): void {
  if (ensuredDirs.has(dirPath)) return;
  fs.mkdirSync(dirPath, { recursive: true });
  ensuredDirs.add(dirPath);
}

interface HelloaoContentPiece {
  text?: string;
  noteId?: number;
  lineBreak?: boolean;
}

interface HelloaoChapterItem {
  type: string;
  number?: number;
  content?: Array<string | HelloaoContentPiece>;
}

interface HelloaoChapterResponse {
  chapter?: {
    number: number;
    content?: HelloaoChapterItem[];
  };
}

interface HelloaoCompleteResponse {
  books?: Array<{
    id: string;
    chapters?: Array<{
      number?: number;
      content?: HelloaoChapterItem[];
      chapter?: {
        number: number;
        content?: HelloaoChapterItem[];
      };
    }>;
  }>;
}

const memoryCompleteCache = new Map<string, HelloaoCompleteResponse | null>();

function extractTextPieces(items: Array<string | HelloaoContentPiece> | undefined): string {
  if (!items || items.length === 0) return '';
  const parts: string[] = [];
  for (const item of items) {
    if (typeof item === 'string') {
      parts.push(item);
    } else if (item && typeof item === 'object') {
      if (typeof item.text === 'string') {
        parts.push(item.text);
      } else if (item.lineBreak) {
        parts.push(' ');
      }
      // Skip { noteId } footnote markers
    }
  }
  return parts.join(' ').replace(/\s+/g, ' ').replace(/\s+([,.;:!?，。；：！？])/g, '$1').trim();
}

function parseHelloaoContent(content: HelloaoChapterItem[] | undefined): {
  verses: BibleVerse[];
  heading?: string;
} {
  if (!content) return { verses: [] };
  const verses: BibleVerse[] = [];
  let heading: string | undefined;

  for (const block of content) {
    if (block.type === 'heading' && !heading) {
      const h = extractTextPieces(block.content);
      if (h) heading = h;
    } else if (block.type === 'verse' && typeof block.number === 'number') {
      const text = extractTextPieces(block.content);
      if (text) {
        verses.push({ verse: block.number, text });
      }
    }
  }

  return { verses, heading };
}

async function fetchJsonWithRetry(url: string): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      return await res.json();
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function fetchHelloaoComplete(translationId: string, allowCrawl: boolean): Promise<HelloaoCompleteResponse | null> {
  if (memoryCompleteCache.has(translationId)) {
    return memoryCompleteCache.get(translationId) ?? null;
  }

  const dir = path.join(HELLOAO_CACHE_DIR, translationId);
  const filePath = path.join(dir, 'complete.json');
  if (fs.existsSync(filePath)) {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as HelloaoCompleteResponse;
    memoryCompleteCache.set(translationId, parsed);
    return parsed;
  }

  if (!allowCrawl) {
    memoryCompleteCache.set(translationId, null);
    return null;
  }

  console.log(`[Crawler] Downloading complete public-domain Bible (${translationId}) to local cache...`);
  try {
    const data = (await fetchJsonWithRetry(
      `https://bible.helloao.org/api/${translationId}/complete.json`
    )) as HelloaoCompleteResponse;
    ensureDir(dir);
    fs.writeFileSync(filePath, JSON.stringify(data));
    memoryCompleteCache.set(translationId, data);
    return data;
  } catch (err) {
    console.warn(`[Crawler] Failed to fetch complete.json for ${translationId}:`, (err as Error).message);
    memoryCompleteCache.set(translationId, null);
    return null;
  }
}

async function fetchHelloaoSingleChapter(
  translationId: string,
  usfmBook: string,
  chapter: number,
  allowCrawl: boolean
): Promise<{ verses: BibleVerse[]; heading?: string }> {
  // Check complete.json cache first if already downloaded
  const completePath = path.join(HELLOAO_CACHE_DIR, translationId, 'complete.json');
  if (memoryCompleteCache.has(translationId) || fs.existsSync(completePath)) {
    const complete = await fetchHelloaoComplete(translationId, false);
    const bookObj = complete?.books?.find((b) => b.id === usfmBook);
    const chObj = bookObj?.chapters?.find((c) => (c.chapter?.number ?? c.number) === chapter);
    const content = chObj?.chapter?.content ?? chObj?.content;
    if (content) {
      return parseHelloaoContent(content);
    }
  }

  const chapterDir = path.join(HELLOAO_CACHE_DIR, translationId);
  const chapterPath = path.join(chapterDir, `${usfmBook}_${chapter}.json`);

  if (fs.existsSync(chapterPath)) {
    const cached = JSON.parse(fs.readFileSync(chapterPath, 'utf8')) as HelloaoChapterResponse;
    return parseHelloaoContent(cached.chapter?.content);
  }

  if (!allowCrawl) {
    return { verses: [] };
  }

  try {
    const url = `https://bible.helloao.org/api/${translationId}/${usfmBook}/${chapter}.json`;
    const data = (await fetchJsonWithRetry(url)) as HelloaoChapterResponse;
    ensureDir(chapterDir);
    fs.writeFileSync(chapterPath, JSON.stringify(data));
    return parseHelloaoContent(data.chapter?.content);
  } catch (err) {
    console.warn(
      `[Crawler] Could not fetch ${translationId} ${usfmBook} ${chapter}:`,
      (err as Error).message
    );
    return { verses: [] };
  }
}

async function crawlChapterEntry(
  bookSlug: string,
  chapter: number,
  targetLangs: SupportedLang[],
  useCompleteArchive: boolean,
  allowCrawl: boolean
): Promise<SeededChapterData | null> {
  const key = `${bookSlug}_${chapter}`;
  const cachedEntryPath = path.join(CRAWLED_CORPUS_DIR, `${key}.json`);
  let existingCached: SeededChapterData | null = null;
  if (fs.existsSync(cachedEntryPath)) {
    existingCached = JSON.parse(fs.readFileSync(cachedEntryPath, 'utf8')) as SeededChapterData;
  }

  const bookMeta = getBookBySlug(bookSlug);
  const usfm = SLUG_TO_USFM[bookSlug];
  if (!bookMeta || !usfm || chapter < 1 || chapter > bookMeta.chapters) {
    console.warn(`[Crawler] Invalid canonical chapter key "${key}". Skipping.`);
    return null;
  }

  const versesByLang: Partial<Record<SupportedLang, BibleVerse[]>> = existingCached
    ? { ...existingCached.verses }
    : {};
  let enHeading: string | undefined;
  let zhHeading: string | undefined;
  let zhCnHeading: string | undefined;

  const langsNeeded = new Set<SupportedLang>(['en', 'zh', 'zh-CN', ...targetLangs]);

  for (const lang of langsNeeded) {
    if (versesByLang[lang] && versesByLang[lang]!.length > 0 && existingCached) {
      continue;
    }
    const translationId = HELLOAO_TRANSLATIONS[lang];
    if (!translationId) continue;

    if (useCompleteArchive) {
      const complete = await fetchHelloaoComplete(translationId, allowCrawl);
      const bookObj = complete?.books?.find((b) => b.id === usfm);
      const chObj = bookObj?.chapters?.find((c) => (c.chapter?.number ?? c.number) === chapter);
      const parsed = parseHelloaoContent(chObj?.chapter?.content ?? chObj?.content);
      if (parsed.verses.length > 0) {
        versesByLang[lang] = parsed.verses;
        if (lang === 'en') enHeading = parsed.heading;
        if (lang === 'zh') zhHeading = parsed.heading;
        if (lang === 'zh-CN') zhCnHeading = parsed.heading;
      }
    } else {
      const parsed = await fetchHelloaoSingleChapter(translationId, usfm, chapter, allowCrawl);
      if (parsed.verses.length > 0) {
        versesByLang[lang] = parsed.verses;
        if (lang === 'en') enHeading = parsed.heading;
        if (lang === 'zh') zhHeading = parsed.heading;
        if (lang === 'zh-CN') zhCnHeading = parsed.heading;
      }
    }
  }

  const enVerses = versesByLang.en ?? [];
  if (enVerses.length === 0) {
    console.warn(`[Crawler] No public-domain verses resolved for ${key}. Skipping.`);
    return null;
  }

  const enName = getBookName(bookMeta, 'en');
  const zhName = getBookName(bookMeta, 'zh');
  const zhCnName = getBookName(bookMeta, 'zh-CN');
  const enRef = `${enName} ${chapter}`;
  const zhRef = `${zhName} ${chapter}`;
  const zhCnRef = `${zhCnName} ${chapter}`;
  const otNtEn = bookMeta.testament === 'OT' ? 'Old Testament' : 'New Testament';
  const otNtZh = bookMeta.testament === 'OT' ? '舊約聖經' : '新約聖經';
  const otNtZhCn = bookMeta.testament === 'OT' ? '旧约圣经' : '新约圣经';

  const firstEn = enVerses[0]?.text ?? '';
  const lastEn = enVerses[enVerses.length - 1]?.text ?? firstEn;
  const zhVerses = versesByLang.zh ?? enVerses;
  const zhCnVerses = versesByLang['zh-CN'] ?? zhVerses;
  const firstZh = zhVerses[0]?.text ?? '';
  const lastZh = zhVerses[zhVerses.length - 1]?.text ?? firstZh;
  const firstZhCn = zhCnVerses[0]?.text ?? '';
  const lastZhCn = zhCnVerses[zhCnVerses.length - 1]?.text ?? firstZhCn;

  const builtEntry: SeededChapterData = {
    key,
    bookSlug,
    chapter,
    title: enHeading ? `${enRef}: ${enHeading}` : `${enRef} — Public Domain Study`,
    topics: [
      enName.toLowerCase(),
      bookSlug,
      bookMeta.testament.toLowerCase(),
      'scripture',
      zhName,
      zhCnName,
      ...(zhHeading ? [zhHeading] : []),
      ...(zhCnHeading ? [zhCnHeading] : []),
    ],
    verses: {
      ...(versesByLang as Record<SupportedLang, BibleVerse[]>),
      en: enVerses,
    },
    devotionalCore: {
      title: enHeading ? `${enRef}: ${enHeading}` : `Reading & Meditation on ${enRef}`,
      localizedTitle: {
        zh: zhHeading ? `${zhRef}：${zhHeading}` : `${zhRef} 經文默想與研讀`,
        'zh-CN': zhCnHeading ? `${zhCnRef}：${zhCnHeading}` : `${zhCnRef} 经文默想与研读`,
      },
      historicalBackground: [
        `${enRef} belongs to the Book of ${enName} (Book ${bookMeta.id} of the ${otNtEn}, spanning ${bookMeta.chapters} chapters). This chapter contains ${enVerses.length} verses compiled locally from the public-domain World English Bible (WEB).`,
        `Opening passage: "${firstEn}"`,
      ],
      theologicalContext: [
        `Reading ${enRef} in sequence helps trace God’s covenant faithfulness across the broader ${otNtEn} narrative rather than isolating single lines out of context.`,
        `Closing cadence of the chapter: "${lastEn}"`,
      ],
      practicalApplication: [
        `Read ${enRef} slowly from verse 1 to verse ${enVerses[enVerses.length - 1]?.verse ?? enVerses.length} and note which detail, promise, or historical witness speaks most clearly to your day.`,
      ],
      reflectionPrayer: `Lord, thank you for preserving the witness of ${enRef}. Give us attentive hearts to learn from your word and walk faithfully today. Amen.`,
      localizedSummary: {
        zh: {
          historicalBackground: `${zhRef} 收錄於《${zhName}》（${otNtZh}第 ${bookMeta.id} 卷，全卷共 ${bookMeta.chapters} 章），全章共 ${zhVerses.length} 節經文，由公版《和合本》離線預先匯入。開篇記載：「${firstZh}」`,
          theologicalContext: `連貫研讀 ${zhRef} 的上下文脈絡，能幫助我們在整本${otNtZh}救恩歷史中看見神的信實帶領與護理。本章末段記載：「${lastZh}」`,
          practicalApplication: `請從第 1 節慢慢誦讀至第 ${zhVerses[zhVerses.length - 1]?.verse ?? zhVerses.length} 節，在安靜中思想神在這段歷史與見證中所留下的真實記號。`,
          reflectionPrayer: `主啊，感謝祢將 ${zhRef} 的話語保存至今。求祢賜我安靜受教的心，在今日的步履中忠心跟隨祢。阿們。`,
        },
        'zh-CN': {
          historicalBackground: `${zhCnRef} 收录于《${zhCnName}》（${otNtZhCn}第 ${bookMeta.id} 卷，全卷共 ${bookMeta.chapters} 章），全章共 ${zhCnVerses.length} 节经文，由公版《和合本》离线预先导入。开篇记载：「${firstZhCn}」`,
          theologicalContext: `连贯研读 ${zhCnRef} 的上下文脉络，能帮助我们在整本${otNtZhCn}救恩历史中看见神的信实带领与护理。本章末段记载：「${lastZhCn}」`,
          practicalApplication: `请从第 1 节慢慢诵读至第 ${zhCnVerses[zhCnVerses.length - 1]?.verse ?? zhCnVerses.length} 节，在安静中思想神在这段历史与见证中所留下的真实记号。`,
          reflectionPrayer: `主啊，感谢你将 ${zhCnRef} 的话语保存至今。求你赐我安静受教的心，在今日的步履中忠心跟随你。阿们。`,
        },
      },
    },
    lyrics: {
      title: `Hymn on ${enRef}`,
      tempoNote: 'Reflective chant · Public-domain reading',
      verse1: [firstEn],
      chorus: [`Your word in ${enRef} endures across every generation.`],
      verse2: [lastEn],
      bridge: ['Guide our steps in quiet truth today.'],
      localized: {
        zh: {
          title: `${zhRef} 誦讀默想`,
          tempoNote: '安靜誦讀 · 公版和合本',
          verse1: [firstZh],
          chorus: [`祢在 ${zhRef} 的話語存到永遠，堅定不移。`],
          verse2: [lastZh],
          bridge: ['引導我們今日行在祢的光中。'],
        },
        'zh-CN': {
          title: `${zhCnRef} 诵读默想`,
          tempoNote: '安静诵读 · 公版和合本',
          verse1: [firstZhCn],
          chorus: [`你在 ${zhCnRef} 的话语存到永远，坚定不移。`],
          verse2: [lastZhCn],
          bridge: ['引导我们今日行在你的光中。'],
        },
      },
    },
  };

  ensureDir(CRAWLED_CORPUS_DIR);
  fs.writeFileSync(cachedEntryPath, JSON.stringify(builtEntry, null, 2));
  return builtEntry;
}

function loadPreviouslyCrawledEntries(): SeededChapterData[] {
  if (!fs.existsSync(CRAWLED_CORPUS_DIR)) return [];
  const files = fs.readdirSync(CRAWLED_CORPUS_DIR).filter((f) => f.endsWith('.json'));
  const entries: SeededChapterData[] = [];
  for (const file of files) {
    try {
      const parsed = JSON.parse(
        fs.readFileSync(path.join(CRAWLED_CORPUS_DIR, file), 'utf8')
      ) as SeededChapterData;
      entries.push(parsed);
    } catch {
      // Ignore corrupt cache file
    }
  }
  return entries;
}

function tokenizeText(input: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const cleaned = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  for (const token of cleaned) {
    counts[token] = (counts[token] ?? 0) + 1;
  }

  const cjkChars = input.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu);
  if (cjkChars) {
    for (let i = 0; i < cjkChars.length; i++) {
      const ch = cjkChars[i];
      counts[ch] = (counts[ch] ?? 0) + 1;
      if (i < cjkChars.length - 1) {
        const bi = ch + cjkChars[i + 1];
        counts[bi] = (counts[bi] ?? 0) + 1;
      }
    }
  }

  return counts;
}

function getEffectiveVerses(entry: SeededChapterData, lang: SupportedLang) {
  return entry.verses[lang] ?? entry.verses.en;
}

async function resolveSelectedEntries(options: CliOptions): Promise<SeededChapterData[]> {
  const seededMap = new Map<string, SeededChapterData>(SEEDED_CORPUS.map((e) => [e.key, e]));
  const previouslyCrawled = loadPreviouslyCrawledEntries();
  for (const c of previouslyCrawled) {
    if (!seededMap.has(c.key)) {
      seededMap.set(c.key, c);
    }
  }

  const requestedKeys = new Set<string>();
  if (options.allCanon) {
    for (const b of BIBLE_BOOKS) {
      for (let ch = 1; ch <= b.chapters; ch++) {
        requestedKeys.add(`${b.slug}_${ch}`);
      }
    }
  } else {
    if (options.ntHalf) {
      for (const b of BIBLE_BOOKS) {
        if (b.testament === 'NT') {
          const halfCount = Math.ceil(b.chapters / 2);
          for (let ch = 1; ch <= halfCount; ch++) {
            requestedKeys.add(`${b.slug}_${ch}`);
          }
        }
      }
    }
    if (options.allBooks) {
      for (const b of BIBLE_BOOKS) {
        requestedKeys.add(`${b.slug}_1`);
      }
      for (const existingKey of seededMap.keys()) {
        requestedKeys.add(existingKey);
      }
    }
    const numericChapters: number[] = [];
    const explicitKeys: string[] = [];
    if (options.chapters !== 'all') {
      for (const k of options.chapters) {
        if (/^\d+$/.test(k)) {
          numericChapters.push(Number.parseInt(k, 10));
        } else {
          const match = k.match(/^([a-z0-9]+)_(\d+)$/);
          if (match) {
            const bookFromPrefix = findBookByIdentifier(match[1]);
            explicitKeys.push(bookFromPrefix ? `${bookFromPrefix.slug}_${match[2]}` : k);
          } else {
            explicitKeys.push(k);
          }
        }
      }
    }

    for (const k of explicitKeys) requestedKeys.add(k);

    for (const bookIdOrSlug of options.books) {
      const book = findBookByIdentifier(bookIdOrSlug);
      if (!book) {
        console.warn(`[Scripture Voice] Unknown book "${bookIdOrSlug}" (expected 1-66 or book slug).`);
        continue;
      }
      if (numericChapters.length > 0) {
        for (const ch of numericChapters) {
          if (ch >= 1 && ch <= book.chapters) {
            requestedKeys.add(`${book.slug}_${ch}`);
          } else {
            console.warn(`[Scripture Voice] Chapter ${ch} out of range for ${book.englishName} (1-${book.chapters}).`);
          }
        }
      } else {
        for (let ch = 1; ch <= book.chapters; ch++) {
          requestedKeys.add(`${book.slug}_${ch}`);
        }
      }
    }
  }

  // Default `npm run pregenerate` (no --chapters/--book/--all-books/--nt-half/--all-canon) compiles SEEDED_CORPUS + cached crawled chapters
  if (requestedKeys.size === 0) {
    return Array.from(seededMap.values());
  }

  const keysToCrawl: Array<{ bookSlug: string; chapter: number }> = [];
  for (const key of requestedKeys) {
    if (!seededMap.has(key)) {
      const match = key.match(/^([a-z0-9]+)_(\d+)$/);
      if (match) {
        keysToCrawl.push({ bookSlug: match[1], chapter: Number.parseInt(match[2], 10) });
      } else {
        console.warn(`[Scripture Voice] Invalid chapter key format "${key}". Expected <bookSlug>_<chapter> (e.g. ezra_2).`);
      }
    }
  }

  if (keysToCrawl.length > 0) {
    console.log(
      `[Scripture Voice] ${keysToCrawl.length} chapter(s) not in SEEDED_CORPUS; resolving from public-domain archive (cache / bible.helloao.org)...`
    );
    const useCompleteArchive = keysToCrawl.length > 8;
    for (const item of keysToCrawl) {
      const crawled = await crawlChapterEntry(
        item.bookSlug,
        item.chapter,
        options.langs,
        useCompleteArchive,
        options.crawl
      );
      if (crawled) {
        seededMap.set(crawled.key, crawled);
      }
    }
  }

  const resolved: SeededChapterData[] = [];
  for (const key of requestedKeys) {
    const entry = seededMap.get(key);
    if (entry) resolved.push(entry);
  }
  return resolved;
}

async function runPregeneration(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const outRoot = path.resolve(process.cwd(), 'public', 'data');
  ensureDir(outRoot);

  const selectedEntries = await resolveSelectedEntries(options);

  console.log(
    `[Scripture Voice] Pre-generating ${selectedEntries.length} chapter(s) across ${options.langs.length} languages...`
  );

  const newIndexEntries: SearchIndexEntry[] = [];
  const imageManifest: Record<string, { url: string; caption: string }> = {};

  for (const entry of selectedEntries) {
    const bookMeta = getBookBySlug(entry.bookSlug);
    if (!bookMeta) continue;

    const flagshipArtwork = CHAPTER_ARTWORK_MAP[entry.key];
    if (flagshipArtwork) {
      imageManifest[entry.key] = flagshipArtwork;
    }
    const artwork = flagshipArtwork ?? getChapterArtwork(entry.bookSlug, entry.chapter);

    // Build Search Index Entry across all localized names & verse content
    const allTokenChunks: string[] = [
      entry.title,
      ...entry.topics,
      entry.bookSlug,
      `${bookMeta.englishName} ${entry.chapter}`,
    ];
    const snippets = {} as Record<SupportedLang, string>;

    for (const lang of options.langs) {
      const verses = getEffectiveVerses(entry, lang);
      const bookName = getBookName(bookMeta, lang);
      allTokenChunks.push(`${bookName} ${entry.chapter}`);
      snippets[lang] = verses[0]?.text ?? entry.verses.en[0]?.text ?? '';
      for (const v of verses) {
        allTokenChunks.push(v.text);
      }
    }

    allTokenChunks.push(
      entry.devotionalCore.historicalBackground.join(' '),
      entry.devotionalCore.theologicalContext.join(' '),
      entry.devotionalCore.practicalApplication.join(' ')
    );

    newIndexEntries.push({
      id: entry.key,
      bookSlug: entry.bookSlug,
      chapter: entry.chapter,
      reference: `${bookMeta.englishName} ${entry.chapter}`,
      title: entry.title,
      topics: entry.topics,
      snippet: snippets,
      tokens: tokenizeText(allTokenChunks.join(' ')),
      verseMap: entry.verses.en,
      hasArtwork: Boolean(artwork),
      artworkUrl: artwork?.url,
    });

    for (const lang of options.langs) {
      const langOpt = getLanguageOption(lang);
      const bookName = getBookName(bookMeta, lang);
      const verses = getEffectiveVerses(entry, lang);

      // 1. Bible Chapter JSON
      const bibleDir = path.join(outRoot, 'bible', lang);
      ensureDir(bibleDir);
      fs.writeFileSync(
        path.join(bibleDir, `${entry.key}.json`),
        JSON.stringify(
          {
            bookSlug: entry.bookSlug,
            bookName,
            chapter: entry.chapter,
            lang,
            translation: langOpt.translationName,
            verses,
            isPreseeded: true,
          },
          null,
          2
        )
      );

      // 2. Devotional JSON (1, 3, 5, 10, 15 min variants)
      const devDir = path.join(outRoot, 'devotionals', lang);
      ensureDir(devDir);
      fs.writeFileSync(
        path.join(devDir, `${entry.key}.json`),
        JSON.stringify(
          {
            bookSlug: entry.bookSlug,
            chapter: entry.chapter,
            lang,
            reference: `${bookName} ${entry.chapter}`,
            variants: buildDevotionalVariants(entry, lang),
          },
          null,
          2
        )
      );

      // 3. Song Lyrics JSON
      const lyricsDir = path.join(outRoot, 'lyrics', lang);
      ensureDir(lyricsDir);
      const localizedSong = entry.lyrics.localized?.[lang] ?? entry.lyrics;
      fs.writeFileSync(
        path.join(lyricsDir, `${entry.key}.json`),
        JSON.stringify(
          {
            bookSlug: entry.bookSlug,
            chapter: entry.chapter,
            lang,
            title: localizedSong.title,
            tempoNote: localizedSong.tempoNote,
            verse1: localizedSong.verse1,
            chorus: localizedSong.chorus,
            verse2: localizedSong.verse2,
            bridge: localizedSong.bridge,
          },
          null,
          2
        )
      );
    }
  }

  // Merge newIndexEntries into existing index.json so --chapters=ezra_2 never erases existing chapters
  const indexPath = path.join(outRoot, 'index.json');
  const mergedMap = new Map<string, SearchIndexEntry>();
  if (fs.existsSync(indexPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as SearchIndexEntry[];
      for (const item of prev) {
        mergedMap.set(item.id, item);
      }
    } catch {
      // Rebuild from scratch if corrupted
    }
  }
  for (const item of newIndexEntries) {
    const prev = mergedMap.get(item.id);
    if (prev) {
      mergedMap.set(item.id, {
        ...prev,
        ...item,
        snippet: { ...prev.snippet, ...item.snippet },
        tokens: { ...prev.tokens, ...item.tokens },
      });
    } else {
      mergedMap.set(item.id, item);
    }
  }

  const allLangCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
  const bookOrder = new Map<string, number>(BIBLE_BOOKS.map((b) => [b.slug, b.id]));
  const finalIndex = Array.from(mergedMap.values())
    .map((item) => ({
      ...item,
      availableLangs: allLangCodes.filter((lc) =>
        fs.existsSync(path.join(outRoot, 'bible', lc, `${item.id}.json`))
      ),
    }))
    .sort((a, b) => {
      const ba = bookOrder.get(a.bookSlug) ?? 999;
      const bb = bookOrder.get(b.bookSlug) ?? 999;
      if (ba !== bb) return ba - bb;
      return a.chapter - b.chapter;
    });

  fs.writeFileSync(indexPath, JSON.stringify(finalIndex));

  // Also emit split per-book JSONs + lightweight books-manifest.json
  const booksDir = path.join(outRoot, 'books');
  ensureDir(booksDir);
  const byBook = new Map<string, SearchIndexEntry[]>();
  for (const item of finalIndex) {
    const list = byBook.get(item.bookSlug);
    if (list) {
      list.push(item);
    } else {
      byBook.set(item.bookSlug, [item]);
    }
  }

  const manifestBooks: BibleManifestBook[] = [];
  const sortedSlugs = Array.from(byBook.keys()).sort((a, b) => {
    const ba = bookOrder.get(a) ?? 999;
    const bb = bookOrder.get(b) ?? 999;
    return ba !== bb ? ba - bb : a.localeCompare(b);
  });

  for (const slug of sortedSlugs) {
    const bookRecords = byBook.get(slug)!;
    fs.writeFileSync(path.join(booksDir, `${slug}.json`), JSON.stringify(bookRecords));

    const freq = new Map<string, { langs: SupportedLang[]; count: number }>();
    const perChapterLangs: Record<string, SupportedLang[]> = {};
    for (const r of bookRecords) {
      if (Array.isArray(r.availableLangs)) {
        const sig = r.availableLangs.join(',');
        const prev = freq.get(sig);
        if (prev) prev.count += 1;
        else freq.set(sig, { langs: r.availableLangs, count: 1 });
        perChapterLangs[String(r.chapter)] = r.availableLangs;
      }
    }
    let defaultLangs: SupportedLang[] | undefined;
    let maxCount = -1;
    for (const entry of freq.values()) {
      if (entry.count > maxCount) {
        maxCount = entry.count;
        defaultLangs = entry.langs;
      }
    }
    const chapterLangs: Record<string, SupportedLang[]> = {};
    if (defaultLangs) {
      const defSig = defaultLangs.join(',');
      for (const [chKey, langsList] of Object.entries(perChapterLangs)) {
        if (langsList.join(',') !== defSig) chapterLangs[chKey] = langsList;
      }
    }

    manifestBooks.push({
      bookSlug: slug,
      file: `books/${slug}.json`,
      chapterCount: bookRecords.length,
      chapters: bookRecords.map((r) => r.chapter),
      ...(defaultLangs ? { defaultLangs } : {}),
      ...(Object.keys(chapterLangs).length > 0 ? { chapterLangs } : {}),
    });
  }

  const manifest: BibleManifest = {
    version: 1,
    generatedAt: `${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    totalBooks: manifestBooks.length,
    totalChapters: finalIndex.length,
    books: manifestBooks,
  };
  fs.writeFileSync(path.join(outRoot, 'books-manifest.json'), JSON.stringify(manifest));

  // Merge Artwork Manifest
  const imagesDir = path.join(outRoot, 'images');
  const manifestPath = path.join(imagesDir, 'manifest.json');
  ensureDir(imagesDir);
  let mergedManifest: Record<string, { url: string; caption: string }> = {};
  if (fs.existsSync(manifestPath)) {
    try {
      mergedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      mergedManifest = {};
    }
  }
  Object.assign(mergedManifest, imageManifest);
  fs.writeFileSync(manifestPath, JSON.stringify(mergedManifest, null, 2));

  console.log(
    `[Scripture Voice] Pre-generation complete. Processed ${selectedEntries.length} chapter(s); index.json holds ${finalIndex.length} chapters; split into ${manifestBooks.length} books + books-manifest.json.`
  );
}

runPregeneration().catch((err) => {
  console.error('Pre-generation failed:', err);
  process.exit(1);
});
