(() => {
  'use strict';

  const PIXEL_SOURCE = 'https://hybrid-analysis.com/sample/0abee1435c6d9db908a086ca29571d1356b066366b0791e63b1fbdcab2318a22/6a0c8c66de50250a3d099be5';
  const BS_SOURCE = 'https://res4.applovin.com/p/104/b/bs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js';
  const BS_RUNTIME = 'https://hybrid-analysis.com/sample/d30debf3f0cfbd41ca04b2864f4a0ee0db4e04089dba01d1c1a1c97018350b99/6a4bb7d0eca8e271ab0085c0';

  const pixelEvidence = {
    'consistency.ua_platform': {
      scope: 'Direct evidence applies to the UA side of this rule; navigator.platform is not directly confirmed by this payload excerpt.',
      snippet: `{
  "page": {
    "navigator": {
      "userAgent": "<browser user agent>",
      "language": "<language>",
      "languages": ["<language-1>", "<language-2>"],
      "cookieEnabled": true
    }
  }
}`
    },
    'consistency.mobile_touch': {
      scope: 'Direct evidence applies to the UA side only. maxTouchPoints is not directly confirmed as an AppLovin Pixel field.',
      snippet: `{
  "page": {
    "navigator": {
      "userAgent": "<mobile / desktop UA>",
      "language": "<language>",
      "languages": ["..."]
    }
  }
}`
    },
    'consistency.chromium_runtime': {
      scope: 'Direct evidence applies to userAgent. window.chrome is part of our heuristic and is not directly confirmed as an AppLovin-collected field.',
      snippet: `{
  "page": {
    "navigator": {
      "userAgent": "<Chromium-like UA>"
    }
  }
}`
    },
    'consistency.viewport_screen': {
      scope: 'Screen/window dimensions were directly observed in AppLovin Pixel traffic. The mismatch threshold in this demo is our own rule.',
      snippet: `{
  "page": {
    "window": {
      "innerWidth":  <number>,
      "innerHeight": <number>,
      "outerWidth":  <number>,
      "outerHeight": <number>,
      "screenWidth": <number>,
      "screenHeight": <number>,
      "pixelRatio":  <number>,
      "scrollX":     <number>,
      "scrollY":     <number>
    }
  }
}`
    },
    'consistency.ua_webgl': {
      scope: 'Direct evidence applies to userAgent only. WebGL collection remains unconfirmed.',
      snippet: `{
  "page": {
    "navigator": {
      "userAgent": "<browser user agent>"
    }
  }
}`
    },
    'environment.navigator': {
      scope: 'These navigator fields were directly observed in AppLovin Pixel traffic. Other navigator values shown by the demo have weaker evidence.',
      snippet: `{
  "page": {
    "navigator": {
      "cookieEnabled": true,
      "language": "<language>",
      "languages": ["<language-1>", "<language-2>"],
      "userAgent": "<browser user agent>"
    }
  }
}`
    },
    'environment.display': {
      scope: 'This is a sanitized structural excerpt reconstructed from observed AppLovin Pixel traffic; values are intentionally omitted.',
      snippet: `{
  "page": {
    "window": {
      "innerWidth": <number>,
      "innerHeight": <number>,
      "outerWidth": <number>,
      "outerHeight": <number>,
      "screenWidth": <number>,
      "screenHeight": <number>,
      "screenX": <number>,
      "screenY": <number>,
      "scrollX": <number>,
      "scrollY": <number>,
      "pixelRatio": <number>
    }
  }
}`
    },
    'environment.page_context': {
      scope: 'Document/top-window/iframe context was directly observed. Other page-state fields in the demo are not all direct.',
      snippet: `{
  "page": {
    "document": {
      "location": "<page URL>",
      "referrer": "<referrer>",
      "title": "<title>"
    },
    "topWindow": {
      "origin": "<origin>",
      "href": "<href>",
      "pathname": "<pathname>"
    }
  },
  "inIframe": false
}`
    },
    'environment.performance': {
      scope: 'Pixel/page timing objects were directly observed. The demo exposes additional Navigation Timing fields that are not all confirmed AppLovin fields.',
      snippet: `{
  "axon": {
    "pixelTimings": { "...": "..." },
    "pageTimings":  { "...": "..." }
  }
}`
    }
  };

  const bsEvidence = {
    'rendering.canvas': {
      title: 'Canvas-related Browser Signal evidence',
      scope: 'Our stored analysis confirms Canvas-related logic exists in the analyzed AppLovin Browser Signal bundle. It does NOT yet prove the exact readback API, serialized /v1/s field, hashing algorithm, or server-side use.',
      snippet: `Analyzed bundle
  bs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js

Confirmed in the stored analysis
  • Canvas-related logic exists in the Browser Signal bundle.
  • The bundle participates in the separate browser-signal plane.
  • re.applovin.com/v1/s is observed as a separate opaque/binary signal endpoint.

Still unverified / requires runtime hook
  • HTMLCanvasElement.prototype.toDataURL
  • HTMLCanvasElement.prototype.toBlob
  • CanvasRenderingContext2D.prototype.getImageData
  • exact Canvas value -> /v1/s serialization
  • exact server-side use / model weight`,
      exact: false
    }
  };

  const i18n = {
    en: {
      title: 'AppLovin Evidence', source: 'Evidence source', observed: 'Observed evidence', boundary: 'Evidence boundary',
      exactPayload: 'Observed payload structure', analysisRecord: 'Stored analysis record', close: 'Close',
      openEvidence: 'Open evidence source', openBundle: 'Open analyzed bundle', noExact: 'Exact source excerpt is not stored in this demo, so the panel shows the verified analysis record instead of fabricated source code.',
      directPixel: 'AL-DIRECT-PIXEL', directBs: 'AL-DIRECT-BS'
    },
    zh: {
      title: 'AppLovin 证据', source: '证据来源', observed: '已观察到的证据', boundary: '证据边界',
      exactPayload: '已观察 Payload 结构', analysisRecord: '已保存的分析记录', close: '关闭',
      openEvidence: '打开证据来源', openBundle: '打开分析过的 Bundle', noExact: '当前 Demo 没有保存对应的 exact 原始源码片段，因此这里展示已验证的分析记录，不会用伪代码冒充 AppLovin 原始代码。',
      directPixel: 'AL-DIRECT-PIXEL', directBs: 'AL-DIRECT-BS'
    }
  };

  function isZh() { return (document.documentElement.lang || '').toLowerCase().startsWith('zh'); }
  function text() { return isZh() ? i18n.zh : i18n.en; }
  function esc(s) { return String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }

  const style = document.createElement('style');
  style.textContent = `
    .bi-evidence-badge[data-evidence-value="AL-DIRECT-PIXEL"],.bi-evidence-badge[data-evidence-value="AL-DIRECT-BS"]{cursor:pointer;box-shadow:inset 0 -1px 0 rgba(0,0,0,.08)}
    .bi-proof-backdrop{position:fixed;inset:0;z-index:100000;background:rgba(17,24,39,.48);display:none;align-items:center;justify-content:center;padding:24px}
    .bi-proof-backdrop.show{display:flex}.bi-proof-modal{width:min(760px,100%);max-height:min(760px,90vh);overflow:auto;background:#fff;border-radius:16px;box-shadow:0 22px 60px rgba(0,0,0,.28);border:1px solid #e5e7eb}
    .bi-proof-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid #e5e7eb}.bi-proof-title{font-size:16px;font-weight:800}.bi-proof-sub{font-size:11px;color:#6b7280;margin-top:4px}.bi-proof-close{border:0;background:#f3f4f6;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:18px}
    .bi-proof-body{padding:18px 20px}.bi-proof-label{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280;font-weight:800;margin:15px 0 6px}.bi-proof-boundary{padding:10px 12px;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;color:#92400e;font-size:11px;line-height:1.55}
    .bi-proof-code{margin:0;background:#111827;color:#e5e7eb;border-radius:10px;padding:14px;overflow:auto;font-size:11px;line-height:1.55;white-space:pre-wrap}.bi-proof-links{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.bi-proof-link{display:inline-flex;text-decoration:none;border:1px solid #d1d5db;border-radius:8px;padding:8px 10px;color:#111827;font-size:11px;font-weight:700;background:#fff}.bi-proof-note{font-size:11px;color:#6b7280;line-height:1.55;margin-top:10px}
  `;
  document.head.appendChild(style);

  const backdrop = document.createElement('div');
  backdrop.className = 'bi-proof-backdrop';
  backdrop.innerHTML = '<div class="bi-proof-modal" role="dialog" aria-modal="true"><div class="bi-proof-head"><div><div class="bi-proof-title" id="biProofTitle"></div><div class="bi-proof-sub" id="biProofSub"></div></div><button class="bi-proof-close" aria-label="Close">×</button></div><div class="bi-proof-body" id="biProofBody"></div></div>';
  document.body.appendChild(backdrop);

  function currentSignalId(target) {
    const row = target.closest('tr');
    if (row) return row.querySelector('td:nth-child(2) div')?.textContent?.trim() || null;
    const card = target.closest('.signal');
    if (card) {
      const cards = [...document.querySelectorAll('#suspicious .signal')];
      const idx = cards.indexOf(card);
      const report = window.__browserIntegrityLastReport;
      const flagged = report?.signals?.filter(x => x.flagged).sort((a,b) => b.weight - a.weight) || [];
      return flagged[idx]?.id || null;
    }
    return null;
  }

  function showPixel(signalId) {
    const d = text();
    const ev = pixelEvidence[signalId] || {
      scope: 'This tag reflects an exact raw field observed in AppLovin /v1/pixel traffic. This demo does not yet have a row-specific excerpt for this signal.',
      snippet: '{\n  "AppLovin /v1/pixel": "direct field evidence exists"\n}'
    };
    document.getElementById('biProofTitle').textContent = `${d.title} · ${d.directPixel}`;
    document.getElementById('biProofSub').textContent = signalId || 'AppLovin Pixel';
    document.getElementById('biProofBody').innerHTML = `
      <div class="bi-proof-label">${esc(d.source)}</div>
      <div><strong>b.applovin.com/v1/pixel</strong></div>
      <div class="bi-proof-label">${esc(d.boundary)}</div>
      <div class="bi-proof-boundary">${esc(ev.scope)}</div>
      <div class="bi-proof-label">${esc(d.exactPayload)}</div>
      <pre class="bi-proof-code">${esc(ev.snippet)}</pre>
      <div class="bi-proof-links"><a class="bi-proof-link" target="_blank" rel="noopener" href="${PIXEL_SOURCE}">${esc(d.openEvidence)} ↗</a></div>`;
    backdrop.classList.add('show');
  }

  function showBs(signalId) {
    const d = text();
    const ev = bsEvidence[signalId] || {
      title: 'Browser Signal bundle evidence',
      scope: 'Relevant logic was observed in the analyzed bs.js bundle, but this demo does not have a row-specific exact source excerpt stored.',
      snippet: 'Analyzed bundle: bs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js',
      exact: false
    };
    document.getElementById('biProofTitle').textContent = `${d.title} · ${d.directBs}`;
    document.getElementById('biProofSub').textContent = signalId || ev.title;
    document.getElementById('biProofBody').innerHTML = `
      <div class="bi-proof-label">${esc(d.source)}</div>
      <div><strong>bs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js</strong></div>
      <div class="bi-proof-label">${esc(d.boundary)}</div>
      <div class="bi-proof-boundary">${esc(ev.scope)}</div>
      <div class="bi-proof-label">${esc(d.analysisRecord)}</div>
      <pre class="bi-proof-code">${esc(ev.snippet)}</pre>
      ${ev.exact ? '' : `<div class="bi-proof-note">${esc(d.noExact)}</div>`}
      <div class="bi-proof-links"><a class="bi-proof-link" target="_blank" rel="noopener" href="${BS_SOURCE}">${esc(d.openBundle)} ↗</a><a class="bi-proof-link" target="_blank" rel="noopener" href="${BS_RUNTIME}">${esc(d.openEvidence)} ↗</a></div>`;
    backdrop.classList.add('show');
  }

  document.addEventListener('click', event => {
    const badge = event.target.closest?.('[data-evidence-value]');
    if (!badge) return;
    const value = badge.dataset.evidenceValue;
    if (value !== 'AL-DIRECT-PIXEL' && value !== 'AL-DIRECT-BS') return;
    event.preventDefault();
    event.stopPropagation();
    const id = currentSignalId(badge);
    if (value === 'AL-DIRECT-PIXEL') showPixel(id); else showBs(id);
  }, true);

  backdrop.querySelector('.bi-proof-close').addEventListener('click', () => backdrop.classList.remove('show'));
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('show'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') backdrop.classList.remove('show'); });
})();
