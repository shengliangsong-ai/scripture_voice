import { BibleBookMeta, NarratorVoice, SupportedLang } from '../types/scripture';

export interface LanguageOption {
  code: SupportedLang;
  label: string;
  nativeLabel: string;
  bcp47: string;
  translationName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English (WEB)', bcp47: 'en-US', translationName: 'World English Bible (WEB)' },
  { code: 'zh', label: 'Traditional Chinese', nativeLabel: '繁體中文 (和合本)', bcp47: 'zh-TW', translationName: '和合本 (CUV Traditional)' },
  { code: 'zh-CN', label: 'Simplified Chinese', nativeLabel: '简体中文 (和合本)', bcp47: 'zh-CN', translationName: '和合本 (CUV Simplified)' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español (RVR)', bcp47: 'es-ES', translationName: 'Reina-Valera 1909' },
  { code: 'fr', label: 'French', nativeLabel: 'Français (LSG)', bcp47: 'fr-FR', translationName: 'Louis Segond 1910' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch (Luther)', bcp47: 'de-DE', translationName: 'Lutherbibel 1912' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português (ARC)', bcp47: 'pt-BR', translationName: 'Almeida Corrigida' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano (Riveduta)', bcp47: 'it-IT', translationName: 'Riveduta 1927' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語 (口語訳)', bcp47: 'ja-JP', translationName: '口語訳聖書 (Colloquial)' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어 (개역한글)', bcp47: 'ko-KR', translationName: '개역한글판 (KRV)' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी (OV)', bcp47: 'hi-IN', translationName: 'Hindi Old Version (OV)' },
];

export const DEFAULT_UI_LANGS: SupportedLang[] = ['en', 'zh', 'zh-CN'];

export const DEVOTIONAL_LENGTHS = [1, 3, 5, 10, 15] as const;

export interface VoiceProfile {
  name: NarratorVoice;
  timbre: string;
  complementary: NarratorVoice;
  baseHz: number;
}

export const NARRATOR_VOICES: VoiceProfile[] = [
  { name: 'Fenrir', timbre: 'Warm Baritone', complementary: 'Kore', baseHz: 146.83 },
  { name: 'Kore', timbre: 'Clear Alto', complementary: 'Fenrir', baseHz: 220.0 },
  { name: 'Puck', timbre: 'Bright Tenor', complementary: 'Zephyr', baseHz: 196.0 },
  { name: 'Charon', timbre: 'Deep Bass', complementary: 'Kore', baseHz: 130.81 },
  { name: 'Zephyr', timbre: 'Gentle Soprano', complementary: 'Puck', baseHz: 246.94 },
];

export function getComplementaryVoice(primary: NarratorVoice): NarratorVoice {
  return NARRATOR_VOICES.find((v) => v.name === primary)?.complementary ?? 'Kore';
}

export function getLanguageOption(lang: SupportedLang): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];
}

export const FEATURED_CHAPTER_KEYS = new Set<string>([
  'genesis_1',
  'psalm_23',
  'psalm_91',
  'proverbs_3',
  'isaiah_40',
  'matthew_5',
  'john_3',
  'romans_8',
  '1corinthians_13',
  'philippians_4',
]);

export const CHAPTER_ARTWORK_MAP: Record<string, { url: string; caption: string }> = {
  genesis_1: {
    url: '/src/assets/images/genesis_1_creation_1795368258625.jpg',
    caption: 'Classical Study — First Light Over the Deep (Genesis 1)',
  },
  psalm_23: {
    url: '/src/assets/images/psalm_23_pasture_1795368259412.jpg',
    caption: 'Classical Study — Pastures Beside Still Waters (Psalm 23)',
  },
  '1corinthians_13': {
    url: '/src/assets/images/corinthians_13_love_1795368260120.jpg',
    caption: 'Classical Study — Sanctuary Lamps & Olive Branch (1 Corinthians 13)',
  },
  john_3: {
    url: '/src/assets/images/john_3_night_1795368260292.jpg',
    caption: 'Classical Study — Lantern in the Courtyard at Night (John 3)',
  },
};

type BookTuple = [
  id: number,
  slug: string,
  chapters: number,
  testament: 'OT' | 'NT',
  en: string,
  zh: string,
  zhCN: string,
  es: string,
  fr: string,
  de: string,
  pt: string,
  it: string,
  ja: string,
  ko: string,
  hi: string,
  aliases?: string[]
];

