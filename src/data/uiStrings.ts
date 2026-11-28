import { NarratorVoice, SupportedLang } from '../types/scripture';

export interface HowItWorksStrings {
  title: string;
  leadBeforeBold: string;
  leadBold: string;
  leadAfterBold: string;
  cards: Array<{ title: string; body: string; code?: string }>;
  pipelineTitle: string;
  pipelineDesc: string;
  scopeTitle: string;
  scopeDesc: string;
}

export interface IosGuideStrings {
  title: string;
  step1Before: string;
  step1Bold: string;
  step1After: string;
  step2Before: string;
  step2Bold: string;
  step2After: string;
  step3Before: string;
  step3Bold: string;
  desc: string;
  gotIt: string;
}

export interface UiStrings {
  appName: string;
  languageLabel: string;
  lengthLabel: string;
  narratorLabel: string;
  minuteUnit: string;
  historyButton: string;
  howItWorksButton: string;
  openIndexAria: string;
  collapseIndexAria: string;
  expandIndexAria: string;
  closeIndexAria: string;
  canonicalIndexTitle: string;
  booksCountLabel: string;
  chapterCountShort: (count: number) => string;
  filterBooksPlaceholder: string;
  filterAll: string;
  filterOld: string;
  filterNew: string;
  sidebarFooterHint: string;
  noMatchingBooks: (filter: string) => string;
  featuredChapterTooltip: (ref: string, isFeatured: boolean) => string;
  searchPlaceholder: string;
  tryLabel: string;
  starterQueries: string[];
  listeningLabel: string;
  searchingLabel: string;
  searchScopeLabel: string;
  searchScopeAll: string;
  searchScopeBook: (bookName: string) => string;
  noSearchResults: string;
  loadingBookLabel: (bookName: string) => string;
  bookLoadError: (bookName: string) => string;
  retryButton: string;
  speechUnsupportedNotice: string;
  speechMicErrorNotice: string;
  clearSearchAria: string;
  voiceSearchAria: string;
  stopVoiceSearchAria: string;
  featuredEditionsLabel: string;
  offlineArchiveBadge: string;
  prevButton: string;
  nextButton: string;
  prevChapterAria: string;
  nextChapterAria: string;
  versesUnit: string;
  reflectionUnit: string;
  voiceLabel: string;
  playPodcastButton: string;
  viewLyricsButton: string;
  hideLyricsButton: string;
  shareExportButton: string;
  downloadPdfButton: string;
  exportingLabel: string;
  copyRichText: string;
  copyPlainText: string;
  shareViaDevice: string;
  exportPdf: string;
  copiedRichNotice: string;
  copiedPlainNotice: string;
  clipboardUnavailableNotice: string;
  pdfExportedNotice: string;
  pdfFailedNotice: string;
  devotionalKicker: string;
  devotionalExportLabel: string;
  lyricsExportLabel: string;
  historicalBackground: string;
  theologicalContext: string;
  practicalApplication: string;
  reflectionPrayer: string;
  hymnKicker: string;
  readLyricsButton: string;
  copyLyricsButton: string;
  copiedLabel: string;
  verse1Label: string;
  chorusLabel: string;
  verse2Label: string;
  bridgeLabel: string;
  figurePrefix: string;
  offlinePlateLabel: string;
  archivalPlateSubtitle: (translation: string) => string;
  loadingArchive: string;
  podcastLabel: string;
  lyricsModeLabel: string;
  scripturePartLabel: (part: number, voice: string) => string;
  devotionalPartLabel: (voice: string, isSecond: boolean) => string;
  lyricsReadingLabel: (voice: string) => string;
  partProgress: (part: number, total: number) => string;
  playingPartProgress: (part: number, total: number, label: string) => string;
  audioFallbackError: string;
  audioSynthUnavailable: (bcp47: string) => string;
  voicePickerAuto: string;
  voicePickerAria: string;
  fontSizeAria: string;
  fontSizes: Record<'sm' | 'md' | 'lg', string>;
  cacheBookButton: string;
  cachingBookLabel: string;
  bookCachedNotice: (bookName: string, count: number) => string;
  bookmarkVerseAria: (verse: number, saved: boolean) => string;
  historyTab: string;
  bookmarksTab: string;
  emptyBookmarks: string;
  clearBookmarksAria: string;
  removeBookmarkAria: string;
  historyTitle: string;
  emptyHistory: string;
  clearHistoryAria: string;
  closeHistoryAria: string;
  offlineBanner: string;
  installApp: string;
  addToHome: string;
  voiceTimbres: Record<NarratorVoice, string>;
  artworkCaptions: Record<string, string>;
  howItWorks: HowItWorksStrings;
  iosGuide: IosGuideStrings;
  unseeded: {
    referenceTopic: string;
    searchTitle: (ref: string) => string;
    searchSnippet: (ref: string) => string;
    otLabel: string;
    ntLabel: string;
    verse1: (ref: string, testament: string, chapters: number) => string;
    verse2: (ref: string, key: string) => string;
    devTitle: (ref: string) => string;
    historicalBackground: (bookName: string, bookId: number, testament: string) => string;
    theologicalContext: () => string;
    practicalApplication: (ref: string) => string;
    reflectionPrayer: (ref: string) => string;
    songTitle: (ref: string) => string;
    tempoNote: string;
    songVerse1: (ref: string) => string[];
    songChorus: string[];
    songVerse2: string[];
    songBridge: string[];
  };
}

