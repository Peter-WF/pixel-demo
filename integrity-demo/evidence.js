(() => {
  'use strict';

  const MAP = {
    'automation.navigator.webdriver': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'We have not directly confirmed AppLovin collects navigator.webdriver.' },
    'automation.framework_markers': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'Selenium/Chromedriver globals are our own automation heuristics.' },
    'consistency.ua_platform': { collection: ['AL-DIRECT-PIXEL','AL-PUBLIC'], logic: 'OUR-HEURISTIC', detail: 'UA is directly observed in AppLovin Pixel traffic; software/device environment is publicly disclosed. The cross-check rule is ours.' },
    'consistency.mobile_touch': { collection: ['AL-PUBLIC'], logic: 'OUR-HEURISTIC', detail: 'Device/software characteristics are publicly disclosed; this mobile/touch consistency rule is ours.' },
    'consistency.chromium_runtime': { collection: ['AL-PUBLIC'], logic: 'OUR-HEURISTIC', detail: 'Browser/software environment is publicly disclosed; the Chromium runtime consistency rule is ours.' },
    'consistency.viewport_screen': { collection: ['AL-DIRECT-PIXEL'], logic: 'OUR-HEURISTIC', detail: 'Screen and window dimensions are directly observed in AppLovin Pixel payloads; the threshold/consistency rule is ours.' },
    'consistency.ua_webgl': { collection: ['AL-DIRECT-PIXEL','UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'UA is directly observed in Pixel traffic. Exact WebGL collection has not yet been directly confirmed from AppLovin bs.js or /v1/s.' },
    'tamper.native_api_surface': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'Native-function tamper checks are our implementation; no direct AppLovin detector evidence yet.' },
    'behavior.synthetic_events': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'event.isTrusted based behavior analysis is our implementation; no direct AppLovin evidence yet.' },
    'behavior.pointer_regularity': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'Pointer timing regularity is our behavioral heuristic.' },

    'environment.navigator': { collection: ['AL-DIRECT-PIXEL'], logic: 'N/A', detail: 'Directly observed Pixel fields include userAgent, language/languages and cookieEnabled. Other navigator fields shown by this demo may have weaker evidence.' },
    'environment.display': { collection: ['AL-DIRECT-PIXEL'], logic: 'N/A', detail: 'Directly observed Pixel fields include screen width/height, window inner/outer dimensions, devicePixelRatio and scroll offsets.' },
    'environment.network': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'AppLovin publicly discloses collection of network connection information and IP-related data.' },
    'environment.locale': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'AppLovin publicly discloses locale and timezone-related information.' },
    'environment.page_context': { collection: ['AL-DIRECT-PIXEL'], logic: 'N/A', detail: 'Directly observed Pixel fields include document location/referrer/title, topWindow context and inIframe.' },
    'rendering.canvas': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'This Canvas rendering hash is our implementation. We have not directly confirmed this exact collection in AppLovin.' },
    'rendering.webgl': { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'This WebGL collector is our implementation. Exact AppLovin WebGL fields are not yet directly confirmed.' },
    'environment.storage': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'Storage/memory-related device information is publicly disclosed by AppLovin.' },
    'environment.audio': { collection: ['AL-PUBLIC'], logic: 'N/A', detail: 'Audio/video capability categories are publicly disclosed by AppLovin.' },
    'environment.performance': { collection: ['AL-DIRECT-PIXEL'], logic: 'N/A', detail: 'Pixel payloads directly expose pixelTimings/pageTimings and related timing fields.' }
  };

  const DEFAULT_RULE = { collection: ['UNKNOWN'], logic: 'OUR-HEURISTIC', detail: 'No direct AppLovin implementation evidence has been assigned to this detector yet.' };
  const DEFAULT_INFO = { collection: ['UNKNOWN'], logic: 'N/A', detail: 'No direct AppLovin collection evidence has been assigned to this informational signal yet.' };

  function metaFor(signal) {
    return MAP[signal.id] || (signal.category === 'environment' ? DEFAULT_INFO : DEFAULT_RULE);
  }

  function annotate(report) {
    if (!report || !Array.isArray(report.signals)) return report;
    report.evidenceSchemaVersion = '2.1';
    report.appLovinEvidenceModel = {
      collectionEvidence: {
        'AL-DIRECT-PIXEL': 'Exact raw signal/field directly observed in AppLovin Pixel (/v1/pixel) traffic.',
        'AL-DIRECT-BS': 'Exact raw signal/field directly confirmed in AppLovin bs.js or re.applovin.com/v1/s.',
        'AL-PUBLIC': 'Signal category publicly disclosed by AppLovin, but exact implementation/field not directly confirmed.',
        'UNKNOWN': 'No sufficient AppLovin collection evidence yet.'
      },
      detectionLogic: {
        'AL-DIRECT': 'Exact detector/rule directly confirmed in AppLovin implementation.',
        'AL-INFERRED': 'Detector class strongly inferred from evidence, but exact rule/threshold is not confirmed.',
        'OUR-HEURISTIC': 'Detector/rule implemented by this demo, not claimed to be AppLovin logic.',
        'N/A': 'Informational/raw signal; no detector rule is applied.'
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

  function badge(value) {
    return `<span class="bi-evidence-badge ${badgeClass(value)}">${value}</span>`;
  }

  function isZh() {
    return (document.documentElement.lang || '').toLowerCase().startsWith('zh');
  }

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
      head.innerHTML = labels.map(x => `<th>${x}</th>`).join('');
    }

    const byId = new Map(report.signals.map(s => [s.id, s]));
    table.querySelectorAll('tbody tr').forEach(row => {
      const id = row.querySelector('td:nth-child(2) div')?.textContent?.trim();
      const signal = byId.get(id);
      if (!signal) return;
      const meta = signal.appLovinMapping;
      while (row.children.length < 8) row.appendChild(document.createElement('td'));
      while (row.children.length > 8) row.removeChild(row.lastElementChild);
      const collectionCell = row.children[6];
      const logicCell = row.children[7];
      collectionCell.innerHTML = meta.collectionEvidence.map(badge).join(' ');
      collectionCell.title = meta.evidenceDetail || '';
      logicCell.innerHTML = badge(meta.detectionLogic);
      logicCell.title = meta.evidenceDetail || '';
    });

    const flagged = report.signals.filter(x => x.flagged).sort((a,b) => b.weight - a.weight);
    document.querySelectorAll('#suspicious .signal').forEach((node, i) => {
      const signal = flagged[i];
      if (!signal) return;
      const meta = signal.appLovinMapping;
      const tag = node.querySelector('.maptag');
      if (tag) {
        tag.innerHTML = `${meta.collectionEvidence.map(badge).join(' ')} ${badge(meta.detectionLogic)}`;
        tag.title = meta.evidenceDetail || '';
      }
    });

    const json = document.getElementById('json');
    if (json) json.textContent = JSON.stringify(report, null, 2);
  }

  function scheduleEnhance() {
    requestAnimationFrame(() => requestAnimationFrame(enhanceTable));
  }

  const style = document.createElement('style');
  style.textContent = `
    .bi-evidence-badge{display:inline-block;padding:3px 7px;border-radius:999px;font-size:9px;font-weight:800;white-space:nowrap;margin:1px 3px 1px 0;border:1px solid transparent;line-height:1.35}
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
  `;
  document.head.appendChild(style);

  // Annotate synchronously when the collector emits its report. The page's render()
  // then receives the already-annotated object. Render badges once after that render.
  window.addEventListener('browser-integrity:report', event => {
    annotate(event.detail);
    scheduleEnhance();
  }, { capture: true });

  if (window.__browserIntegrityLastReport) {
    annotate(window.__browserIntegrityLastReport);
    scheduleEnhance();
  }

  // Language buttons are created later by i18n.js. Use delegated clicks so the table
  // header can be refreshed after language changes, without observing/mutating the DOM continuously.
  document.addEventListener('click', event => {
    const id = event.target && event.target.id;
    if (id === 'biZh' || id === 'biEn') scheduleEnhance();
  });

  // Expose a small explicit API for future UI updates. No MutationObserver is used.
  window.AppLovinEvidence = Object.freeze({ annotate, enhanceTable: scheduleEnhance, metaFor });
})();