const RAW_BOOKS: BookTuple[] = [
  [1, 'genesis', 50, 'OT', 'Genesis', '創世記', '创世记', 'Génesis', 'Genèse', '1. Mose', 'Gênesis', 'Genesi', '創世記', '창세기', 'उत्पत्ति', ['gen', 'ge']],
  [2, 'exodus', 40, 'OT', 'Exodus', '出埃及記', '出埃及记', 'Éxodo', 'Exode', '2. Mose', 'Êxodo', 'Esodo', '出エジプト記', '출애굽기', 'निर्गमन', ['ex', 'exo']],
  [3, 'leviticus', 27, 'OT', 'Leviticus', '利未記', '利未记', 'Levítico', 'Lévitique', '3. Mose', 'Levítico', 'Levitico', 'レビ記', '레위기', 'लैव्यव्यवस्था', ['lev']],
  [4, 'numbers', 36, 'OT', 'Numbers', '民數記', '民数记', 'Números', 'Nombres', '4. Mose', 'Números', 'Numeri', '民数記', '민수기', 'गिनती', ['num']],
  [5, 'deuteronomy', 34, 'OT', 'Deuteronomy', '申命記', '申命记', 'Deuteronomio', 'Deutéronome', '5. Mose', 'Deuteronômio', 'Deuteronomio', '申命記', '신명기', 'व्यवस्थाविवरण', ['deut', 'dt']],
  [6, 'joshua', 24, 'OT', 'Joshua', '約書亞記', '约书亚记', 'Josué', 'Josué', 'Josua', 'Josué', 'Giosuè', 'ヨシュア記', '여호수아', 'यहोशू', ['josh']],
  [7, 'judges', 21, 'OT', 'Judges', '士師記', '士师记', 'Jueces', 'Juges', 'Richter', 'Juízes', 'Giudici', '士師記', '사사기', 'न्यायियों', ['judg']],
  [8, 'ruth', 4, 'OT', 'Ruth', '路得記', '路得记', 'Rut', 'Ruth', 'Rut', 'Rute', 'Rut', 'ルツ記', '룻기', 'रूत', ['ru']],
  [9, '1samuel', 31, 'OT', '1 Samuel', '撒母耳記上', '撒母耳记上', '1 Samuel', '1 Samuel', '1. Samuel', '1 Samuel', '1 Samuele', 'サムエル記上', '사무엘상', '1 शमूएल', ['1sam', '1 sa']],
  [10, '2samuel', 24, 'OT', '2 Samuel', '撒母耳記下', '撒母耳记下', '2 Samuel', '2 Samuel', '2. Samuel', '2 Samuel', '2 Samuele', 'サムエル記下', '사무엘하', '2 शमूएल', ['2sam', '2 sa']],
  [11, '1kings', 22, 'OT', '1 Kings', '列王紀上', '列王纪上', '1 Reyes', '1 Rois', '1. Könige', '1 Reis', '1 Re', '列王記上', '열왕기상', '1 राजा', ['1ki', '1 kgs']],
  [12, '2kings', 25, 'OT', '2 Kings', '列王紀下', '列王纪下', '2 Reyes', '2 Rois', '2. Könige', '2 Reis', '2 Re', '列王記下', '열왕기하', '2 राजा', ['2ki', '2 kgs']],
  [13, '1chronicles', 29, 'OT', '1 Chronicles', '歷代志上', '历代志上', '1 Crónicas', '1 Chroniques', '1. Chronik', '1 Crônicas', '1 Cronache', '歴代誌上', '역대상', '1 इतिहास', ['1chr']],
  [14, '2chronicles', 36, 'OT', '2 Chronicles', '歷代志下', '历代志下', '2 Crónicas', '2 Chroniques', '2. Chronik', '2 Crônicas', '2 Cronache', '歴代誌下', '역대하', '2 इतिहास', ['2chr']],
  [15, 'ezra', 10, 'OT', 'Ezra', '以斯拉記', '以斯拉记', 'Esdras', 'Esdras', 'Esra', 'Esdras', 'Esdra', 'エズラ記', '에스라', 'एज्रा', ['ezr']],
  [16, 'nehemiah', 13, 'OT', 'Nehemiah', '尼希米記', '尼希米记', 'Nehemías', 'Néhémie', 'Nehemia', 'Neemias', 'Neemia', 'ネヘミヤ記', '느헤미야', 'नहेम्याह', ['neh']],
  [17, 'esther', 10, 'OT', 'Esther', '以斯帖記', '以斯帖记', 'Ester', 'Esther', 'Ester', 'Ester', 'Ester', 'エステル記', '에스더', 'एस्तेर', ['est']],
  [18, 'job', 42, 'OT', 'Job', '約伯記', '约伯记', 'Job', 'Job', 'Hiob', 'Jó', 'Giobbe', 'ヨブ記', '욥기', 'अय्यूब'],
  [19, 'psalm', 150, 'OT', 'Psalms', '詩篇', '诗篇', 'Salmos', 'Psaumes', 'Psalmen', 'Salmos', 'Salmi', '詩篇', '시편', 'भजन संहिता', ['psalm', 'ps', 'psa']],
  [20, 'proverbs', 31, 'OT', 'Proverbs', '箴言', '箴言', 'Proverbios', 'Proverbes', 'Sprüche', 'Provérbios', 'Proverbi', '箴言', '잠언', 'नीतिवचन', ['prov', 'pr']],
  [21, 'ecclesiastes', 12, 'OT', 'Ecclesiastes', '傳道書', '传道书', 'Eclesiastés', 'Ecclésiaste', 'Prediger', 'Eclesiastes', 'Ecclesiaste', '伝道者の書', '전도서', 'सभोपदेशक', ['eccl', 'ecc']],
  [22, 'songofsolomon', 8, 'OT', 'Song of Solomon', '雅歌', '雅歌', 'Cantares', 'Cantique des Cantiques', 'Hohelied', 'Cânticos', 'Cantico dei Cantici', '雅歌', '아가', 'श्रेष्ठगीत', ['song', 'sos']],
  [23, 'isaiah', 66, 'OT', 'Isaiah', '以賽亞書', '以赛亚书', 'Isaías', 'Ésaïe', 'Jesaja', 'Isaías', 'Isaia', 'イザヤ書', '이사야', 'यशायाह', ['isa']],
  [24, 'jeremiah', 52, 'OT', 'Jeremiah', '耶利米書', '耶利米书', 'Jeremías', 'Jérémie', 'Jeremia', 'Jeremias', 'Geremia', 'エレミヤ書', '예레미야', 'यिर्मयाह', ['jer']],
  [25, 'lamentations', 5, 'OT', 'Lamentations', '耶利米哀歌', '耶利米哀歌', 'Lamentaciones', 'Lamentations', 'Klagelieder', 'Lamentações', 'Lamentazioni', '哀歌', '예레미야애가', 'विलापगीत', ['lam']],
  [26, 'ezekiel', 48, 'OT', 'Ezekiel', '以西結書', '以西结书', 'Ezequiel', 'Ézéchiel', 'Hesekiel', 'Ezequiel', 'Ezechiele', 'エゼキエル書', '에스겔', 'यहेजकेल', ['ezek']],
  [27, 'daniel', 12, 'OT', 'Daniel', '但以理書', '但以理书', 'Daniel', 'Daniel', 'Daniel', 'Daniel', 'Daniele', 'ダニエル書', '다니엘', 'दानिय्येल', ['dan']],
  [28, 'hosea', 14, 'OT', 'Hosea', '何西阿書', '何西阿书', 'Oseas', 'Osée', 'Hosea', 'Oséias', 'Osea', 'ホセア書', '호세아', 'होशे', ['hos']],
  [29, 'joel', 3, 'OT', 'Joel', '約珥書', '约珥书', 'Joel', 'Joël', 'Joel', 'Joel', 'Gioele', 'ヨエル書', '요엘', 'योएल'],
  [30, 'amos', 9, 'OT', 'Amos', '阿摩司書', '阿摩司书', 'Amós', 'Amos', 'Amos', 'Amós', 'Amos', 'アモス書', '아모스', 'आमोस'],
  [31, 'obadiah', 1, 'OT', 'Obadiah', '俄巴底亞書', '俄巴底亚书', 'Abdías', 'Abdias', 'Obadja', 'Obadias', 'Abdia', 'オバデヤ書', '오바댜', 'ओबद्याह', ['obad']],
  [32, 'jonah', 4, 'OT', 'Jonah', '約拿書', '约拿书', 'Jonás', 'Jonas', 'Jona', 'Jonas', 'Giona', 'ヨナ書', '요나', 'योना'],
  [33, 'micah', 7, 'OT', 'Micah', '彌迦書', '弥迦书', 'Miqueas', 'Michée', 'Micha', 'Miquéias', 'Michea', 'ミカ書', '미가', 'मीका', ['mic']],
  [34, 'nahum', 3, 'OT', 'Nahum', '那鴻書', '那鸿书', 'Nahúm', 'Nahum', 'Nahum', 'Naum', 'Naum', 'ナホム書', '나훔', 'नहूम'],
  [35, 'habakkuk', 3, 'OT', 'Habakkuk', '哈巴谷書', '哈巴谷书', 'Habacuc', 'Habacuc', 'Habakuk', 'Habacuque', 'Abacuc', 'ハバクク書', '하박국', 'हबक्कूक', ['hab']],
  [36, 'zephaniah', 3, 'OT', 'Zephaniah', '西番雅書', '西番雅书', 'Sofonías', 'Sophonie', 'Zefanja', 'Sofonias', 'Sofonia', 'ゼパニヤ書', '스바냐', 'सपन्याह', ['zeph']],
  [37, 'haggai', 2, 'OT', 'Haggai', '哈該書', '哈该书', 'Hageo', 'Aggée', 'Haggai', 'Ageu', 'Aggeo', 'ハガイ書', '학개', 'हाग्गै', ['hag']],
  [38, 'zechariah', 14, 'OT', 'Zechariah', '撒迦利亞書', '撒迦利亚书', 'Zacarías', 'Zacharie', 'Sacharja', 'Zacarias', 'Zaccaria', 'ゼカリヤ書', '스가랴', 'जकर्याह', ['zech']],
  [39, 'malachi', 4, 'OT', 'Malachi', '瑪拉基書', '玛拉基书', 'Malaquías', 'Malachie', 'Maleachi', 'Malaquias', 'Malachia', 'マラキ書', '말라기', 'मलाकी', ['mal']],
  [40, 'matthew', 28, 'NT', 'Matthew', '馬太福音', '马太福音', 'Mateo', 'Matthieu', 'Matthäus', 'Mateus', 'Matteo', 'マタイによる福音書', '마태복음', 'मत्ती', ['matt', 'mt']],
  [41, 'mark', 16, 'NT', 'Mark', '馬可福音', '马可福音', 'Marcos', 'Marc', 'Markus', 'Marcos', 'Marco', 'マルコによる福音書', '마가복음', 'मरकुस', ['mk']],
  [42, 'luke', 24, 'NT', 'Luke', '路加福音', '路加福音', 'Lucas', 'Luc', 'Lukas', 'Lucas', 'Luca', 'ルカによる福音書', '누가복음', 'लूका', ['lk']],
  [43, 'john', 21, 'NT', 'John', '約翰福音', '约翰福音', 'Juan', 'Jean', 'Johannes', 'João', 'Giovanni', 'ヨハネによる福音書', '요한복음', 'यूहन्ना', ['jn', 'jhn']],
  [44, 'acts', 28, 'NT', 'Acts', '使徒行傳', '使徒行传', 'Hechos', 'Actes', 'Apostelgeschichte', 'Atos', 'Atti', '使徒行伝', '사도행전', 'प्रेरितों के काम', ['ac']],
  [45, 'romans', 16, 'NT', 'Romans', '羅馬書', '罗马书', 'Romanos', 'Romains', 'Römer', 'Romanos', 'Romani', 'ローマ人への手紙', '로마서', 'रोमियों', ['rom', 'ro']],
  [46, '1corinthians', 16, 'NT', '1 Corinthians', '哥林多前書', '哥林多前书', '1 Corintios', '1 Corinthiens', '1. Korinther', '1 Coríntios', '1 Corinzi', 'コリント人への第一の手紙', '고린도전서', '1 कुरिन्थियों', ['1cor', '1 cor']],
  [47, '2corinthians', 13, 'NT', '2 Corinthians', '哥林多後書', '哥林多后书', '2 Corintios', '2 Corinthiens', '2. Korinther', '2 Coríntios', '2 Corinzi', 'コリント人への第二の手紙', '고린도후서', '2 कुरिन्थियों', ['2cor', '2 cor']],
  [48, 'galatians', 6, 'NT', 'Galatians', '加拉太書', '加拉太书', 'Gálatas', 'Galates', 'Galater', 'Gálatas', 'Galati', 'ガラテヤ人への手紙', '갈라디아서', 'गलातियों', ['gal']],
  [49, 'ephesians', 6, 'NT', 'Ephesians', '以弗所書', '以弗所书', 'Efesios', 'Éphésiens', 'Epheser', 'Efésios', 'Efesini', 'エペソ人への手紙', '에베소서', 'इफिसियों', ['eph']],
  [50, 'philippians', 4, 'NT', 'Philippians', '腓立比書', '腓立比书', 'Filipenses', 'Philippiens', 'Philipper', 'Filipenses', 'Filippesi', 'ピリピ人への手紙', '빌립보서', 'फिलिप्पियों', ['phil', 'php']],
  [51, 'colossians', 4, 'NT', 'Colossians', '歌羅西書', '歌罗西书', 'Colosenses', 'Colossiens', 'Kolosser', 'Colossenses', 'Colossesi', 'コロサイ人への手紙', '골로새서', 'कुलुस्सियों', ['col']],
  [52, '1thessalonians', 5, 'NT', '1 Thessalonians', '帖撒羅尼迦前書', '帖撒罗尼迦前书', '1 Tesalonicenses', '1 Thessaloniciens', '1. Thessalonicher', '1 Tessalonicenses', '1 Tessalonicesi', 'テサロニケ人への第一の手紙', '데살로니가전서', '1 थिस्सलुनीकियों', ['1thess']],
  [53, '2thessalonians', 3, 'NT', '2 Thessalonians', '帖撒羅尼迦後書', '帖撒罗尼迦后书', '2 Tesalonicenses', '2 Thessaloniciens', '2. Thessalonicher', '2 Tessalonicenses', '2 Tessalonicesi', 'テサロニケ人への第二の手紙', '데살로니가후서', '2 थिस्सलुनीकियों', ['2thess']],
  [54, '1timothy', 6, 'NT', '1 Timothy', '提摩太前書', '提摩太前书', '1 Timoteo', '1 Timothée', '1. Timotheus', '1 Timóteo', '1 Timoteo', 'テモテへの第一の手紙', '디모데전서', '1 तीमुथियुस', ['1tim']],
  [55, '2timothy', 4, 'NT', '2 Timothy', '提摩太後書', '提摩太后书', '2 Timoteo', '2 Timothée', '2. Timotheus', '2 Timóteo', '2 Timoteo', 'テモテへの第二の手紙', '디모데후서', '2 तीमुथियुस', ['2tim']],
  [56, 'titus', 3, 'NT', 'Titus', '提多書', '提多书', 'Tito', 'Tite', 'Titus', 'Tito', 'Tito', 'テトスへの手紙', '디도서', 'तीतुस', ['tit']],
  [57, 'philemon', 1, 'NT', 'Philemon', '腓利門書', '腓利门书', 'Filemón', 'Philémon', 'Philemon', 'Filemom', 'Filemone', 'ピレモンへの手紙', '빌레몬서', 'फिलेमोन', ['phlm']],
  [58, 'hebrews', 13, 'NT', 'Hebrews', '希伯來書', '希伯来书', 'Hebreos', 'Hébreux', 'Hebräer', 'Hebreus', 'Ebrei', 'ヘブル人への手紙', '히브리서', 'इब्रानियों', ['heb']],
  [59, 'james', 5, 'NT', 'James', '雅各書', '雅各书', 'Santiago', 'Jacques', 'Jakobus', 'Tiago', 'Giacomo', 'ヤコブの手紙', '야고보서', 'याकूब', ['jas']],
  [60, '1peter', 5, 'NT', '1 Peter', '彼得前書', '彼得前书', '1 Pedro', '1 Pierre', '1. Petrus', '1 Pedro', '1 Pietro', 'ペテロの第一の手紙', '베드로전서', '1 पतरस', ['1pet', '1 pe']],
  [61, '2peter', 3, 'NT', '2 Peter', '彼得後書', '彼得后书', '2 Pedro', '2 Pierre', '2. Petrus', '2 Pedro', '2 Pietro', 'ペテロの第二の手紙', '베드로후서', '2 पतरस', ['2pet', '2 pe']],
  [62, '1john', 5, 'NT', '1 John', '約翰一書', '约翰一书', '1 Juan', '1 Jean', '1. Johannes', '1 João', '1 Giovanni', 'ヨハネの第一の手紙', '요한일서', '1 यूहन्ना', ['1jn']],
  [63, '2john', 1, 'NT', '2 John', '約翰二書', '约翰二书', '2 Juan', '2 Jean', '2. Johannes', '2 João', '2 Giovanni', 'ヨハネの第二の手紙', '요한이서', '2 यूहन्ना', ['2jn']],
  [64, '3john', 1, 'NT', '3 John', '約翰三書', '约翰三书', '3 Juan', '3 Jean', '3. Johannes', '3 João', '3 Giovanni', 'ヨハネの第三の手紙', '요한삼서', '3 यूहन्ना', ['3jn']],
  [65, 'jude', 1, 'NT', 'Jude', '猶大書', '犹大书', 'Judas', 'Jude', 'Judas', 'Judas', 'Giuda', 'ユダの手紙', '유다서', 'यहूदा'],
  [66, 'revelation', 22, 'NT', 'Revelation', '啟示錄', '启示录', 'Apocalipsis', 'Apocalypse', 'Offenbarung', 'Apocalipse', 'Apocalisse', 'ヨハネの黙示録', '요한계시록', 'प्रकाशितवाक्य', ['rev']],
];

