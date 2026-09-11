(() => {
  'use strict';

  const AL = {
    'automation.navigator.webdriver': ['UNKNOWN'],
    'automation.framework_markers': ['UNKNOWN'],
    'consistency.ua_platform': ['AL-DIRECT-PIXEL','AL-PUBLIC'],
    'consistency.mobile_touch': ['AL-DIRECT-PIXEL','AL-PUBLIC'],
    'consistency.chromium_runtime': ['AL-DIRECT-PIXEL','AL-PUBLIC'],
    'consistency.viewport_screen': ['AL-DIRECT-PIXEL'],
    'consistency.ua_webgl': ['AL-DIRECT-PIXEL','UNKNOWN'],
    'tamper.native_api_surface': ['UNKNOWN'],
    'behavior.synthetic_events': ['UNKNOWN'],
    'behavior.pointer_regularity': ['UNKNOWN'],
    'environment.navigator': ['AL-DIRECT-PIXEL','AL-PUBLIC','UNKNOWN'],
    'environment.display': ['AL-DIRECT-PIXEL','AL-PUBLIC','UNKNOWN'],
    'environment.network': ['AL-PUBLIC'],
    'environment.locale': ['AL-PUBLIC'],
    'environment.page_context': ['AL-DIRECT-PIXEL','UNKNOWN'],
    'rendering.canvas': ['AL-DIRECT-BS','UNKNOWN'],
    'rendering.webgl': ['UNKNOWN'],
    'environment.storage': ['AL-PUBLIC'],
    'environment.audio': ['AL-PUBLIC'],
    'environment.performance': ['AL-DIRECT-PIXEL','UNKNOWN']
  };

  const META = {
    'automation.navigator.webdriver': ['META-DIRECT-SCRIPT','UNKNOWN'],
    'automation.framework_markers': ['META-DIRECT-SCRIPT'],
    'consistency.ua_platform': ['META-DIRECT-SCRIPT','UNKNOWN'],
    'consistency.mobile_touch': ['UNKNOWN'],
    'consistency.chromium_runtime': ['UNKNOWN'],
    'consistency.viewport_screen': ['META-DIRECT-SCRIPT','UNKNOWN'],
    'consistency.ua_webgl': ['META-DIRECT-SCRIPT','UNKNOWN'],
    'tamper.native_api_surface': ['UNKNOWN'],
    'behavior.synthetic_events': ['UNKNOWN'],
    'behavior.pointer_regularity': ['UNKNOWN'],
    'environment.navigator': ['META-DIRECT-SCRIPT','UNKNOWN'],
    'environment.display': ['META-DIRECT-SCRIPT','UNKNOWN'],
    'environment.network': ['UNKNOWN'],
    'environment.locale': ['UNKNOWN'],
    'environment.page_context': ['META-DIRECT-SCRIPT'],
    'rendering.canvas': ['UNKNOWN'],
    'rendering.webgl': ['UNKNOWN'],
    'environment.storage': ['UNKNOWN'],
    'environment.audio': ['UNKNOWN'],
    'environment.performance': ['UNKNOWN']
  };

  const GA = {
    'automation.navigator.webdriver': ['UNKNOWN'],
    'automation.framework_markers': ['UNKNOWN'],
    'consistency.ua_platform': ['GA-OFFICIAL','UNKNOWN'],
    'consistency.mobile_touch': ['UNKNOWN'],
    'consistency.chromium_runtime': ['UNKNOWN'],
    'consistency.viewport_screen': ['GA-OFFICIAL','UNKNOWN'],
    'consistency.ua_webgl': ['GA-OFFICIAL','UNKNOWN'],
    'tamper.native_api_surface': ['UNKNOWN'],
    'behavior.synthetic_events': ['UNKNOWN'],
    'behavior.pointer_regularity': ['UNKNOWN'],
    'environment.navigator': ['GA-OFFICIAL','UNKNOWN'],
    'environment.display': ['GA-OFFICIAL','UNKNOWN'],
    'environment.network': ['UNKNOWN'],
    'environment.locale': ['GA-OFFICIAL','UNKNOWN'],
    'environment.page_context': ['GA-OFFICIAL'],
    'rendering.canvas': ['UNKNOWN'],
    'rendering.webgl': ['UNKNOWN'],
    'environment.storage': ['UNKNOWN'],
    'environment.audio': ['UNKNOWN'],
    'environment.performance': ['GA-OFFICIAL','UNKNOWN']
  };

  const DETAILS = {
    al: {
      'automation.navigator.webdriver': 'We have not directly confirmed AppLovin collects navigator.webdriver.',
      'automation.framework_markers': 'Selenium/Chromedriver globals are our own automation heuristics; no direct AppLovin evidence yet.',
      'consistency.ua_platform': 'UA is directly observed in AppLovin Pixel traffic; broader software/device environment is publicly disclosed. navigator.platform itself is not directly confirmed.',
      'consistency.mobile_touch': 'The UA side is directly observed in Pixel traffic; device/software characteristics are public categories. Exact maxTouchPoints collection is not directly confirmed.',
      'consistency.chromium_runtime': 'The UA side is directly observed in Pixel traffic and browser/software environment is publicly disclosed. Exact window.chrome collection is not directly confirmed.',
      'consistency.viewport_screen': 'Screen and window dimensions are directly observed in AppLovin Pixel payloads.',
      'consistency.ua_webgl': 'UA is directly observed in Pixel traffic. Exact WebGL collection remains unconfirmed.',
      'environment.navigator': 'Mixed row: userAgent, language/languages and cookieEnabled are directly observed; broader software/device categories are public; several demo navigator fields remain unconfirmed.',
      'environment.display': 'Mixed row: screen/window dimensions, DPR and scroll offsets are directly observed; broader display/orientation is public; media-query probes remain unconfirmed.',
      'environment.network': 'AppLovin publicly discloses network connection information and IP-related data. Exact navigator.connection fields are not directly confirmed.',
      'environment.locale': 'AppLovin publicly discloses locale/timezone categories. Exact Intl fields in the current bs.js are not directly confirmed.',
      'environment.page_context': 'Document location/referrer/title, topWindow context and inIframe are directly observed. Focus/visibility/history-style fields are not all direct.',
      'rendering.canvas': 'Canvas-related logic is directly observed in the Browser Signal bundle; exact readback, /v1/s serialization and server-side use remain unconfirmed.',
      'rendering.webgl': 'Exact AppLovin WebGL fields are not directly confirmed.',
      'environment.storage': 'Storage/memory-related device information is publicly disclosed; exact navigator.storage probes are not directly confirmed.',
      'environment.audio': 'Audio/video capability categories are publicly disclosed; exact AudioContext collection is not directly confirmed.',
      'environment.performance': 'Pixel payloads directly expose pixelTimings/pageTimings; the broader Navigation Timing fields shown by this demo are not all direct.'
    },
    meta: {
      'automation.navigator.webdriver': 'A captured fbevents.js snapshot directly checks Selenium/WebDriver-related document attributes and globals, but does not prove use of navigator.webdriver itself.',
      'automation.framework_markers': 'Direct script evidence: fbevents.js checks Selenium/WebDriver/driver document attributes, Selenium-style globals, Phantom/Nightmare markers and HeadlessChrome UA.',
      'consistency.ua_platform': 'fbevents.js directly reads navigator.userAgent for headless checks. Exact navigator.platform collection was not found in the analyzed snapshot.',
      'consistency.viewport_screen': 'fbevents.js directly appends screen.width and screen.height to the Pixel event request. The demo viewport dimensions are not directly confirmed.',
      'consistency.ua_webgl': 'fbevents.js directly reads userAgent, but WebGL collection was not found in the analyzed snapshot.',
      'environment.navigator': 'Direct script evidence includes navigator.userAgent and navigator.sendBeacon capability checks. Most other navigator fields in this demo remain unconfirmed for Meta Pixel.',
      'environment.display': 'Direct script evidence includes screen.width and screen.height in the outgoing Pixel event. Window inner/outer sizes, DPR and media-query probes are not confirmed here.',
      'environment.page_context': 'Direct script evidence: outgoing Pixel event parameters include page URL, referrer, iframe state and timestamp.',
      'rendering.canvas': 'No Canvas collection was found in the analyzed fbevents.js snapshot.',
      'rendering.webgl': 'No WebGL collection was found in the analyzed fbevents.js snapshot.',
      'environment.audio': 'No AudioContext collection was found in the analyzed fbevents.js snapshot.'
    },
    ga: {
      'consistency.ua_platform': 'Google officially documents collection of browser/device information; exact navigator.platform use by this gtag.js deployment is not established here.',
      'consistency.viewport_screen': 'Google officially documents screen_resolution calculated from window.screen. This demo also uses viewport dimensions, whose exact mapping is not fully established here.',
      'consistency.ua_webgl': 'Google officially documents browser/device information, but WebGL renderer collection is not established here.',
      'environment.navigator': 'Google officially documents language plus browser/device information. The exact hardwareConcurrency/deviceMemory/maxTouchPoints/webdriver fields in this demo are not established.',
      'environment.display': 'Google officially documents screen_resolution calculated from window.screen. The broader display fields in this demo are not all documented as GA defaults.',
      'environment.locale': 'Google officially documents language as a default web-stream parameter. Exact timezone/Intl-resolved fields are not established here.',
      'environment.page_context': 'Google officially documents page_location, page_referrer and page_title as default web-stream parameters.',
      'environment.performance': 'Google officially documents engagement_time_msec and related engagement/session timing, but the full Navigation Timing fields shown by this demo are not established as GA defaults.'
    }
  };

  const DEFINITIONS = {
    en: {
      headers: ['Status','Detector','Category','Severity','Weight','Confidence','AppLovin Evidence','Meta Pixel Evidence','GA Evidence'],
      titles: { al:'AppLovin Evidence', meta:'Meta Pixel Evidence', ga:'Google Analytics Evidence' },
      intros: {
        al:'Evidence that AppLovin collects the underlying browser signal.',
        meta:'Evidence from a captured fbevents.js snapshot / Meta Pixel event construction.',
        ga:'Evidence from official Google Analytics / Google tag documentation.'
      },
      values: {
        'AL-DIRECT-PIXEL':'Exact raw signal / field directly observed in AppLovin /v1/pixel traffic.',
        'AL-DIRECT-BS':'Relevant signal logic directly observed in AppLovin bs.js; exact serialization/use may still be unknown.',
        'AL-PUBLIC':'Signal category publicly disclosed by AppLovin, but exact current field/implementation is not directly confirmed.',
        'META-DIRECT-SCRIPT':'Exact or closely corresponding collection/check code directly observed in a captured Meta fbevents.js snapshot.',
        'GA-OFFICIAL':'Google official documentation explicitly states this signal/parameter/category is collected or derived by the Google tag / GA.',
        'UNKNOWN':'No sufficient evidence yet for this exact signal/field.'
      }
    },
    zh: {
      headers: ['状态','检测项','分类','风险等级','权重','置信度','AppLovin 证据','Meta Pixel 证据','GA 证据'],
      titles: { al:'AppLovin 采集证据', meta:'Meta Pixel 采集证据', ga:'Google Analytics 采集证据' },
      intros: {
        al:'表示我们对 AppLovin 是否采集这个底层浏览器 Signal 掌握了多强的证据。',
        meta:'基于捕获到的 fbevents.js 代码快照以及 Meta Pixel event 构造逻辑。',
        ga:'基于 Google Analytics / Google tag 官方文档明确披露的默认采集字段。'
      },
      values: {
        'AL-DIRECT-PIXEL':'已在 AppLovin /v1/pixel 的真实 Payload 中直接观察到 exact raw signal / field。',
        'AL-DIRECT-BS':'已在 AppLovin bs.js 中直接观察到相关 Signal 代码；exact 序列化和服务端用途仍可能未确认。',
        'AL-PUBLIC':'AppLovin 官方公开确认会采集这一类 Signal，但 exact field / 当前实现没有被直接确认。',
        'META-DIRECT-SCRIPT':'已在捕获的 Meta fbevents.js 代码快照中直接观察到 exact 或高度对应的采集 / 环境检查代码。',
        'GA-OFFICIAL':'Google 官方文档明确说明 Google tag / GA 会默认采集或从浏览器派生该 Signal / 参数。',
        'UNKNOWN':'目前没有足够证据证明该 Pixel 会采集这个 exact signal / field。'
      }
    }
  };

  function isZh(){ return (document.documentElement.lang||'').toLowerCase().startsWith('zh'); }
  function d(){ return isZh()?DEFINITIONS.zh:DEFINITIONS.en; }
  function levels(vendor,id){ const map=vendor==='al'?AL:vendor==='meta'?META:GA; return map[id]||['UNKNOWN']; }
  function detail(vendor,id){ return DETAILS[vendor]?.[id] || 'No row-specific evidence note has been assigned yet.'; }

  function badgeClass(value){
    switch(value){
      case 'AL-DIRECT-PIXEL': return 'bi-ev-pixel';
      case 'AL-DIRECT-BS': return 'bi-ev-bs';
      case 'AL-PUBLIC': return 'bi-ev-public';
      case 'META-DIRECT-SCRIPT': return 'bi-meta-direct';
      case 'GA-OFFICIAL': return 'bi-ga-official';
      default: return 'bi-ev-unknown';
    }
  }
  function escAttr(s){ return String(s||'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  function badge(vendor,value,detailText){ return `<span class="bi-evidence-badge ${badgeClass(value)}" data-vendor="${vendor}" data-evidence-value="${value}" data-evidence-detail="${escAttr(detailText)}">${value}</span>`; }

  function annotate(report){
    if(!report||!Array.isArray(report.signals)) return report;
    report.evidenceSchemaVersion='3.0';
    for(const s of report.signals){
      s.vendorCollectionEvidence={
        appLovin:levels('al',s.id), meta:levels('meta',s.id), ga:levels('ga',s.id)
      };
    }
    return report;
  }

  function renderHeader(table){
    const head=table?.querySelector('thead tr'); if(!head) return;
    head.innerHTML=d().headers.map((x,i)=> i>=6 ? `<th class="bi-header-help" data-vendor-header="${i===6?'al':i===7?'meta':'ga'}">${x}<span class="bi-help-dot">?</span></th>` : `<th>${x}</th>`).join('');
  }

  function enhanceTable(){
    const table=document.querySelector('.tablewrap table'); if(!table) return;
    renderHeader(table);
    const report=window.__browserIntegrityLastReport; if(!report||!Array.isArray(report.signals)) return;
    annotate(report);
    const byId=new Map(report.signals.map(s=>[s.id,s]));
    table.querySelectorAll('tbody tr').forEach(row=>{
      const id=row.querySelector('td:nth-child(2) div')?.textContent?.trim();
      const signal=byId.get(id); if(!signal) return;
      while(row.children.length<9) row.appendChild(document.createElement('td'));
      while(row.children.length>9) row.removeChild(row.lastElementChild);
      const vendors=['al','meta','ga'];
      vendors.forEach((vendor,idx)=>{
        const vals=levels(vendor,id), dt=detail(vendor,id);
        row.children[6+idx].innerHTML=vals.map(v=>badge(vendor,v,dt)).join(' ');
      });
    });
    const json=document.getElementById('json'); if(json) json.textContent=JSON.stringify(report,null,2);
  }
  function scheduleEnhance(){ requestAnimationFrame(()=>requestAnimationFrame(enhanceTable)); }

  const style=document.createElement('style');
  style.textContent=`
    .bi-evidence-badge{display:inline-block;padding:3px 7px;border-radius:999px;font-size:9px;font-weight:800;white-space:nowrap;margin:1px 3px 1px 0;border:1px solid transparent;line-height:1.35;cursor:help}
    .bi-ev-pixel{background:#ecfdf5;color:#047857;border-color:#a7f3d0}.bi-ev-bs{background:#ecfeff;color:#0e7490;border-color:#a5f3fc}.bi-ev-public{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe}
    .bi-meta-direct{background:#eef2ff;color:#4338ca;border-color:#c7d2fe}.bi-ga-official{background:#fff7ed;color:#c2410c;border-color:#fed7aa}.bi-ev-unknown{background:#f3f4f6;color:#4b5563;border-color:#e5e7eb}
    #rows td:nth-child(7),#rows td:nth-child(8),#rows td:nth-child(9){min-width:145px}.bi-header-help{cursor:help;white-space:nowrap}.bi-help-dot{display:inline-grid;place-items:center;width:14px;height:14px;margin-left:5px;border-radius:50%;background:#eef2ff;color:#4f46e5;font-size:9px;font-weight:900;vertical-align:middle}
    .bi-tooltip{position:fixed;z-index:99999;display:none;max-width:460px;padding:11px 12px;background:#111827;color:#f9fafb;border:1px solid #374151;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.22);font-size:11px;line-height:1.5;pointer-events:none}.bi-tooltip.show{display:block}.bi-tooltip-title{font-size:12px;font-weight:800;margin-bottom:5px}.bi-tooltip-intro{color:#d1d5db;margin-bottom:9px}.bi-tooltip-row{display:grid;grid-template-columns:max-content 1fr;gap:8px;align-items:start;margin-top:7px}.bi-tooltip-desc{color:#e5e7eb}.bi-tooltip-detail{margin-top:9px;padding-top:8px;border-top:1px solid #374151;color:#9ca3af}
  `;
  document.head.appendChild(style);

  const tooltip=document.createElement('div'); tooltip.className='bi-tooltip'; document.body.appendChild(tooltip);
  function positionTooltip(target){const r=target.getBoundingClientRect(),pad=10,width=Math.min(460,window.innerWidth-pad*2);tooltip.style.maxWidth=width+'px';tooltip.style.left=Math.min(Math.max(pad,r.left),window.innerWidth-width-pad)+'px';tooltip.style.top=(r.bottom+8)+'px';requestAnimationFrame(()=>{const tr=tooltip.getBoundingClientRect();if(tr.bottom>window.innerHeight-pad)tooltip.style.top=Math.max(pad,r.top-tr.height-8)+'px'})}
  function vendorValues(vendor){ return vendor==='al'?['AL-DIRECT-PIXEL','AL-DIRECT-BS','AL-PUBLIC','UNKNOWN']:vendor==='meta'?['META-DIRECT-SCRIPT','UNKNOWN']:['GA-OFFICIAL','UNKNOWN']; }
  function showBadge(target){const value=target.dataset.evidenceValue,vendor=target.dataset.vendor,def=d(),dt=target.dataset.evidenceDetail||'';tooltip.innerHTML=`<div class="bi-tooltip-row"><span class="bi-evidence-badge ${badgeClass(value)}">${value}</span><div class="bi-tooltip-desc">${def.values[value]||value}</div></div>${dt?`<div class="bi-tooltip-detail">${dt}</div>`:''}`;tooltip.classList.add('show');positionTooltip(target)}
  function showHeader(target,vendor){const def=d(),vals=vendorValues(vendor);tooltip.innerHTML=`<div class="bi-tooltip-title">${def.titles[vendor]}</div><div class="bi-tooltip-intro">${def.intros[vendor]}</div>${vals.map(v=>`<div class="bi-tooltip-row"><span class="bi-evidence-badge ${badgeClass(v)}">${v}</span><div class="bi-tooltip-desc">${def.values[v]}</div></div>`).join('')}`;tooltip.classList.add('show');positionTooltip(target)}
  function hide(){tooltip.classList.remove('show')}
  document.addEventListener('pointerover',e=>{const b=e.target.closest?.('[data-evidence-value]');if(b)return showBadge(b);const h=e.target.closest?.('[data-vendor-header]');if(h)showHeader(h,h.dataset.vendorHeader)});
  document.addEventListener('pointerout',e=>{const from=e.target.closest?.('[data-evidence-value],[data-vendor-header]');if(!from)return;const to=e.relatedTarget?.closest?.('[data-evidence-value],[data-vendor-header]');if(to===from)return;hide()});
  window.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);
  window.addEventListener('browser-integrity:report',e=>{annotate(e.detail);scheduleEnhance()},{capture:true});
  document.addEventListener('click',e=>{if(['biZh','biEn'].includes(e.target?.id)){hide();scheduleEnhance()}});
  renderHeader(document.querySelector('.tablewrap table'));
  if(window.__browserIntegrityLastReport){annotate(window.__browserIntegrityLastReport);scheduleEnhance()}
  window.AppLovinEvidence=Object.freeze({annotate,enhanceTable:scheduleEnhance,levels,detail});
})();