const EN_STRINGS: UiStrings = {
  appName: 'Scripture Voice',
  languageLabel: 'Language',
  lengthLabel: 'Length',
  narratorLabel: 'Narrator',
  minuteUnit: 'min',
  historyButton: 'History',
  howItWorksButton: 'How it works',
  openIndexAria: 'Open Bible index',
  collapseIndexAria: 'Collapse Bible index',
  expandIndexAria: 'Expand Bible index',
  closeIndexAria: 'Close Bible index',
  canonicalIndexTitle: 'Canonical Index',
  booksCountLabel: '66 Books',
  chapterCountShort: (count) => `${count} ch`,
  filterBooksPlaceholder: 'Filter books...',
  filterAll: 'All',
  filterOld: 'Old',
  filterNew: 'New',
  sidebarFooterHint: 'Underlined chapters include full pre-generated scripture, artwork, lyrics, and multi-length devotionals.',
  noMatchingBooks: (filter) => `No books match "${filter}".`,
  featuredChapterTooltip: (ref, isFeatured) =>
    isFeatured ? `${ref} (Full pre-generated bundle)` : ref,
  searchPlaceholder: 'Search scripture, themes, or references (e.g. John 3:16, comfort in anxiety)...',
  tryLabel: 'Try:',
  starterQueries: ['Comfort in anxiety', 'Strength for today', 'Love is patient', 'John 3:16', 'Psalm 23'],
  listeningLabel: 'Listening',
  searchingLabel: 'Searching…',
  searchScopeLabel: 'Scope:',
  searchScopeAll: 'Full Bible',
  searchScopeBook: (bookName) => `${bookName} only`,
  noSearchResults: 'No matching passages in the local index. Try a theme like "peace" or a book reference like "Psalm 23".',
  loadingBookLabel: (bookName) => `Loading ${bookName}…`,
  bookLoadError: (bookName) => `Could not load ${bookName}. Please check your connection and try again.`,
  retryButton: 'Retry',
  speechUnsupportedNotice: 'Voice search requires Chrome, Edge, or Safari Web Speech support.',
  speechMicErrorNotice: 'Could not capture microphone audio. You can type your query above.',
  clearSearchAria: 'Clear search',
  voiceSearchAria: 'Search by voice',
  stopVoiceSearchAria: 'Stop voice search',
  featuredEditionsLabel: 'Featured editions:',
  offlineArchiveBadge: '100% Local Static Archive',
  prevButton: 'Prev',
  nextButton: 'Next',
  prevChapterAria: 'Previous chapter',
  nextChapterAria: 'Next chapter',
  versesUnit: 'verses',
  reflectionUnit: 'min reflection',
  voiceLabel: 'Voice',
  playPodcastButton: 'Play Podcast',
  viewLyricsButton: 'View Song Lyrics',
  hideLyricsButton: 'Hide Song Lyrics',
  shareExportButton: 'Share / Export',
  downloadPdfButton: 'Download PDF',
  exportingLabel: 'Exporting…',
  copyRichText: 'Copy Rich Text & Image',
  copyPlainText: 'Copy Plain Text',
  shareViaDevice: 'Share via Device…',
  exportPdf: 'Export Study Sheet (PDF)',
  copiedRichNotice: 'Copied formatted passage to clipboard.',
  copiedPlainNotice: 'Copied plain text passage.',
  clipboardUnavailableNotice: 'Clipboard permission unavailable.',
  pdfExportedNotice: 'Exported PDF study sheet.',
  pdfFailedNotice: 'PDF export failed in this browser.',
  devotionalKicker: 'Devotional Study',
  devotionalExportLabel: 'DEVOTIONAL',
  lyricsExportLabel: 'SONG LYRICS',
  historicalBackground: 'Historical Background',
  theologicalContext: 'Theological Context',
  practicalApplication: 'Practical Application',
  reflectionPrayer: 'Reflection Prayer',
  hymnKicker: 'Hymn & Worship Transcript',
  readLyricsButton: 'Read Lyrics',
  copyLyricsButton: 'Copy Lyrics',
  copiedLabel: 'Copied',
  verse1Label: 'Verse 1',
  chorusLabel: 'Chorus',
  verse2Label: 'Verse 2',
  bridgeLabel: 'Bridge',
  figurePrefix: 'Fig.',
  offlinePlateLabel: 'Offline Canonical Plate',
  archivalPlateSubtitle: (translation) => `Archival study plate · ${translation}`,
  loadingArchive: 'Loading local scripture archive…',
  podcastLabel: 'Podcast',
  lyricsModeLabel: 'Worship Lyrics',
  scripturePartLabel: (part, voice) => `Scripture Reading · Part ${part} (${voice})`,
  devotionalPartLabel: (voice, isSecond) =>
    isSecond ? `Reflection & Application (${voice})` : `Devotional Context (${voice})`,
  lyricsReadingLabel: (voice) => `Worship Lyrics Reading (${voice})`,
  partProgress: (part, total) => `Part ${part}/${total}`,
  playingPartProgress: (part, total, label) => `Playing part ${part} / ${total} · ${label}`,
  audioFallbackError: 'Unable to load fallback audio segment.',
  audioSynthUnavailable: (bcp47) => `Voice synthesis unavailable for ${bcp47} in this browser.`,
  voicePickerAuto: 'Auto (Best OS Voice)',
  voicePickerAria: 'Select device voice',
  fontSizeAria: 'Reading text size',
  fontSizes: {
    sm: 'Compact',
    md: 'Standard',
    lg: 'Large',
  },
  cacheBookButton: 'Save Book Offline',
  cachingBookLabel: 'Saving…',
  bookCachedNotice: (bookName, count) => `Cached ${count} chapter(s) of ${bookName} for offline reading.`,
  bookmarkVerseAria: (verse, saved) => (saved ? `Remove bookmark for verse ${verse}` : `Bookmark verse ${verse}`),
  historyTab: 'History',
  bookmarksTab: 'Bookmarks',
  emptyBookmarks: 'Click the bookmark icon next to any verse to save favorite passages privately in your browser.',
  clearBookmarksAria: 'Clear all bookmarks',
  removeBookmarkAria: 'Remove bookmark',
  historyTitle: 'Study Library',
  emptyHistory: 'Your local reading history will appear here as you explore chapters. Saved privately in your browser.',
  clearHistoryAria: 'Clear reading history',
  closeHistoryAria: 'Close history drawer',
  offlineBanner: 'Offline Mode · Using local cached scripture',
  installApp: 'Install App',
  addToHome: 'Add to Home',
  voiceTimbres: {
    Fenrir: 'Warm Baritone',
    Kore: 'Clear Alto',
    Puck: 'Bright Tenor',
    Charon: 'Deep Bass',
    Zephyr: 'Gentle Soprano',
  },
  artworkCaptions: {
    genesis_1: 'Classical Study — First Light Over the Deep (Genesis 1)',
    psalm_23: 'Classical Study — Pastures Beside Still Waters (Psalm 23)',
    '1corinthians_13': 'Classical Study — Sanctuary Lamps & Olive Branch (1 Corinthians 13)',
    john_3: 'Classical Study — Lantern in the Courtyard at Night (John 3)',
  },
  howItWorks: {
    title: 'How Scripture Voice Works Offline',
    leadBeforeBold: 'Scripture Voice operates ',
    leadBold: '100% locally on static Bible text and pre-generated bundles',
    leadAfterBold: '—with zero runtime LLM, cloud translation, or image API calls.',
    cards: [
      {
        title: 'Build-Time Static Corpus',
        body: 'Public-domain scripture, multi-length devotionals, and song lyrics are pre-compiled at build time into JSON bundles under ',
        code: '/data/',
      },
      {
        title: 'Client-Side BM25 & Voice Search',
        body: 'Lazy-loaded book files and full-Bible TF-IDF search resolve locally via ',
        code: 'books/*.json',
      },
      {
        title: 'On-Device Spoken Voice',
        body: 'Readings speak in real time using your OS and browser speech voices directly from chapter text via ',
        code: 'speechSynthesis',
      },
      {
        title: 'PWA Offline Caching',
        body: 'Workbox precaches app bundles, artwork, and JSON data locally for full offline and Home Screen use.',
      },
    ],
    pipelineTitle: 'Build-Time Pre-Generation Pipeline',
    pipelineDesc: 'Expand the offline archive at any time by adding chapters to src/data/seededCorpus.ts and running:',
    scopeTitle: 'Offline Language Coverage',
    scopeDesc:
      'English, Traditional Chinese, and Simplified Chinese are bundled by default with full scripture, devotionals, worship lyrics, and voice reading. Generate additional languages (es, fr, de, pt, it, ja, ko, hi) anytime via npm run pregenerate -- --langs=<codes>.',
  },
  iosGuide: {
    title: 'Install on iPhone / iPad',
    step1Before: 'Open this site in ',
    step1Bold: 'Safari',
    step1After: ' on your iPhone or iPad.',
    step2Before: 'Tap the ',
    step2Bold: 'Share',
    step2After: ' button in Safari’s toolbar.',
    step3Before: 'Scroll down and tap ',
    step3Bold: 'Add to Home Screen',
    desc: 'Once added, Scripture Voice launches full-screen and works offline with cached scripture, devotionals, lyrics, and artwork.',
    gotIt: 'Got it',
  },
  unseeded: {
    referenceTopic: 'reference',
    searchTitle: (ref) => `${ref} · Canonical Chapter`,
    searchSnippet: (ref) => `Open ${ref} in the offline reader.`,
    otLabel: 'Old Testament',
    ntLabel: 'New Testament',
    verse1: (ref, testament, chapters) =>
      `${ref} is part of the ${testament} canon (${chapters} chapters total). This chapter has not yet been compiled into the local static bundle.`,
    verse2: (ref, key) =>
      `To include ${ref} in your offline reader, add its public-domain text to the local corpus and run: npm run pregenerate -- --chapters=${key}`,
    devTitle: (ref) => `${ref} — Canonical Archive Entry`,
    historicalBackground: (bookName, bookId, testament) =>
      `${bookName} is Book ${bookId} of the 66-book biblical canon (${testament}). Full offline commentary is generated at build time via scripts/pregenerate.ts.`,
    theologicalContext: () =>
      'Pre-seeded flagship chapters with complete translations, devotionals, artwork, and worship lyrics include Genesis 1, Psalm 23, Psalm 91, Proverbs 3, Isaiah 40, Matthew 5, John 3, Romans 8, 1 Corinthians 13, and Philippians 4.',
    practicalApplication: (ref) =>
      `Run the offline pre-generation script to build static JSON and TF-IDF search tokens for ${ref}. Audio plays live through your device's built-in speech engine with zero runtime AI or network APIs.`,
    reflectionPrayer: (ref) =>
      `Lord, grant us quiet attentiveness as we study ${ref} and walk in the truth of your word. Amen.`,
    songTitle: (ref) => `Meditation on ${ref}`,
    tempoNote: 'Quiet study · Unseeded chapter',
    songVerse1: (ref) => [
      `Words of ${ref} stand ready in the canon,`,
      'Waiting to be gathered into offline song;',
    ],
    songChorus: [
      'Pre-generate the chapter bundle locally,',
      'And sing the timeless promise all day long.',
    ],
    songVerse2: [
      'Zero runtime servers, zero cloud delay,',
      'Static scripture archives built to guide your way.',
    ],
    songBridge: ['Run npm run pregenerate to compile this chapter.'],
  },
};

