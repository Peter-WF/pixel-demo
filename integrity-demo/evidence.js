(() => {
  'use strict';

  const MAP = {
    'automation.navigator.webdriver': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'We have not directly confirmed AppLovin collects navigator.webdriver.' },
    'automation.framework_markers': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'Selenium/Chromedriver globals are our own automation heuristics.' },
    'consistency.ua_platform': { collection: ['AL-DIRECT-PIXEL','AL-PUBLIC'], logic: 'OUR-HEURISTIC', detail: 'UA is directly observed in AppLovin Pixel traffic; software/device environment is publicly disclosed. The cross-check rule is ours.' },
    'consistency.mobile_touch': { collection: ['AL-DIRECT-PIXEL','AL-PUBLIC'], logic: 'OUR-HEURISTIC', detail: 'The UA side is directly observed in Pixel traffic. Device/software characteristics are publicly disclosed, but exact maxTouchPoints collection is not directly confirmed. The mobile/touch consistency rule is ours.' },
    'consistency.chromium_runtime': { collection: ['AL-DIRECT-PIXEL','AL-PUBLIC'], logic: 'OUR-HEURISTIC', detail: 'The UA side is directly observed in Pixel traffic and browser/software environment is publicly disclosed. Exact window.chrome collection is not directly confirmed. The consistency rule is ours.' },
    'consistency.viewport_screen': { collection: ['AL-DIRECT-PIXEL'], logic: 'OUR-HEURISTIC', detail: 'Screen and window dimensions are directly observed in AppLovin Pixel payloads; the threshold/consistency rule is ours.' },
    'consistency.ua_webgl': { collection: ['AL-DIRECT-PIXEL','UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'UA is directly observed in Pixel traffic. Exact WebGL collection has not yet been directly confirmed from AppLovin bs.js or /v1/s.' },
    'tamper.native_api_surface': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'Native-function tamper checks are our implementation; no direct AppLovin detector evidence yet.' },
    'behavior.synthetic_events': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'event.isTrusted based behavior analysis is our implementation; no direct AppLovin evidence yet.' },
    'behavior.pointer_regularity': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'Pointer timing regularity is our behavioral heuristic.' },

    'environment.navigator': { collection: ['AL-DIRECT-PIXEL','AL-PUBLIC','UNKNOWN'], logic: 'N/A', detail: 'Mixed evidence row: userAgent, language/languages and cookieEnabled are directly observed in Pixel traffic; broader device/software characteristics are public categories; hardwareConcurrency, deviceMemory, maxTouchPoints and webdriver are not directly confirmed as current AppLovin fields.' },
    'environment.display': { collection: ['AL-DIRECT-PIXEL','AL-PUBLIC','UNKNOWN'], logic: 'N/A', detail: 'Mixed evidence row: screen width/height, window inner/outer dimensions, DPR and scroll offsets are directly observed in Pixel payloads; display/orientation is publicly disclosed; the demo media-query capability probes are not directly confirmed AppLovin fields.' },
    'environment.network': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'AppLovin publicly discloses collection of network connection information and IP-related data. Exact navigator.connection fields used by the current bs.js are not directly confirmed.' },
    'environment.locale': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'AppLovin publicly discloses locale and timezone-related information. Exact Intl-resolved fields used by the current bs.js are not directly confirmed.' },
    'environment.page_context': { collection: ['AL-DIRECT-PIXEL','UNKNOWN'], logic: 'N/A', detail: 'Mixed evidence row: document location/referrer/title, topWindow context and inIframe are directly observed in Pixel traffic; visibilityState, hasFocus, historyLength, secureContext and crossOriginIsolated are not directly confirmed AppLovin fields.' },
    'rendering.canvas': { collection: ['AL-DIRECT-BS','UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'Canvas-related logic is directly observed in the AppLovin Browser Signal bundle. However, our prior analysis did not directly confirm the exact readback path (for example toDataURL/getImageData/toBlob), whether Canvas output is serialized into /v1/s, or whether AppLovin uses our demo hash or a persistent Canvas identity.' },
    'rendering.webgl': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'This WebGL collector is our implementation. Exact AppLovin WebGL fields are not directly confirmed; prior analysis explicitly left WebGL collection unverified.' },
    'environment.storage': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'Storage/memory-related device information is publicly disclosed by AppLovin. Exact navigator.storage APIs/fields in the current bs.js are not directly confirmed.' },
    'environment.audio': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'Audio/video capability categories are publicly disclosed by AppLovin. Exact AudioContext/OfflineAudioContext collection in the current bs.js is not directly confirmed.' },
    'environment.performance': { collection: ['AL-DIRECT-PIXEL','UNKNOWN'], logic: 'N/A', detail: 'Mixed evidence row: Pixel payloads directly expose pixelTimings/pageTimings; the demo also exposes broader Navigation Timing and transfer-size fields that are not directly confirmed as AppLovin-collected fields.' }
  };

  const DEFAULT_RULE = { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'No direct AppLovin implementation evidence has been assigned to this detector yet.' };
  const DEFAULT_INFO = { collection: ['UNKNOWN'], logic: 'N/A', detail: 'No direct AppLovin collection evidence has been assigned to this informational signal yet.' };

  const DEFINITIONS = {
    en: {
      collectionTitle: 'Collection Evidence',
      collectionIntro: 'How strong is the evidence that AppLovin collects the underlying signal?',
      values: {
        'AL-DIRECT-PIXEL': 'Exact raw signal / field directly observed in AppLovin Pixel (/v1/pixel) traffic.',
        'AL-DIRECT-BS': 'Relevant signal logic directly observed in AppLovin bs.js. This is code-level evidence; exact readback, payload serialization and server-side use can still remain unconfirmed.',
        'AL-PUBLIC': 'Signal category publicly disclosed by AppLovin, but the exact field / current implementation is not directly confirmed.',
        'UNKNOWN': 'No sufficient evidence yet that AppLovin collects this exact signal or field.',
        'AL-DIRECT': 'Exact detector / rule directly confirmed in AppLovin implementation evidence.',
        'AL-INFERRED': 'This class of detector is strongly inferred, but its exact rule or threshold is not confirmed.',
        'OUR-HEURISTIC': 'Detector implemented by this demo. It is not claimed to be AppLovin’s exact logic.',
        'N/A': 'Informational / raw signal row; no detector rule is applied.'
      }
    },
    zh: {
      collectionTitle: '采集证据',
      collectionIntro: '表示我们对“AppLovin 是否采集了这个底层 Signal”掌握了多强的证据。一个 Row 里包含多个字段时，可能同时出现多个证据等级。',
      values: {
        'AL-DIRECT-PIXEL': '已在 AppLovin Pixel（/v1/pixel）的真实 Payload 中直接观察到这个 exact raw signal / field。',
        'AL-DIRECT-BS': '已在 AppLovin bs.js 中直接观察到与该 Signal 相关的代码逻辑。这属于代码级直接证据，但 exact readback、是否序列化进入 /v1/s、以及服务端如何使用仍可能未确认。',
        'AL-PUBLIC': 'AppLovin 官方文档或隐私披露确认会采集这一类 Signal，但 exact field / 当前实现没有被直接确认。',
        'UNKNOWN': '目前没有足够证据证明 AppLovin 会采集这个 exact signal / field。',
        'AL-DIRECT': '已经从 AppLovin 实现证据中直接确认这个 exact detector / rule。',
        'AL-INFERRED': '有较强证据推断 AppLovin 会做这一类检测，但具体规则或阈值没有被确认。',
        'OUR-HEURISTIC': '这是本 Demo 自己实现的检测规则，不代表 AppLovin 当前使用相同逻辑。',
        'N/A': '这一行只是原始 Signal / 环境信息展示，没有应用具体检测规则。'
      }
    }
  };

  function metaFor(signal) {
    return MAP[signal.id] || (signal.category === 'environment' ? DEFAULT_INFO : DEFAULT_RULE);
  }

  function annotate(report) {
    if (!report || !Array.isArray(report.signals)) return report;
    report.evidenceSchemaVersion = '2.4';
    report.appLovinEvidenceModel = {
      collectionEvidence: {
        'AL-DIRECT-PIXEL': DEFINITIONS.en.values['AL-DIRECT-PIXEL'],
        'AL-DIRECT-BS': DEFINITIONS.en.values['AL-DIRECT-BS'],
        'AL-PUBLIC': DEFINITIONS.en.values['AL-PUBLIC'],
        'UNKNOWN': DEFINITIONS.en.values.UNKNOWN
      },
      detectionLogic: {
        'AL-DIRECT': DEFINITIONS.en.values['AL-DIRECT'],
        'AL-INFERRED': DEFINITIONS.en.values['AL-INFERRED'],
        'OUR-HEURISTIC': DEFINITIONS.en.values['OUR-HEURISTIC'],
        'N/A': DEFINITIONS.en.values['N/A']
      }
    };
    for (const signal of report.signals) {
      const meta = metaFor(signal);
      signal.appLovinMapping = {
        ...(signal.appLovinMapping || {}),
        collectionEvidence: [...meta.collection],
        detectionLogic: meta.logic,
        evidenceDetail: meta.detail,
        level: meta.collection.join(' + ')
      };
    }
    return report;
  }

  function badgeClass(value) {
    switch (value) {
      case 'AL-DIRECT-PIXEL': return 'bi-ev-pixel';
      case 'AL-DIRECT-BS': return 'bi-ev-bs';
      case 'AL-PUBLIC': return 'bi-ev-public';
      case 'UNKNOWN': return 'bi-ev-unknown';
      case 'AL-DIRECT': return 'bi-logic-direct';
      case 'AL-INFERRED': return 'bi-logic-inferred';
      case 'OUR-HEURISTIC': return 'bi-logic-ours';
      case 'N/A': return 'bi-logic-na';
      default: return 'bi-ev-unknown';
    }
  }

  function badge(value, detail = '') {
    const encoded = String(detail || '').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    return `<span class="bi-evidence-badge ${badgeClass(value)}" data-evidence-value="${value}" data-evidence-detail="${encoded}">${value}</span>`;
  }

  function isZh() { return (document.documentElement.lang || '').toLowerCase().startsWith('zh'); }
  function langDef() { return isZh() ? DEFINITIONS.zh : DEFINITIONS.en; }

  function enhanceTable() {
    const table = document.querySelector('.tablewrap table');
    const report = window.__browserIntegrityLastReport;
    if (!table || !report || !Array.isArray(report.signals)) return;
    annotate(report);

    const head = table.querySelector('thead tr');
    if (head) {
      const labels = isZh()
        ? ['状态','检测项','分类','风险等级','权重','置信度','采集证据','检测逻辑']
        : ['Status','Detector','Category','Severity','Weight','Confidence','Collection Evidence','Detection Logic'];
      head.innerHTML = labels.map((x, i) => i === 6
        ? `<th class="bi-header-help" data-evidence-header="collection">${x}<span class="bi-help-dot">?</span></th>`
        : `<th>${x}</th>`).join('');
    }

    const byId = new Map(report.signals.map(s => [s.id, s]));
    table.querySelectorAll('tbody tr').forEach(row => {
      const id = row.querySelector('td:nth-child(2) div')?.textContent?.trim();
      const signal = byId.get(id);
      if (!signal) return;
      const meta = signal.appLovinMapping;
      while (row.children.length < 8) row.appendChild(document.createElement('td'));
      while (row.children.length > 8) row.removeChild(row.lastElementChild);
      row.children[6].innerHTML = meta.collectionEvidence.map(v => badge(v, meta.evidenceDetail)).join(' ');
      row.children[7].innerHTML = badge(meta.detectionLogic, meta.evidenceDetail);
    });

    const flagged = report.signals.filter(x => x.flagged).sort((a,b) => b.weight - a.weight);
    document.querySelectorAll('#suspicious .signal').forEach((node, i) => {
      const signal = flagged[i];
      if (!signal) return;
      const meta = signal.appLovinMapping;
      const tag = node.querySelector('.maptag');
      if (tag) tag.innerHTML = `${meta.collectionEvidence.map(v => badge(v, meta.evidenceDetail)).join(' ')} ${badge(meta.detectionLogic, meta.evidenceDetail)}`;
    });

    const json = document.getElementById('json');
    if (json) json.textContent = JSON.stringify(report, null, 2);
  }

  function scheduleEnhance() { requestAnimationFrame(() => requestAnimationFrame(enhanceTable)); }

  const style = document.createElement('style');
  style.textContent = `
    .bi-evidence-badge{display:inline-block;padding:3px 7px;border-radius:999px;font-size:9px;font-weight:800;white-space:nowrap;margin:1px 3px 1px 0;border:1px solid transparent;line-height:1.35;cursor:help}
    .bi-ev-pixel{background:#ecfdf5;color:#047857;border-color:#a7f3d0}
    .bi-ev-bs{background:#ecfeff;color:#0e7490;border-color:#a5f3fc}
    .bi-ev-public{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe}
    .bi-ev-unknown{background:#f3f4f6;color:#4b5563;border-color:#e5e7eb}
    .bi-logic-direct{background:#dcfce7;color:#166534;border-color:#86efac}
    .bi-logic-inferred{background:#fff7ed;color:#c2410c;border-color:#fed7aa}
    .bi-logic-ours{background:#f5f3ff;color:#6d28d9;border-color:#ddd6fe}
    .bi-logic-na{background:#f8fafc;color:#64748b;border-color:#e2e8f0}
    #rows td:nth-child(7),#rows td:nth-child(8){min-width:145px}
    .maptag .bi-evidence-badge{font-size:8px;padding:2px 5px;margin-top:3px}
    .bi-header-help{cursor:help;white-space:nowrap}
    .bi-help-dot{display:inline-grid;place-items:center;width:14px;height:14px;margin-left:5px;border-radius:50%;background:#eef2ff;color:#4f46e5;font-size:9px;font-weight:900;text-transform:none;vertical-align:middle}
    .bi-tooltip{position:fixed;z-index:99999;display:none;max-width:460px;padding:11px 12px;background:#111827;color:#f9fafb;border:1px solid #374151;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.22);font-size:11px;line-height:1.5;pointer-events:none}
    .bi-tooltip.show{display:block}.bi-tooltip-title{font-size:12px;font-weight:800;margin-bottom:5px}.bi-tooltip-intro{color:#d1d5db;margin-bottom:9px}.bi-tooltip-row{display:grid;grid-template-columns:max-content 1fr;gap:8px;align-items:start;margin-top:7px}.bi-tooltip-row .bi-evidence-badge{cursor:default;margin:0}.bi-tooltip-desc{color:#e5e7eb}.bi-tooltip-detail{margin-top:9px;padding-top:8px;border-top:1px solid #374151;color:#9ca3af}
  `;
  document.head.appendChild(style);

  const tooltip = document.createElement('div');
  tooltip.className = 'bi-tooltip';
  document.body.appendChild(tooltip);

  function positionTooltip(target) {
    const r = target.getBoundingClientRect(), pad = 10;
    const width = Math.min(460, window.innerWidth - pad * 2);
    tooltip.style.maxWidth = width + 'px';
    tooltip.style.left = Math.min(Math.max(pad, r.left), window.innerWidth - width - pad) + 'px';
    tooltip.style.top = (r.bottom + 8) + 'px';
    requestAnimationFrame(() => {
      const tr = tooltip.getBoundingClientRect();
      if (tr.bottom > window.innerHeight - pad) tooltip.style.top = Math.max(pad, r.top - tr.height - 8) + 'px';
    });
  }

  function showValueTooltip(target, value) {
    const d = langDef();
    const detail = target.dataset.evidenceDetail || '';
    tooltip.innerHTML = `<div class="bi-tooltip-row"><span class="bi-evidence-badge ${badgeClass(value)}">${value}</span><div class="bi-tooltip-desc">${d.values[value] || value}</div></div>${detail ? `<div class="bi-tooltip-detail">${detail}</div>` : ''}`;
    tooltip.classList.add('show'); positionTooltip(target);
  }

  function showCollectionTooltip(target) {
    const d = langDef();
    const values = ['AL-DIRECT-PIXEL','AL-DIRECT-BS','AL-PUBLIC','UNKNOWN'];
    tooltip.innerHTML = `<div class="bi-tooltip-title">${d.collectionTitle}</div><div class="bi-tooltip-intro">${d.collectionIntro}</div>${values.map(v => `<div class="bi-tooltip-row"><span class="bi-evidence-badge ${badgeClass(v)}">${v}</span><div class="bi-tooltip-desc">${d.values[v]}</div></div>`).join('')}`;
    tooltip.classList.add('show'); positionTooltip(target);
  }

  function hideTooltip() { tooltip.classList.remove('show'); }

  document.addEventListener('pointerover', event => {
    const badgeEl = event.target.closest?.('[data-evidence-value]');
    if (badgeEl) return showValueTooltip(badgeEl, badgeEl.dataset.evidenceValue);
    const headerEl = event.target.closest?.('[data-evidence-header="collection"]');
    if (headerEl) showCollectionTooltip(headerEl);
  });
  document.addEventListener('pointerout', event => {
    const from = event.target.closest?.('[data-evidence-value],[data-evidence-header="collection"]');
    if (!from) return;
    const to = event.relatedTarget?.closest?.('[data-evidence-value],[data-evidence-header="collection"]');
    if (to === from) return;
    hideTooltip();
  });
  window.addEventListener('scroll', hideTooltip, true);
  window.addEventListener('resize', hideTooltip);

  window.addEventListener('browser-integrity:report', event => { annotate(event.detail); scheduleEnhance(); }, { capture: true });
  if (window.__browserIntegrityLastReport) { annotate(window.__browserIntegrityLastReport); scheduleEnhance(); }
  document.addEventListener('click', event => {
    const id = event.target && event.target.id;
    if (id === 'biZh' || id === 'biEn') { hideTooltip(); scheduleEnhance(); }
  });

  window.AppLovinEvidence = Object.freeze({ annotate, enhanceTable: scheduleEnhance, metaFor });
})();
