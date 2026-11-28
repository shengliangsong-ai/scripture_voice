import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getUiStrings } from '../data/uiStrings';
import { ChapterScripture, DevotionalVariant, SongLyrics } from '../types/scripture';

export function buildPlainTextPassage(
  scripture: ChapterScripture,
  devotional: DevotionalVariant,
  lyrics?: SongLyrics
): string {
  const ui = getUiStrings(scripture.lang);
  const ref = `${scripture.bookName} ${scripture.chapter}`;
  const versesBlock = scripture.verses.map((v) => `${v.verse}. ${v.text}`).join('\n');

  const lines = [
    `${ref} (${scripture.translation})`,
    '='.repeat(ref.length + 12),
    '',
    versesBlock,
    '',
    `${ui.devotionalExportLabel}: ${devotional.title} (${devotional.estimatedMinutes} ${ui.minuteUnit})`,
    '',
    `${ui.historicalBackground}:`,
    devotional.historicalBackground,
    '',
    `${ui.theologicalContext}:`,
    devotional.theologicalContext,
    '',
    `${ui.practicalApplication}:`,
    devotional.practicalApplication,
    '',
    `${ui.reflectionPrayer}:`,
    devotional.reflectionPrayer,
  ];

  if (lyrics) {
    lines.push(
      '',
      `${ui.lyricsExportLabel}: ${lyrics.title}`,
      ...lyrics.verse1,
      '',
      `[${ui.chorusLabel}]`,
      ...lyrics.chorus,
      '',
      ...lyrics.verse2,
      '',
      `[${ui.bridgeLabel}]`,
      ...lyrics.bridge
    );
  }

  return lines.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function copyRichPassageToClipboard(
  scripture: ChapterScripture,
  devotional: DevotionalVariant,
  artworkUrl?: string
): Promise<boolean> {
  const ui = getUiStrings(scripture.lang);
  const ref = `${scripture.bookName} ${scripture.chapter}`;
  const plain = buildPlainTextPassage(scripture, devotional);

  const versesHtml = scripture.verses
    .map((v) => `<p><sup>${v.verse}</sup> ${escapeHtml(v.text)}</p>`)
    .join('');

  const imgHtml = artworkUrl
    ? `<p><img src="${escapeHtml(window.location.origin + artworkUrl)}" alt="${escapeHtml(ref)}" style="max-width:560px;border-radius:8px;" /></p>`
    : '';

  const html = `
    <div style="font-family: Georgia, serif; color: #4a362f; max-width: 680px;">
      <h2>${escapeHtml(ref)}</h2>
      <p style="color:#725548;font-size:13px;">${escapeHtml(scripture.translation)}</p>
      ${imgHtml}
      <blockquote>${versesHtml}</blockquote>
      <h3>${escapeHtml(devotional.title)}</h3>
      <p><strong>${escapeHtml(ui.historicalBackground)}:</strong> ${escapeHtml(devotional.historicalBackground)}</p>
      <p><strong>${escapeHtml(ui.theologicalContext)}:</strong> ${escapeHtml(devotional.theologicalContext)}</p>
      <p><strong>${escapeHtml(ui.practicalApplication)}:</strong> ${escapeHtml(devotional.practicalApplication)}</p>
      <p><em>${escapeHtml(devotional.reflectionPrayer)}</em></p>
    </div>
  `;

  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' }),
      });
      await navigator.clipboard.write([item]);
      return true;
    }
    await navigator.clipboard.writeText(plain);
    return true;
  } catch {
    return false;
  }
}

export interface StudySheetPdfOptions {
  scripture: ChapterScripture;
  devotional: DevotionalVariant;
  artworkUrl?: string;
  artworkCaption?: string;
  lyrics?: SongLyrics;
  filename: string;
}