export const BIBLE_BOOKS: BibleBookMeta[] = RAW_BOOKS.map(
  ([id, slug, chapters, testament, en, zh, zhCN, es, fr, de, pt, it, ja, ko, hi, aliases = []]) => ({
    id,
    slug,
    chapters,
    testament,
    englishName: en,
    names: {
      en,
      zh,
      'zh-CN': zhCN,
      es,
      fr,
      de,
      pt,
      it,
      ja,
      ko,
      hi,
    },
    aliases: [slug, en.toLowerCase(), zh, zhCN, es.toLowerCase(), fr.toLowerCase(), de.toLowerCase(), pt.toLowerCase(), it.toLowerCase(), ja, ko, hi, ...aliases],
  })
);

export function getBookBySlug(slug: string): BibleBookMeta | undefined {
  return BIBLE_BOOKS.find((b) => b.slug === slug);
}

export function getBookName(book: BibleBookMeta, lang: SupportedLang): string {
  return book.names[lang] ?? book.englishName;
}

export function getAdjacentChapter(
  bookSlug: string,
  chapter: number,
  direction: 'prev' | 'next'
): { bookSlug: string; chapter: number } | null {
  const idx = BIBLE_BOOKS.findIndex((b) => b.slug === bookSlug);
  if (idx === -1) return null;
  const book = BIBLE_BOOKS[idx];

  if (direction === 'next') {
    if (chapter < book.chapters) {
      return { bookSlug: book.slug, chapter: chapter + 1 };
    }
    if (idx < BIBLE_BOOKS.length - 1) {
      return { bookSlug: BIBLE_BOOKS[idx + 1].slug, chapter: 1 };
    }
    return null;
  } else {
    if (chapter > 1) {
      return { bookSlug: book.slug, chapter: chapter - 1 };
    }
    if (idx > 0) {
      const prevBook = BIBLE_BOOKS[idx - 1];
      return { bookSlug: prevBook.slug, chapter: prevBook.chapters };
    }
    return null;
  }
}

export function getChapterArtwork(
  bookSlug: string,
  chapter: number
): { url: string; caption: string } | undefined {
  const chapterKey = `${bookSlug}_${chapter}`;
  const flagship = CHAPTER_ARTWORK_MAP[chapterKey];
  if (flagship) return flagship;

  const book = getBookBySlug(bookSlug);
  if (!book) return undefined;

  return {
    url: `/data/images/books/${book.slug}.svg`,
    caption: `Classical Study Plate — ${book.englishName} ${chapter}`,
  };
}