const ZH_TW_STRINGS: UiStrings = {
  appName: '聖經之音',
  languageLabel: '語言',
  lengthLabel: '篇幅',
  narratorLabel: '朗讀',
  minuteUnit: '分鐘',
  historyButton: '閱讀紀錄',
  howItWorksButton: '離線原理',
  openIndexAria: '開啟聖經目錄',
  collapseIndexAria: '收合聖經目錄',
  expandIndexAria: '展開聖經目錄',
  closeIndexAria: '關閉聖經目錄',
  canonicalIndexTitle: '聖經書卷目錄',
  booksCountLabel: '66 卷書',
  chapterCountShort: (count) => `${count} 章`,
  filterBooksPlaceholder: '搜尋書卷名稱...',
  filterAll: '全部',
  filterOld: '舊約',
  filterNew: '新約',
  sidebarFooterHint: '標有底線的章節包含完整預先產生的多語言經文、靈修解析、詩歌與插畫。',
  noMatchingBooks: (filter) => `找不到符合「${filter}」的書卷。`,
  featuredChapterTooltip: (ref, isFeatured) => (isFeatured ? `${ref}（完整預製離線章節）` : ref),
  searchPlaceholder: '搜尋經文、主題或章節（例如：約翰福音 3:16、焦慮中的安慰）...',
  tryLabel: '試試看：',
  starterQueries: ['焦慮中的安慰', '今日的力量', '愛是恆久忍耐', '約翰福音 3:16', '詩篇 23'],
  listeningLabel: '正在聆聽',
  searchingLabel: '搜尋中…',
  searchScopeLabel: '範圍：',
  searchScopeAll: '整本聖經',
  searchScopeBook: (bookName) => `僅 ${bookName}`,
  noSearchResults: '本地索引中找不到相符經文，請試著搜尋主題（如「平安」）或書卷章節（如「詩篇 23」）。',
  loadingBookLabel: (bookName) => `正在載入 ${bookName}…`,
  bookLoadError: (bookName) => `無法載入 ${bookName} 資料，請檢查網路後重試。`,
  retryButton: '重試',
  speechUnsupportedNotice: '語音搜尋需要 Chrome、Edge 或 Safari 瀏覽器的語音辨識支援。',
  speechMicErrorNotice: '無法擷取麥克風音訊，您也可以直接在上方輸入關鍵字搜尋。',
  clearSearchAria: '清除搜尋',
  voiceSearchAria: '語音搜尋',
  stopVoiceSearchAria: '停止語音搜尋',
  featuredEditionsLabel: '精選預製章節：',
  offlineArchiveBadge: '100% 本地離線靜態資料庫',
  prevButton: '上一章',
  nextButton: '下一章',
  prevChapterAria: '上一章',
  nextChapterAria: '下一章',
  versesUnit: '節經文',
  reflectionUnit: '分鐘靈修',
  voiceLabel: '聲線',
  playPodcastButton: '播放語音導讀',
  viewLyricsButton: '查看詩歌歌詞',
  hideLyricsButton: '隱藏詩歌歌詞',
  shareExportButton: '分享 / 匯出',
  downloadPdfButton: '下載 PDF',
  exportingLabel: '匯出中…',
  copyRichText: '複製富文本與插畫',
  copyPlainText: '複製純文字',
  shareViaDevice: '透過裝置分享…',
  exportPdf: '匯出靈修講義 (PDF)',
  copiedRichNotice: '已複製完整經文與圖片至剪貼簿。',
  copiedPlainNotice: '已複製純文字經文與靈修內容。',
  clipboardUnavailableNotice: '瀏覽器未允許存取剪貼簿。',
  pdfExportedNotice: '已匯出 PDF 靈修講義。',
  pdfFailedNotice: '此瀏覽器無法匯出 PDF。',
  devotionalKicker: '靈修默想',
  devotionalExportLabel: '靈修默想',
  lyricsExportLabel: '敬拜詩歌歌詞',
  historicalBackground: '歷史背景',
  theologicalContext: '神學脈絡',
  practicalApplication: '生活應用',
  reflectionPrayer: '默想禱告',
  hymnKicker: '敬拜詩歌歌詞',
  readLyricsButton: '朗讀歌詞',
  copyLyricsButton: '複製歌詞',
  copiedLabel: '已複製',
  verse1Label: '第一段',
  chorusLabel: '副歌',
  verse2Label: '第二段',
  bridgeLabel: '橋段',
  figurePrefix: '圖版',
  offlinePlateLabel: '離線經典研經圖版',
  archivalPlateSubtitle: (translation) => `典藏研經圖版 · ${translation}`,
  loadingArchive: '正在載入本地離線經文資料庫…',
  podcastLabel: '語音導讀',
  lyricsModeLabel: '敬拜詩歌',
  scripturePartLabel: (part, voice) => `經文朗讀 · 第 ${part} 段（${voice}）`,
  devotionalPartLabel: (voice, isSecond) =>
    isSecond ? `生活應用與禱告（${voice}）` : `歷史與神學解析（${voice}）`,
  lyricsReadingLabel: (voice) => `詩歌歌詞朗讀（${voice}）`,
  partProgress: (part, total) => `第 ${part}/${total} 段`,
  playingPartProgress: (part, total, label) => `正在播放第 ${part}/${total} 段 · ${label}`,
  audioFallbackError: '無法載入備用語音音檔。',
  audioSynthUnavailable: (bcp47) => `此瀏覽器尚未安裝 ${bcp47} 語音合成聲線。`,
  voicePickerAuto: '自動（最佳系統聲線）',
  voicePickerAria: '選擇裝置語音',
  fontSizeAria: '閱讀字體大小',
  fontSizes: {
    sm: '小',
    md: '標準',
    lg: '大',
  },
  cacheBookButton: '離線快取本卷',
  cachingBookLabel: '快取中…',
  bookCachedNotice: (bookName, count) => `已將 ${bookName} 的 ${count} 個章節快取至離線儲存區。`,
  bookmarkVerseAria: (verse, saved) => (saved ? `取消第 ${verse} 節書籤` : `收藏第 ${verse} 節經文`),
  historyTab: '閱讀紀錄',
  bookmarksTab: '經文書籤',
  emptyBookmarks: '點擊任意經節旁的書籤圖示，即可在瀏覽器本機私密收藏喜愛的經文。',
  clearBookmarksAria: '清除所有書籤',
  removeBookmarkAria: '移除書籤',
  historyTitle: '研經紀錄與書籤',
  emptyHistory: '瀏覽過的章節將會儲存在您的瀏覽器本地紀錄中，完全離線私密保存。',
  clearHistoryAria: '清除閱讀紀錄',
  closeHistoryAria: '關閉閱讀紀錄',
  offlineBanner: '離線模式 · 正在使用本地快取經文',
  installApp: '安裝應用程式',
  addToHome: '加入主畫面',
  voiceTimbres: {
    Fenrir: '沉穩男中音',
    Kore: '清澈女中音',
    Puck: '明亮男高音',
    Charon: '渾厚男低音',
    Zephyr: '溫柔女高音',
  },
  artworkCaptions: {
    genesis_1: '古典油畫研經圖版 — 深淵上的第一道光（創世記 1）',
    psalm_23: '古典油畫研經圖版 — 可安歇的水邊青草地（詩篇 23）',
    '1corinthians_13': '古典油畫研經圖版 — 聖所油燈與橄欖枝（哥林多前書 13）',
    john_3: '古典油畫研經圖版 — 夜色庭院中的燈火（約翰福音 3）',
  },
  howItWorks: {
    title: '聖經之音如何 100% 離線運作',
    leadBeforeBold: '聖經之音全程採用',
    leadBold: '本地公版聖經文本與建置時期預先產生的靜態資料包',
    leadAfterBold: '——執行期間完全不呼叫任何雲端大語言模型（LLM）、線上翻譯或生成式 API。',
    cards: [
      {
        title: '建置時預先編譯靜態書庫',
        body: '各語言經文、不同篇幅的靈修解析與詩歌歌詞，都在建置時預先寫入靜態 JSON 檔案：',
        code: '/data/',
      },
      {
        title: '本地端 BM25 與語音搜尋',
        body: '依書卷延遲載入詞頻索引檔與全文搜尋，零延遲離線完成：',
        code: 'books/*.json',
      },
      {
        title: '裝置端自然人聲朗讀',
        body: '語音播放直接由您的作業系統與瀏覽器內建聲線即時逐句朗讀經文，無須下載音檔：',
        code: 'speechSynthesis',
      },
      {
        title: 'PWA 離線快取與主畫面安裝',
        body: '透過 Workbox Service Worker 將網頁、插畫與靜態資料庫快取於手機本地，支援 iOS 加入主畫面離線開啟。',
      },
    ],
    pipelineTitle: '建置時離線資料產生腳本',
    pipelineDesc: '如需擴充更多章節或語言，可編輯 src/data/seededCorpus.ts 後於本機執行：',
    scopeTitle: '各語言離線涵蓋說明',
    scopeDesc:
      '預設收錄英文、繁體中文與簡體中文之完整經文、五種篇幅靈修、敬拜詩歌與語音朗讀。如需西班牙文、日文、韓文等其他語言，可隨時執行 npm run pregenerate -- --langs=<語言代碼> 擴充。',
  },
  iosGuide: {
    title: '安裝到 iPhone / iPad 主畫面',
    step1Before: '請使用 iPhone 或 iPad 上的 ',
    step1Bold: 'Safari',
    step1After: ' 瀏覽器開啟本網站。',
    step2Before: '點擊 Safari 工具列上的 ',
    step2Bold: '分享',
    step2After: ' 圖示。',
    step3Before: '向下捲動選單並點擊 ',
    step3Bold: '加入主畫面',
    desc: '加入後即可像原生 App 一樣全螢幕啟動，並離線閱讀已快取的經文、靈修、詩歌與插畫。',
    gotIt: '知道了',
  },
  unseeded: {
    referenceTopic: '章節索引',
    searchTitle: (ref) => `${ref} · 正典章節`,
    searchSnippet: (ref) => `在離線閱讀器中開啟 ${ref}。`,
    otLabel: '舊約聖經',
    ntLabel: '新約聖經',
    verse1: (ref, testament, chapters) =>
      `${ref} 收錄於${testament}正典（全卷共 ${chapters} 章）。此章節尚未匯入本示範版的預製靜態資料包中。`,
    verse2: (ref, key) =>
      `若要將 ${ref} 納入離線閱讀庫，請將該章節公版經文加入本地語料後執行：npm run pregenerate -- --chapters=${key}`,
    devTitle: (ref) => `${ref} — 離線正典收錄說明`,
    historicalBackground: (bookName, bookId, testament) =>
      `${bookName}為六十六卷聖經正典的第 ${bookId} 卷書（${testament}）。完整離線導讀內容係於建置時期透過 scripts/pregenerate.ts 預先編譯產生，而非執行時動態生成。`,
    theologicalContext: () =>
      '本應用已預先完整收錄 10 個精選代表章節（創世記 1、詩篇 23、詩篇 91、箴言 3、以賽亞書 40、馬太福音 5、約翰福音 3、羅馬書 8、哥林多前書 13、腓立比書 4），均含繁簡中文與英文經文、五種篇幅靈修與詩歌。',
    practicalApplication: (ref) =>
      `本程式完全離線運作，零雲端 LLM 或即時翻譯呼叫。您可從左側目錄點選標有底線的精選章節，或執行預先生成腳本擴充 ${ref} 的靜態檔案。`,
    reflectionPrayer: (ref) =>
      `主啊，當我們研讀 ${ref} 與思想祢的話語時，求祢賜下安靜專注的心，引導我們行在祢的真理之中。阿們。`,
    songTitle: (ref) => `${ref} 默想詩歌`,
    tempoNote: '安靜研讀 · 尚未預製此章完整曲詞',
    songVerse1: (ref) => [
      `${ref} 的話語存留於正典之中，`,
      '靜候匯入離線聖經書庫與詩歌；',
    ],
    songChorus: [
      '於建置時預先編譯靜態篇章，',
      '無須連網亦能每日頌讚主恩言。',
    ],
    songVerse2: [
      '不依賴雲端模型即時生成，',
      '本地典藏經文時時伴隨同行。',
    ],
    songBridge: ['執行 npm run pregenerate 即可為本章建立完整離線詩歌與導讀。'],
  },
};