async function resolveSafeRasterDataUrl(url?: string): Promise<string | null> {
  if (!url) return null;
  try {
    const absoluteUrl = new URL(url, window.location.origin).toString();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 3000);
    const res = await fetch(absoluteUrl, { signal: controller.signal }).finally(() =>
      window.clearTimeout(timer)
    );
    if (!res.ok) return null;

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Image decode failed'));
        el.src = objectUrl;
      });

      const targetWidth = 960;
      const targetHeight = 540; // Exact 16:9 match for webpage aspect-[16/9] object-cover

      const srcW = img.naturalWidth || targetWidth;
      const srcH = img.naturalHeight || targetHeight;
      const srcAspect = srcW / srcH;
      const dstAspect = targetWidth / targetHeight;

      let sx = 0;
      let sy = 0;
      let sw = srcW;
      let sh = srcH;
      if (srcAspect > dstAspect) {
        sw = srcH * dstAspect;
        sx = (srcW - sw) / 2;
      } else if (srcAspect < dstAspect) {
        sh = srcW / dstAspect;
        sy = (srcH - sh) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
      return canvas.toDataURL('image/jpeg', 0.9);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

function buildStudySheetBlocksHtml(
  options: StudySheetPdfOptions,
  safeArtworkDataUrl: string | null
): string[] {
  const { scripture, devotional, artworkCaption, lyrics } = options;
  const ui = getUiStrings(scripture.lang);
  const ref = `${scripture.bookName} ${scripture.chapter}`;
  const blocks: string[] = [];

  // 1. Clean editorial header
  blocks.push(`
    <div class="pdf-block pdf-header">
      <div class="pdf-kicker">${escapeHtml(ui.appName)} · ${escapeHtml(scripture.translation)}</div>
      <h1 class="pdf-title">${escapeHtml(ref)}</h1>
      <div class="pdf-meta">
        <span>${scripture.verses.length} ${escapeHtml(ui.versesUnit)}</span>
        <span>·</span>
        <span>${devotional.estimatedMinutes} ${escapeHtml(ui.reflectionUnit)}</span>
      </div>
    </div>
  `);

  // 2. Optional artwork plate
  if (safeArtworkDataUrl) {
    blocks.push(`
      <div class="pdf-block pdf-artwork">
        <img src="${safeArtworkDataUrl}" alt="${escapeHtml(ref)}" />
        ${artworkCaption ? `<div class="pdf-caption">${escapeHtml(artworkCaption)}</div>` : ''}
      </div>
    `);
  }

  // 3. Individual numbered verses (never split mid-verse across pages)
  for (const v of scripture.verses) {
    blocks.push(`
      <div class="pdf-block pdf-verse">
        <span class="pdf-verse-num">${v.verse}</span>
        <span class="pdf-verse-text">${escapeHtml(v.text)}</span>
      </div>
    `);
  }

  // 4. Devotional reflection header + subsections
  blocks.push(`
    <div class="pdf-block pdf-section-head">
      <div class="pdf-section-kicker">${escapeHtml(ui.devotionalKicker)}</div>
      <h2 class="pdf-section-title">${escapeHtml(devotional.title)}</h2>
    </div>
  `);

  const devotionalSections: Array<{ label: string; body: string; isPrayer?: boolean }> = [
    { label: ui.historicalBackground, body: devotional.historicalBackground },
    { label: ui.theologicalContext, body: devotional.theologicalContext },
    { label: ui.practicalApplication, body: devotional.practicalApplication },
    { label: ui.reflectionPrayer, body: devotional.reflectionPrayer, isPrayer: true },
  ];

  for (const sec of devotionalSections) {
    if (!sec.body?.trim()) continue;
    blocks.push(`
      <div class="pdf-block ${sec.isPrayer ? 'pdf-prayer-box' : 'pdf-dev-box'}">
        <div class="pdf-box-label">${escapeHtml(sec.label)}</div>
        <div class="pdf-box-body">${escapeHtml(sec.body)}</div>
      </div>
    `);
  }

  // 5. Optional worship lyrics section
  if (lyrics) {
    const stanzas: Array<{ label: string; lines: string[] }> = [
      { label: ui.verse1Label, lines: lyrics.verse1 },
      { label: ui.chorusLabel, lines: lyrics.chorus },
      { label: ui.verse2Label, lines: lyrics.verse2 },
      { label: ui.bridgeLabel, lines: lyrics.bridge },
    ].filter((s) => s.lines && s.lines.length > 0);

    blocks.push(`
      <div class="pdf-block pdf-section-head">
        <div class="pdf-section-kicker">${escapeHtml(ui.hymnKicker)}</div>
        <h2 class="pdf-section-title">${escapeHtml(lyrics.title)}</h2>
        ${lyrics.tempoNote ? `<div class="pdf-tempo">${escapeHtml(lyrics.tempoNote)}</div>` : ''}
      </div>
    `);

    for (const st of stanzas) {
      blocks.push(`
        <div class="pdf-block pdf-lyric-stanza">
          <div class="pdf-box-label">${escapeHtml(st.label)}</div>
          <div class="pdf-lyric-lines">${st.lines.map((line) => `<div>${escapeHtml(line)}</div>`).join('')}</div>
        </div>
      `);
    }
  }

  return blocks;
}

/**
 * Generates a reader-friendly multi-page A4 PDF inside an isolated offscreen iframe
 * using pure hex/rgb styling (completely avoiding Tailwind v4 oklch/color-mix rules
 * that cause html2canvas to fail) and packing verses cleanly between page boundaries.
 */
export async function exportStudySheetToPdf(options: StudySheetPdfOptions): Promise<void> {
  const safeArtworkDataUrl = await resolveSafeRasterDataUrl(options.artworkUrl);
  const blocksHtml = buildStudySheetBlocksHtml(options, safeArtworkDataUrl);

  const isCjk =
    options.scripture.lang === 'zh' ||
    options.scripture.lang === 'zh-CN' ||
    options.scripture.lang === 'ja' ||
    options.scripture.lang === 'ko';

  const bodyFont = isCjk
    ? '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "Heiti SC", sans-serif'
    : '"Georgia", "Merriweather", "Times New Roman", serif';

  const sansFont = isCjk
    ? '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
    : '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif';

  const pageWidthPx = 760;
  const pageMinHeightPx = 1074;
  const maxContentHeightPx = 950;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = `${pageWidthPx + 40}px`;
  iframe.style.height = '1400px';
  iframe.style.pointerEvents = 'none';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    if (!doc) {
      throw new Error('Unable to initialize PDF print frame');
    }

    doc.open();
    doc.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #3a2a24;
        font-family: ${bodyFont};
        -webkit-font-smoothing: antialiased;
      }
      .pdf-measure {
        width: ${pageWidthPx - 96}px;
        padding: 0;
      }
      .pdf-page {
        width: ${pageWidthPx}px;
        min-height: ${pageMinHeightPx}px;
        padding: 40px 48px 30px 48px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .pdf-page-body {
        width: 100%;
      }
      .pdf-block {
        margin: 0;
      }
      .pdf-header {
        padding-bottom: 14px;
        margin-bottom: 18px;
        border-bottom: 2px solid #eaddd7;
      }
      .pdf-kicker {
        font-family: ${sansFont};
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: #725548;
        margin-bottom: 6px;
      }
      .pdf-title {
        margin: 0;
        font-size: 28px;
        line-height: 1.25;
        font-weight: 700;
        color: #3a2a24;
      }
      .pdf-meta {
        margin-top: 6px;
        font-family: ${sansFont};
        font-size: 11.5px;
        color: #8c6a5c;
        display: flex;
        gap: 8px;
      }
      .pdf-artwork {
        margin-bottom: 20px;
        border: 1px solid #eaddd7;
        border-radius: 8px;
        overflow: hidden;
        background: #fdf8f6;
      }
      .pdf-artwork img {
        display: block;
        width: 100%;
        height: auto;
      }
      .pdf-caption {
        padding: 7px 12px;
        font-family: ${sansFont};
        font-size: 10.5px;
        color: #725548;
        border-top: 1px solid #eaddd7;
        background: #fdf8f6;
      }
      .pdf-verse {
        display: flex;
        align-items: baseline;
        gap: 12px;
        margin-bottom: 10px;
        font-size: ${isCjk ? '15px' : '14.5px'};
        line-height: ${isCjk ? '1.88' : '1.78'};
        color: #2f221d;
      }
      .pdf-verse-num {
        font-family: ${sansFont};
        width: 26px;
        flex-shrink: 0;
        text-align: right;
        font-size: 11.5px;
        font-weight: 700;
        color: #8c6252;
      }
      .pdf-verse-text {
        flex: 1;
      }
      .pdf-section-head {
        margin-top: 18px;
        margin-bottom: 12px;
        padding-top: 14px;
        border-top: 1px solid #eaddd7;
      }
      .pdf-section-kicker {
        font-family: ${sansFont};
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #8c6252;
        margin-bottom: 4px;
      }
      .pdf-section-title {
        margin: 0;
        font-size: 18px;
        line-height: 1.35;
        font-weight: 700;
        color: #3a2a24;
      }
      .pdf-tempo {
        margin-top: 3px;
        font-family: ${sansFont};
        font-size: 11px;
        color: #8c6a5c;
      }
      .pdf-dev-box,
      .pdf-prayer-box {
        padding: 11px 14px;
        margin-bottom: 10px;
        border-radius: 6px;
        border: 1px solid #eaddd7;
        background: #fdf8f6;
      }
      .pdf-prayer-box {
        border-left: 3px solid #725548;
        background: #f9f1ee;
      }
      .pdf-box-label {
        font-family: ${sansFont};
        font-size: 11px;
        font-weight: 700;
        color: #725548;
        margin-bottom: 4px;
      }
      .pdf-box-body {
        font-size: 13px;
        line-height: ${isCjk ? '1.8' : '1.68'};
        color: #3a2a24;
      }
      .pdf-lyric-stanza {
        margin-bottom: 10px;
        padding: 9px 12px;
        border-left: 2px solid #d2bab0;
        background: #faf7f5;
      }
      .pdf-lyric-lines {
        font-size: 13px;
        line-height: 1.72;
        color: #3a2a24;
      }
      .pdf-footer {
        margin-top: 18px;
        padding-top: 10px;
        border-top: 1px solid #ece3de;
        font-family: ${sansFont};
        font-size: 10px;
        color: #8c6a5c;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <div id="pdf-measure" class="pdf-measure">${blocksHtml.join('')}</div>
    <div id="pdf-pages"></div>
  </body>
</html>`);
    doc.close();

    // Allow layout + any embedded data-URL image to settle
    await new Promise<void>((resolve) => window.setTimeout(resolve, 60));

    const measureEl = doc.getElementById('pdf-measure');
    const pagesHost = doc.getElementById('pdf-pages');
    if (!measureEl || !pagesHost) {
      throw new Error('PDF container initialization failed');
    }

    const blockEls = Array.from(measureEl.children) as HTMLElement[];
    const pages: HTMLElement[][] = [];
    let currentPage: HTMLElement[] = [];
    let currentHeight = 0;

    for (const block of blockEls) {
      const style = iframe.contentWindow?.getComputedStyle(block);
      const marginTop = style ? Number.parseFloat(style.marginTop) || 0 : 0;
      const marginBottom = style ? Number.parseFloat(style.marginBottom) || 0 : 0;
      const blockHeight = block.offsetHeight + marginTop + marginBottom;

      if (currentPage.length > 0 && currentHeight + blockHeight > maxContentHeightPx) {
        pages.push(currentPage);
        currentPage = [block];
        currentHeight = blockHeight;
      } else {
        currentPage.push(block);
        currentHeight += blockHeight;
      }
    }
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    measureEl.remove();

    const ref = `${options.scripture.bookName} ${options.scripture.chapter}`;
    const totalPages = pages.length;
    const pageElements: HTMLElement[] = [];

    for (let idx = 0; idx < pages.length; idx++) {
      const pageEl = doc.createElement('div');
      pageEl.className = 'pdf-page';

      const bodyEl = doc.createElement('div');
      bodyEl.className = 'pdf-page-body';
      for (const block of pages[idx]) {
        bodyEl.appendChild(block);
      }

      const footerEl = doc.createElement('div');
      footerEl.className = 'pdf-footer';
      footerEl.innerHTML = `<span>${escapeHtml(ref)} · ${escapeHtml(options.scripture.translation)}</span><span>${idx + 1} / ${totalPages}</span>`;

      pageEl.appendChild(bodyEl);
      pageEl.appendChild(footerEl);
      pagesHost.appendChild(pageEl);
      pageElements.push(pageEl);
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const a4Width = pdf.internal.pageSize.getWidth();
    const a4Height = pdf.internal.pageSize.getHeight();
    const marginX = 20;
    const marginY = 18;
    const usableWidth = a4Width - marginX * 2;
    const usableHeight = a4Height - marginY * 2;

    let addedFirstPage = false;

    for (const pageEl of pageElements) {
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.94);
      const renderedHeight = (canvas.height * usableWidth) / canvas.width;

      if (renderedHeight <= usableHeight + 4) {
        if (addedFirstPage) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', marginX, marginY, usableWidth, renderedHeight);
        addedFirstPage = true;
      } else {
        // Fallback slice only if a single oversized block exceeded one page
        let remaining = renderedHeight;
        let offsetY = marginY;
        while (remaining > 0) {
          if (addedFirstPage) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', marginX, offsetY, usableWidth, renderedHeight);
          addedFirstPage = true;
          remaining -= usableHeight;
          offsetY -= usableHeight;
        }
      }
    }

    pdf.save(options.filename);
  } finally {
    iframe.remove();
  }
}
