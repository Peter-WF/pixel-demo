(() => {
  'use strict';

  const SOURCES = {
    alPixel: 'https://hybrid-analysis.com/sample/0abee1435c6d9db908a086ca29571d1356b066366b0791e63b1fbdcab2318a22/6a0c8c66de50250a3d099be5',
    alBs: 'https://res4.applovin.com/p/104/b/bs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js',
    alBsRuntime: 'https://hybrid-analysis.com/sample/d30debf3f0cfbd41ca04b2864f4a0ee0db4e04089dba01d1c1a1c97018350b99/6a4bb7d0eca8e271ab0085c0',
    alPrivacy: 'https://legal.applovin.com/privacy/',
    metaPrivacy: 'https://www.facebook.com/privacy/policies/uso/',
    metaNetwork: 'https://www.classaction.org/media/strong-et-al-v-lifestance-health-group-incorporated.pdf',
    gaDevice: 'https://support.google.com/analytics/answer/12002752?hl=en',
    gaParams: 'https://support.google.com/analytics/table/13594742?hl=en',
    gaSettings: 'https://support.google.com/analytics/answer/13438166?hl=en'
  };

  const AL_PIXEL = {
    'consistency.ua_platform': ['Direct evidence applies to userAgent; navigator.platform is not directly confirmed by this excerpt.', `{
  "page": {"navigator": {"userAgent": "<browser UA>"}}
}`],
    'consistency.mobile_touch': ['Direct evidence applies to userAgent; maxTouchPoints is not directly confirmed.', `{
  "page": {"navigator": {"userAgent": "<browser UA>"}}
}`],
    'consistency.chromium_runtime': ['Direct evidence applies to userAgent; window.chrome is not directly confirmed.', `{
  "page": {"navigator": {"userAgent": "<Chromium-like UA>"}}
}`],
    'consistency.viewport_screen': ['Screen and window dimensions were directly observed in AppLovin /v1/pixel traffic.', `{
  "page": {"window": {
    "innerWidth": <number>, "innerHeight": <number>,
    "outerWidth": <number>, "outerHeight": <number>,
    "screenWidth": <number>, "screenHeight": <number>,
    "pixelRatio": <number>, "scrollX": <number>, "scrollY": <number>
  }}
}`],
    'consistency.ua_webgl': ['Direct evidence applies to userAgent only; WebGL collection remains unconfirmed.', `{
  "page": {"navigator": {"userAgent": "<browser UA>"}}
}`],
    'environment.navigator': ['Directly observed fields include userAgent, language/languages and cookieEnabled.', `{
  "page": {"navigator": {
    "userAgent": "<browser UA>",
    "language": "<language>",
    "languages": ["..."],
    "cookieEnabled": true
  }}
}`],
    'environment.display': ['Directly observed fields include screen/window dimensions, DPR and scroll offsets.', `{
  "page": {"window": {
    "innerWidth": <number>, "innerHeight": <number>,
    "outerWidth": <number>, "outerHeight": <number>,
    "screenWidth": <number>, "screenHeight": <number>,
    "screenX": <number>, "screenY": <number>,
    "scrollX": <number>, "scrollY": <number>,
    "pixelRatio": <number>
  }}
}`],
    'environment.page_context': ['Document/top-window/iframe context was directly observed.', `{
  "page": {
    "document": {"location":"<url>","referrer":"<referrer>","title":"<title>"},
    "topWindow": {"origin":"<origin>","href":"<href>","pathname":"<path>"}
  },
  "inIframe": false
}`],
    'environment.performance': ['Pixel/page timing objects were directly observed.', `{
  "axon": {
    "pixelTimings": {"...":"..."},
    "pageTimings": {"...":"..."}
  }
}`]
  };

  const META_NETWORK = {
    'consistency.viewport_screen': ['Observed Meta Pixel request evidence covers screen width/height; viewport dimensions are not proven by this sample.', `GET https://www.facebook.com/tr/?
  id=<pixel-id>
  &ev=PageView
  &sw=<screen-width>
  &sh=<screen-height>
  ...`],
    'environment.display': ['Observed Meta Pixel request evidence includes sw/sh (screen width/height).', `GET https://www.facebook.com/tr/?
  ...
  &sw=<screen-width>
  &sh=<screen-height>
  ...`],
    'environment.page_context': ['Observed Meta Pixel request evidence includes page URL, referrer, iframe state and timestamp.', `GET https://www.facebook.com/tr/?
  id=<pixel-id>
  &ev=PageView
  &dl=<page-url>
  &rl=<referrer>
  &if=false
  &ts=<timestamp>
  &sw=<width>
  &sh=<height>
  ...`]
  };

  const GA_OFFICIAL = {
    'consistency.ua_platform': ['Google official Analytics documentation states that browser User-Agent, browser/device and OS information are collected. Exact navigator.platform use for this demo signal is not established.', `Officially documented device/browser information includes:
• Browser User-Agent
• browser/device information
• operating system information`],
    'consistency.viewport_screen': ['Google officially documents screen_resolution and derives it from window.screen. The viewport side of this demo signal is not established.', `screen_resolution
  Automatically collected / derived
  Example: 1920x1080
  Source: window.screen`],
    'consistency.ua_webgl': ['Google officially documents browser/device information; this does not establish WebGL renderer collection.', `Official: browser UA / device / OS data
Unknown here: WebGL renderer/vendor`],
    'environment.navigator': ['Google officially documents User-Agent/device information and language. Other navigator fields in this demo remain outside this proof.', `language        -> navigator.language
browser/device  -> automatically collected device information
User-Agent      -> documented device/browser data`],
    'environment.display': ['Google officially documents screen_resolution derived from window.screen.', `screen_resolution = <width>x<height>
source = window.screen`],
    'environment.locale': ['Google tag documentation includes language; the timezone/Intl fields shown by this demo are not established by this proof.', `language = navigator.language`],
    'environment.page_context': ['Google tag documentation explicitly documents page context parameters.', `page_location = document.location
page_referrer = document.referrer
page_title    = document.title`]
  };

  const TXT = {
    en: { title:'Collection evidence', boundary:'Evidence boundary', proof:'Evidence excerpt', open:'Open evidence source', close:'Close', noExact:'This is the strongest evidence currently stored for this row. It does not imply that every field shown by the demo is collected.' },
    zh: { title:'采集证据', boundary:'证据边界', proof:'证据片段', open:'打开证据来源', close:'关闭', noExact:'这里展示的是当前为这一行保存的最强证据；它不代表 Demo 里展示的所有字段都被对应 Pixel 采集。' }
  };

  const isZh = () => (document.documentElement.lang || '').toLowerCase().startsWith('zh');
  const tx = () => isZh() ? TXT.zh : TXT.en;
  const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

  const style = document.createElement('style');
  style.textContent = `
    .bi-evidence-badge:not([data-evidence-value="UNKNOWN"]){cursor:pointer!important}
    .bi-proof-backdrop{position:fixed;inset:0;z-index:1000000;background:rgba(17,24,39,.52);display:none;align-items:center;justify-content:center;padding:24px}
    .bi-proof-backdrop[data-open="1"]{display:flex}
    .bi-proof-modal{width:min(800px,100%);max-height:min(800px,90vh);overflow:auto;background:#fff;border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.32);border:1px solid #e5e7eb}
    .bi-proof-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid #e5e7eb}
    .bi-proof-title{font-size:16px;font-weight:800}.bi-proof-sub{font-size:11px;color:#6b7280;margin-top:4px}.bi-proof-close{border:0;background:#f3f4f6;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:18px}
    .bi-proof-body{padding:18px 20px}.bi-proof-label{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280;font-weight:800;margin:15px 0 6px}
    .bi-proof-boundary{padding:10px 12px;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;color:#92400e;font-size:11px;line-height:1.55}
    .bi-proof-code{margin:0;background:#111827;color:#e5e7eb;border-radius:10px;padding:14px;overflow:auto;font-size:11px;line-height:1.55;white-space:pre-wrap}
    .bi-proof-links{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.bi-proof-link{display:inline-flex;text-decoration:none;border:1px solid #d1d5db;border-radius:8px;padding:8px 10px;color:#111827;font-size:11px;font-weight:700;background:#fff}.bi-proof-note{font-size:11px;color:#6b7280;line-height:1.55;margin-top:10px}
  `;
  document.head.appendChild(style);

  const backdrop = document.createElement('div');
  backdrop.className = 'bi-proof-backdrop';
  backdrop.innerHTML = `<div class="bi-proof-modal" role="dialog" aria-modal="true">
    <div class="bi-proof-head"><div><div class="bi-proof-title" id="biProofTitle"></div><div class="bi-proof-sub" id="biProofSub"></div></div><button type="button" class="bi-proof-close" aria-label="Close">×</button></div>
    <div class="bi-proof-body" id="biProofBody"></div>
  </div>`;
  document.body.appendChild(backdrop);
  document.documentElement.dataset.evidenceProof = 'ready';

  function openModal(label, vendor, signalId, boundary, snippet, links) {
    const d = tx();
    document.getElementById('biProofTitle').textContent = `${d.title} · ${label}`;
    document.getElementById('biProofSub').textContent = `${vendor || ''}${vendor && signalId ? ' · ' : ''}${signalId || ''}`;
    document.getElementById('biProofBody').innerHTML = `
      <div class="bi-proof-label">${esc(d.boundary)}</div>
      <div class="bi-proof-boundary">${esc(boundary)}</div>
      <div class="bi-proof-label">${esc(d.proof)}</div>
      <pre class="bi-proof-code">${esc(snippet)}</pre>
      <div class="bi-proof-note">${esc(d.noExact)}</div>
      <div class="bi-proof-links">${links.map(([name,url]) => `<a class="bi-proof-link" target="_blank" rel="noopener" href="${esc(url)}">${esc(name)} ↗</a>`).join('')}</div>`;
    backdrop.dataset.open = '1';
  }

  function showEvidence(value, vendor, signalId, rowDetail) {
    const d = tx();
    if (value === 'AL-DIRECT-PIXEL') {
      const [boundary,snippet] = AL_PIXEL[signalId] || [rowDetail || 'Exact field evidence exists in observed AppLovin /v1/pixel traffic.', '{"AppLovin /v1/pixel":"direct field evidence"}'];
      return openModal(value, 'AppLovin', signalId, boundary, snippet, [[d.open,SOURCES.alPixel]]);
    }
    if (value === 'AL-DIRECT-BS') {
      return openModal(value, 'AppLovin', signalId,
        rowDetail || 'Relevant signal logic was directly observed in the analyzed AppLovin Browser Signal bundle; exact payload serialization and server-side use can still be unknown.',
        `Analyzed bundle:\nbs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js\n\nConfirmed:\n• relevant browser-signal code exists in bs.js\n• /v1/s is a separate opaque browser-signal endpoint\n\nNot automatically confirmed:\n• exact serialized field\n• hashing/encoding algorithm\n• server-side use / model weight`,
        [[d.open,SOURCES.alBs],[d.open,SOURCES.alBsRuntime]]);
    }
    if (value === 'AL-PUBLIC') {
      return openModal(value, 'AppLovin', signalId, rowDetail || 'Category-level public disclosure; not proof of the exact field.', 'AppLovin public privacy disclosure confirms this signal category.', [[d.open,SOURCES.alPrivacy]]);
    }
    if (value === 'META-DIRECT-NETWORK') {
      const [boundary,snippet] = META_NETWORK[signalId] || [rowDetail || 'A corresponding field was directly observed in a Meta Pixel tracking request.', 'GET https://www.facebook.com/tr/?...'];
      return openModal(value, 'Meta Pixel', signalId, boundary, snippet, [[d.open,SOURCES.metaNetwork]]);
    }
    if (value === 'META-PUBLIC') {
      return openModal(value, 'Meta Pixel', signalId, rowDetail || 'Meta public disclosure confirms this data category, but not necessarily the exact field.', 'Meta states that partners using Meta Business Tools such as Meta Pixel provide activity plus device/browser-related information.', [[d.open,SOURCES.metaPrivacy]]);
    }
    if (value === 'GA-OFFICIAL') {
      const [boundary,snippet] = GA_OFFICIAL[signalId] || [rowDetail || 'Google official Analytics / Google tag documentation explicitly documents this field or category.', 'See linked Google Analytics / Google tag documentation.'];
      return openModal(value, 'Google Analytics', signalId, boundary, snippet, [[d.open,SOURCES.gaDevice],[d.open,SOURCES.gaParams],[d.open,SOURCES.gaSettings]]);
    }
  }

  document.addEventListener('click', event => {
    const badge = event.target.closest?.('.bi-evidence-badge[data-evidence-value]');
    if (!badge) return;
    const value = badge.dataset.evidenceValue || '';
    if (!value || value === 'UNKNOWN') return;
    const vendor = badge.dataset.vendor || '';
    const signalId = badge.dataset.signalId || '';
    const detail = badge.dataset.evidenceDetail || window.AppLovinEvidence?.detail?.(vendor, signalId) || '';
    showEvidence(value, vendor, signalId, detail);
  });

  const close = () => { backdrop.dataset.open = '0'; };
  backdrop.querySelector('.bi-proof-close').addEventListener('click', close);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
})();