const ZH_CN_STRINGS: UiStrings = {
  appName: '圣经之音',
  languageLabel: '语言',
  lengthLabel: '篇幅',
  narratorLabel: '朗读',
  minuteUnit: '分钟',
  historyButton: '阅读记录',
  howItWorksButton: '离线原理',
  openIndexAria: '打开圣经目录',
  collapseIndexAria: '收起圣经目录',
  expandIndexAria: '展开圣经目录',
  closeIndexAria: '关闭圣经目录',
  canonicalIndexTitle: '圣经书卷目录',
  booksCountLabel: '66 卷书',
  chapterCountShort: (count) => `${count} 章`,
  filterBooksPlaceholder: '搜索书卷名称...',
  filterAll: '全部',
  filterOld: '旧约',
  filterNew: '新约',
  sidebarFooterHint: '标有下划线的章节包含完整预先生成的多语言经文、灵修解析、诗歌与插画。',
  noMatchingBooks: (filter) => `找不到符合「${filter}」的书卷。`,
  featuredChapterTooltip: (ref, isFeatured) => (isFeatured ? `${ref}（完整预制离线章节）` : ref),
  searchPlaceholder: '搜索经文、主题或章节（例如：约翰福音 3:16、焦虑中的安慰）...',
  tryLabel: '试试看：',
  starterQueries: ['焦虑中的安慰', '今日的力量', '爱是恒久忍耐', '约翰福音 3:16', '诗篇 23'],
  listeningLabel: '正在聆听',
  searchingLabel: '搜索中…',
  searchScopeLabel: '范围：',
  searchScopeAll: '整本圣经',
  searchScopeBook: (bookName) => `仅 ${bookName}`,
  noSearchResults: '本地索引中找不到相符经文，请试着搜索主题（如「平安」）或书卷章节（如「诗篇 23」）。',
  loadingBookLabel: (bookName) => `正在加载 ${bookName}…`,
  bookLoadError: (bookName) => `无法加载 ${bookName} 数据，请检查网络后重试。`,
  retryButton: '重试',
  speechUnsupportedNotice: '语音搜索需要 Chrome、Edge 或 Safari 浏览器的语音识别支持。',
  speechMicErrorNotice: '无法采集麦克风音频，您也可以直接在上方输入关键词搜索。',
  clearSearchAria: '清除搜索',
  voiceSearchAria: '语音搜索',
  stopVoiceSearchAria: '停止语音搜索',
  featuredEditionsLabel: '精选预制章节：',
  offlineArchiveBadge: '100% 本地离线静态数据库',
  prevButton: '上一章',
  nextButton: '下一章',
  prevChapterAria: '上一章',
  nextChapterAria: '下一章',
  versesUnit: '节经文',
  reflectionUnit: '分钟灵修',
  voiceLabel: '声线',
  playPodcastButton: '播放语音导读',
  viewLyricsButton: '查看诗歌歌词',
  hideLyricsButton: '隐藏诗歌歌词',
  shareExportButton: '分享 / 导出',
  downloadPdfButton: '下载 PDF',
  exportingLabel: '导出中…',
  copyRichText: '复制富文本与插画',
  copyPlainText: '复制纯文本',
  shareViaDevice: '通过设备分享…',
  exportPdf: '导出灵修讲义 (PDF)',
  copiedRichNotice: '已复制完整经文与图片至剪贴板。',
  copiedPlainNotice: '已复制纯文本经文与灵修内容。',
  clipboardUnavailableNotice: '浏览器未允许访问剪贴板。',
  pdfExportedNotice: '已导出 PDF 灵修讲义。',
  pdfFailedNotice: '此浏览器无法导出 PDF。',
  devotionalKicker: '灵修默想',
  devotionalExportLabel: '灵修默想',
  lyricsExportLabel: '敬拜诗歌歌词',
  historicalBackground: '历史背景',
  theologicalContext: '神学脉络',
  practicalApplication: '生活应用',
  reflectionPrayer: '默想祷告',
  hymnKicker: '敬拜诗歌歌词',
  readLyricsButton: '朗读歌词',
  copyLyricsButton: '复制歌词',
  copiedLabel: '已复制',
  verse1Label: '第一段',
  chorusLabel: '副歌',
  verse2Label: '第二段',
  bridgeLabel: '桥段',
  figurePrefix: '图版',
  offlinePlateLabel: '离线经典研经图版',
  archivalPlateSubtitle: (translation) => `典藏研经图版 · ${translation}`,
  loadingArchive: '正在载入本地离线经文数据库…',
  podcastLabel: '语音导读',
  lyricsModeLabel: '敬拜诗歌',
  scripturePartLabel: (part, voice) => `经文朗读 · 第 ${part} 段（${voice}）`,
  devotionalPartLabel: (voice, isSecond) =>
    isSecond ? `生活应用与祷告（${voice}）` : `历史与神学解析（${voice}）`,
  lyricsReadingLabel: (voice) => `诗歌歌词朗读（${voice}）`,
  partProgress: (part, total) => `第 ${part}/${total} 段`,
  playingPartProgress: (part, total, label) => `正在播放第 ${part}/${total} 段 · ${label}`,
  audioFallbackError: '无法载入备用语音音频。',
  audioSynthUnavailable: (bcp47) => `此浏览器尚未安装 ${bcp47} 语音合成声线。`,
  voicePickerAuto: '自动（最佳系统声线）',
  voicePickerAria: '选择设备语音',
  fontSizeAria: '阅读字体大小',
  fontSizes: {
    sm: '小',
    md: '标准',
    lg: '大',
  },
  cacheBookButton: '离线缓存本卷',
  cachingBookLabel: '缓存中…',
  bookCachedNotice: (bookName, count) => `已将 ${bookName} 的 ${count} 个章节缓存至离线存储。`,
  bookmarkVerseAria: (verse, saved) => (saved ? `取消第 ${verse} 节书签` : `收藏第 ${verse} 节经文`),
  historyTab: '阅读记录',
  bookmarksTab: '经文书签',
  emptyBookmarks: '点击任意经节旁的书签图标，即可在浏览器本地私密收藏喜爱的经文。',
  clearBookmarksAria: '清除所有书签',
  removeBookmarkAria: '移除书签',
  historyTitle: '研经记录与书签',
  emptyHistory: '浏览过的章节将会保存在您的浏览器本地记录中，完全离线私密保存。',
  clearHistoryAria: '清除阅读记录',
  closeHistoryAria: '关闭阅读记录',
  offlineBanner: '离线模式 · 正在使用本地缓存经文',
  installApp: '安装应用',
  addToHome: '添加到主屏幕',
  voiceTimbres: {
    Fenrir: '沉稳男中音',
    Kore: '清澈女中音',
    Puck: '明亮男高音',
    Charon: '浑厚男低音',
    Zephyr: '温柔女高音',
  },
  artworkCaptions: {
    genesis_1: '古典油画研经图版 — 深渊上的第一道光（创世记 1）',
    psalm_23: '古典油画研经图版 — 可安歇的水边青草地（诗篇 23）',
    '1corinthians_13': '古典油画研经图版 — 圣所油灯与橄榄枝（哥林多前书 13）',
    john_3: '古典油画研经图版 — 夜色庭院中的灯火（约翰福音 3）',
  },
  howItWorks: {
    title: '圣经之音如何 100% 离线运作',
    leadBeforeBold: '圣经之音全程采用',
    leadBold: '本地公版圣经文本与构建时期预先生成的静态数据包',
    leadAfterBold: '——运行期间完全不调用任何云端大语言模型（LLM）、在线翻译或生成式 API。',
    cards: [
      {
        title: '构建时预先编译静态书库',
        body: '各语言经文、不同篇幅的灵修解析与诗歌歌词，都在构建时预先写入静态 JSON 文件：',
        code: '/data/',
      },
      {
        title: '本地端 BM25 与语音搜索',
        body: '按书卷懒加载词频索引文件与全文搜索，零延迟离线完成：',
        code: 'books/*.json',
      },
      {
        title: '设备端自然人声朗读',
        body: '语音播放直接由您的操作系统与浏览器内置声线实时逐句朗读经文，无需下载音频文件：',
        code: 'speechSynthesis',
      },
      {
        title: 'PWA 离线缓存与主屏幕安装',
        body: '通过 Workbox Service Worker 将网页、插画与静态数据库缓存于手机本地，支持 iOS 添加到主屏幕离线打开。',
      },
    ],
    pipelineTitle: '构建时离线数据生成脚本',
    pipelineDesc: '如需扩充更多章节或语言，可编辑 src/data/seededCorpus.ts 后在本机运行：',
    scopeTitle: '各语言离线覆盖说明',
    scopeDesc:
      '默认收录英文、简体中文与繁体中文之完整经文、五种篇幅灵修、敬拜诗歌与语音朗读。如需西班牙文、日文、韩文等其他语言，可随时执行 npm run pregenerate -- --langs=<语言代码> 扩充。',
  },
  iosGuide: {
    title: '安装到 iPhone / iPad 主屏幕',
    step1Before: '请使用 iPhone 或 iPad 上的 ',
    step1Bold: 'Safari',
    step1After: ' 浏览器打开本网站。',
    step2Before: '点击 Safari 工具栏上的 ',
    step2Bold: '分享',
    step2After: ' 图标。',
    step3Before: '向下滚动菜单并点击 ',
    step3Bold: '添加到主屏幕',
    desc: '添加后即可像原生应用一样全屏幕启动，并离线阅读已缓存的经文、灵修、诗歌与插画。',
    gotIt: '知道了',
  },
  unseeded: {
    referenceTopic: '章节索引',
    searchTitle: (ref) => `${ref} · 正典章节`,
    searchSnippet: (ref) => `在离线阅读器中打开 ${ref}。`,
    otLabel: '旧约圣经',
    ntLabel: '新约圣经',
    verse1: (ref, testament, chapters) =>
      `${ref} 收录于${testament}正典（全卷共 ${chapters} 章）。此章节尚未导入本演示版的预制静态数据包中。`,
    verse2: (ref, key) =>
      `若要将 ${ref} 纳入离线阅读库，请将该章节公版经文加入本地语料后运行：npm run pregenerate -- --chapters=${key}`,
    devTitle: (ref) => `${ref} — 离线正典收录说明`,
    historicalBackground: (bookName, bookId, testament) =>
      `${bookName}为六十六卷圣经正典的第 ${bookId} 卷书（${testament}）。完整离线导读内容系于构建时期通过 scripts/pregenerate.ts 预先编译生成，而非运行时动态生成。`,
    theologicalContext: () =>
      '本应用已预先完整收录 10 个精选代表章节（创世记 1、诗篇 23、诗篇 91、箴言 3、以赛亚书 40、马太福音 5、约翰福音 3、罗马书 8、哥林多前书 13、腓立比书 4），均含简繁中文与英文经文、五种篇幅灵修与诗歌。',
    practicalApplication: (ref) =>
      `本程序完全离线运作，零云端 LLM 或实时翻译调用。您可从左侧目录点选标有下划线的精选章节，或运行预先生成脚本扩充 ${ref} 的静态文件。`,
    reflectionPrayer: (ref) =>
      `主啊，当我们研读 ${ref} 与思想你的话语时，求你赐下安静专注的心，引导我们行在你的真理之中。阿们。`,
    songTitle: (ref) => `${ref} 默想诗歌`,
    tempoNote: '安静研读 · 尚未预制此章完整曲词',
    songVerse1: (ref) => [
      `${ref} 的话语存留于正典之中，`,
      '静候导入离线圣经书库与诗歌；',
    ],
    songChorus: [
      '于构建时预先编译静态篇章，',
      '无须联网亦能每日颂赞主恩言。',
    ],
    songVerse2: [
      '不依赖云端模型实时生成，',
      '本地典藏经文时时伴随同行。',
    ],
    songBridge: ['运行 npm run pregenerate 即可为本章建立完整离线诗歌与导读。'],
  },
};

export function getUiStrings(lang: SupportedLang): UiStrings {
  if (lang === 'zh') return ZH_TW_STRINGS;
  if (lang === 'zh-CN') return ZH_CN_STRINGS;
  return EN_STRINGS;
}
