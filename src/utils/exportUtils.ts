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

export async function exportPassageElementToPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.92);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 28;
  const usableWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * usableWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(filename);
}
