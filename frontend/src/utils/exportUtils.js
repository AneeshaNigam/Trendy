/**
 * Export Utilities — JSON, Excel (.xlsx), PDF
 *
 * Supports both live-search trend objects (with metrics + sources arrays)
 * and stored trend objects from the DB.
 *
 * Every export always includes:
 *   Title · Score (1–10) · Category · Summary
 *   GitHub Stars · Reddit Upvotes · HN Points
 *   Source Links · Timestamp
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateOpportunityLayer } from './opportunityGenerator.js';
import { normalizeScore } from './normalizeScore.js';

// ─── Normalise ────────────────────────────────────────────────────────────────

function normaliseItem(item) {
  const score = normalizeScore(item.score);

  // Summary / description
  const summary = item.explanation || item.description || 'N/A';

  // Metrics (live-search trends have an explicit metrics object)
  const metrics = item.metrics || {};
  const githubStars    = metrics.githubStars    ?? extractMetric(item, 'GitHub');
  const hnPoints       = metrics.hackerNewsPoints ?? extractMetric(item, 'Hacker News');
  const redditUpvotes  = metrics.redditUpvotes   ?? extractMetric(item, 'Reddit');

  // Source platforms & links
  const sources = item.sources || buildFallbackSources(item);
  const sourceLinks = sources.map(s =>
    `[${s.platform}] ${s.title || s.url} — ${s.url}`
  ).join('\n');
  const platforms = [...new Set(sources.map(s => s.platform))].join(', ') || 'N/A';

  // Why it matters — from opportunityGenerator for stored trends
  let whyMatters = '';
  if (item.explanation && item.explanation.length > 30) {
    whyMatters = item.explanation;       // live-search already has real text
  } else {
    const opp = generateOpportunityLayer(item);
    whyMatters = opp.whyMatters || item.explanation || 'N/A';
  }

  const timestamp = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return {
    title: item.name || item.title || 'Unnamed Trend',
    category: item.category || 'Technology',
    score,
    status: getStatus(score),
    summary,
    whyMatters,
    githubStars,
    hnPoints,
    redditUpvotes,
    platforms,
    sourceLinks,
    sources,
    timestamp,
  };
}

/** Extract a platform metric from a flat sources/Post array */
function extractMetric(item, platform) {
  const posts = item.Posts || item.signals || [];
  const match = posts.find(p => p.source === platform);
  return match?.engagement || 0;
}

/** Build minimal source list from DB-style Posts/signals */
function buildFallbackSources(item) {
  const posts = item.Posts || item.signals || [];
  return posts.slice(0, 6).map(p => ({
    platform: p.source || 'Unknown',
    title: p.text || p.title || p.source || '',
    url: p.url || '#',
    metric: p.engagement || 0,
    metricLabel: 'signals',
  }));
}

// ─── JSON Export ──────────────────────────────────────────────────────────────

export function exportToJSON(data, filename = 'trendy-export') {
  if (!data?.length) return;

  const out = data.map(item => {
    const r = normaliseItem(item);
    return {
      title:              r.title,
      category:           r.category,
      score:              r.score,
      status:             r.status,
      summary:            r.summary,
      metrics: {
        github_stars:     r.githubStars,
        hackernews_points: r.hnPoints,
        reddit_upvotes:   r.redditUpvotes,
      },
      sources: r.sources.map(s => ({
        platform: s.platform,
        title:    s.title,
        url:      s.url,
        metric:   s.metric,
        unit:     s.metricLabel,
      })),
      timestamp: r.timestamp,
    };
  });

  const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
}

// ─── Excel Export ─────────────────────────────────────────────────────────────

export function exportToExcel(data, filename = 'trendy-export') {
  if (!data?.length) return;

  // Main trends sheet
  const rows = data.map(item => {
    const r = normaliseItem(item);
    return {
      'Title':           r.title,
      'Score (1–10)':    r.score,
      'Status':          r.status,
      'Category':        r.category,
      'Summary':         r.summary,
      'GitHub Stars':    r.githubStars,
      'HN Points':       r.hnPoints,
      'Reddit Upvotes':  r.redditUpvotes,
      'Source Platforms': r.platforms,
      'Date':            r.timestamp,
    };
  });

  const ws1 = XLSX.utils.json_to_sheet(rows);
  ws1['!cols'] = [
    { wch: 36 }, // Title
    { wch: 11 }, // Score
    { wch: 12 }, // Status
    { wch: 22 }, // Category
    { wch: 70 }, // Summary
    { wch: 14 }, // GH Stars
    { wch: 12 }, // HN Points
    { wch: 16 }, // Reddit Upvotes
    { wch: 30 }, // Platforms
    { wch: 14 }, // Date
  ];

  // Sources detail sheet
  const sourceRows = [];
  data.forEach(item => {
    const r = normaliseItem(item);
    r.sources.forEach(s => {
      sourceRows.push({
        'Trend':    r.title,
        'Platform': s.platform,
        'Title':    s.title,
        'URL':      s.url,
        'Metric':   s.metric,
        'Unit':     s.metricLabel,
      });
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, 'Trends');

  if (sourceRows.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(sourceRows);
    ws2['!cols'] = [{ wch: 36 }, { wch: 14 }, { wch: 60 }, { wch: 60 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Sources');
  }

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  downloadBlob(
    new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `${filename}.xlsx`
  );
}

// ─── PDF Export ───────────────────────────────────────────────────────────────

export function exportToPDF(data, filename = 'trendy-export', reportTitle = 'Trendy – Real-Time Trend Report') {
  if (!data?.length) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW  = doc.internal.pageSize.getWidth();
  const pageH  = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ── Dark header ────────────────────────────────────────────────────────────
  doc.setFillColor(18, 18, 22);
  doc.rect(0, 0, pageW, 30, 'F');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Trendy', margin, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 170);
  doc.text('AI-Powered Real-Time Trend Intelligence', margin, 19);

  doc.setFontSize(8);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    pageW - margin, 19, { align: 'right' }
  );

  // ── Report title ───────────────────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 25);
  doc.text(reportTitle, margin, 42);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 130);
  doc.text(`${data.length} trend${data.length !== 1 ? 's' : ''} included`, margin, 49);

  doc.setDrawColor(220, 220, 225);
  doc.line(margin, 53, pageW - margin, 53);

  // ── Summary table ──────────────────────────────────────────────────────────
  const tableRows = data.map(item => {
    const r = normaliseItem(item);
    const metrics = [
      r.githubStars > 0 ? `⭐ ${r.githubStars.toLocaleString()}` : '',
      r.hnPoints > 0    ? `HN ${r.hnPoints}` : '',
      r.redditUpvotes > 0 ? `↑ ${r.redditUpvotes.toLocaleString()}` : '',
    ].filter(Boolean).join('  ');

    return [
      r.title,
      r.score.toFixed(1),
      r.status,
      r.category,
      r.summary.length > 90 ? r.summary.slice(0, 88) + '…' : r.summary,
      metrics || '—',
    ];
  });

  autoTable(doc, {
    startY: 57,
    head: [['Title', 'Score', 'Status', 'Category', 'Summary', 'Signals']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [18, 18, 22],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: { fontSize: 7, cellPadding: 2.5, textColor: [30, 30, 40] },
    alternateRowStyles: { fillColor: [249, 249, 252] },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 13, halign: 'center' },
      2: { cellWidth: 17, halign: 'center' },
      3: { cellWidth: 22 },
      4: { cellWidth: 55 },
      5: { cellWidth: 28 },
    },
    margin: { left: margin, right: margin },
    didParseCell(h) {
      if (h.section === 'body' && h.column.index === 2) {
        const v = h.cell.raw || '';
        if (v.includes('Hot'))      h.cell.styles.textColor = [180, 60, 0];
        else if (v.includes('Rising'))  h.cell.styles.textColor = [160, 100, 0];
        else                            h.cell.styles.textColor = [30, 80, 180];
      }
    },
  });

  // ── Per-trend source sections ──────────────────────────────────────────────
  doc.addPage();
  let y = 20;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 25);
  doc.text('Source Details', margin, y);
  y += 8;

  for (const item of data) {
    const r = normaliseItem(item);
    if (r.sources.length === 0) continue;

    if (y > pageH - 40) { doc.addPage(); y = 20; }

    // Trend heading
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 40);
    doc.text(`${r.title}  [${r.score}]`, margin, y);
    y += 5;

    // Sources
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 100);

    for (const src of r.sources.slice(0, 5)) {
      if (y > pageH - 20) { doc.addPage(); y = 20; }
      const line = `  ${src.platform}: ${src.title?.slice(0, 65) || src.url}${src.metric ? ` (${src.metric.toLocaleString()} ${src.metricLabel})` : ''}`;
      doc.text(line, margin, y);
      y += 4.5;
    }

    y += 4;
  }

  // ── Page footers ───────────────────────────────────────────────────────────
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 180);
    doc.text(
      `Trendy Intelligence Report  •  Page ${i} of ${total}`,
      pageW / 2, pageH - 8, { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatus(score) {
  if (score >= 8) return 'Hot 🔥';
  if (score >= 5) return 'Rising 📈';
  return 'Emerging 🌱';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
