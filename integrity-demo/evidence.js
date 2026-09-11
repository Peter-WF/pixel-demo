(() => {
  'use strict';

  const VENDOR_MAP = {
    al: {
      'automation.navigator.webdriver':['UNKNOWN'],
      'automation.framework_markers':['UNKNOWN'],
      'consistency.ua_platform':['AL-DIRECT-PIXEL','AL-PUBLIC'],
      'consistency.mobile_touch':['AL-DIRECT-PIXEL','AL-PUBLIC'],
      'consistency.chromium_runtime':['AL-DIRECT-PIXEL','AL-PUBLIC'],
      'consistency.viewport_screen':['AL-DIRECT-PIXEL'],
      'consistency.ua_webgl':['AL-DIRECT-PIXEL','UNKNOWN'],
      'tamper.native_api_surface':['UNKNOWN'],
      'behavior.synthetic_events':['UNKNOWN'],
      'behavior.pointer_regularity':['UNKNOWN'],
      'environment.navigator':['AL-DIRECT-PIXEL','AL-PUBLIC','UNKNOWN'],
      'environment.display':['AL-DIRECT-PIXEL','AL-PUBLIC','UNKNOWN'],
      'environment.network':['AL-PUBLIC'],
      'environment.locale':['AL-PUBLIC'],
      'environment.page_context':['AL-DIRECT-PIXEL','UNKNOWN'],
      'rendering.canvas':['AL-DIRECT-BS','UNKNOWN'],
      'rendering.webgl':['UNKNOWN'],
      'environment.storage':['AL-PUBLIC'],
      'environment.audio':['AL-PUBLIC'],
      'environment.performance':['AL-DIRECT-PIXEL','UNKNOWN']
    },
    meta: {
      'automation.navigator.webdriver':['UNKNOWN'],
      'automation.framework_markers':['UNKNOWN'],
      'consistency.ua_platform':['META-PUBLIC','UNKNOWN'],
      'consistency.mobile_touch':['UNKNOWN'],
      'consistency.chromium_runtime':['UNKNOWN'],
      'consistency.viewport_screen':['META-DIRECT-NETWORK','UNKNOWN'],
      'consistency.ua_webgl':['META-PUBLIC','UNKNOWN'],
      'tamper.native_api_surface':['UNKNOWN'],
      'behavior.synthetic_events':['UNKNOWN'],
      'behavior.pointer_regularity':['UNKNOWN'],
      'environment.navigator':['META-PUBLIC','UNKNOWN'],
      'environment.display':['META-DIRECT-NETWORK','META-PUBLIC','UNKNOWN'],
      'environment.network':['META-PUBLIC'],
      'environment.locale':['UNKNOWN'],
      'environment.page_context':['META-DIRECT-NETWORK'],
      'rendering.canvas':['UNKNOWN'],
      'rendering.webgl':['UNKNOWN'],
      'environment.storage':['UNKNOWN'],
      'environment.audio':['UNKNOWN'],
      'environment.performance':['UNKNOWN']
    },
    ga: {
      'automation.navigator.webdriver':['UNKNOWN'],
      'automation.framework_markers':['UNKNOWN'],
      'consistency.ua_platform':['GA-OFFICIAL','UNKNOWN'],
      'consistency.mobile_touch':['UNKNOWN'],
      'consistency.chromium_runtime':['UNKNOWN'],
      'consistency.viewport_screen':['GA-OFFICIAL','UNKNOWN'],
      'consistency.ua_webgl':['GA-OFFICIAL','UNKNOWN'],
      'tamper.native_api_surface':['UNKNOWN'],
      'behavior.synthetic_events':['UNKNOWN'],
      'behavior.pointer_regularity':['UNKNOWN'],
      'environment.navigator':['GA-OFFICIAL','UNKNOWN'],
      'environment.display':['GA-OFFICIAL','UNKNOWN'],
      'environment.network':['UNKNOWN'],
      'environment.locale':['GA-OFFICIAL','UNKNOWN'],
      'environment.page_context':['GA-OFFICIAL'],
      'rendering.canvas':['UNKNOWN'],
      'rendering.webgl':['UNKNOWN'],
      'environment.storage':['UNKNOWN'],
      'environment.audio':['UNKNOWN'],
      'environment.performance':['UNKNOWN']
    }
  };

  const DETAILS = {
    al: {
      'consistency.ua_platform':'UA is directly observed in AppLovin Pixel traffic; software/device environment is publicly disclosed. navigator.platform itself is not directly confirmed.',
      'consistency.mobile_touch':'UA is direct from Pixel traffic; device/software is a public category. Exact maxTouchPoints collection is not confirmed.',
      'consistency.chromium_runtime':'UA is direct from Pixel traffic; browser/software environment is public. Exact window.chrome collection is not confirmed.',
      'consistency.viewport_screen':'Screen and window dimensions are directly observed in AppLovin Pixel payloads.',
      'consistency.ua_webgl':'UA is direct from Pixel traffic; exact WebGL collection remains unconfirmed.',
      'environment.navigator':'userAgent, language/languages and cookieEnabled are directly observed. Other navigator fields shown by this demo have weaker or unknown evidence.',
      'environment.display':'screen/window dimensions, DPR and scroll offsets are directly observed; broader display/orientation is public; some demo probes remain unconfirmed.',
      'environment.network':'AppLovin publicly discloses network connection information and IP-related data; exact navigator.connection fields are not direct.',
      'environment.locale':'AppLovin publicly discloses locale/timezone categories; exact Intl fields are not direct.',
      'environment.page_context':'Document location/referrer/title, topWindow context and inIframe are directly observed; several extra page-state fields remain unknown.',
      'rendering.canvas':'Canvas-related logic is directly observed in the Browser Signal bundle; exact readback, /v1/s serialization and server-side use remain unconfirmed.',
      'environment.storage':'Storage/memory-related device information is public; exact navigator.storage probes are not direct.',
      'environment.audio':'Audio/video capability categories are public; exact AudioContext collection is not confirmed.',
      'environment.performance':'Pixel payloads directly expose pixelTimings/pageTimings; broader Navigation Timing fields shown by this demo are not all direct.'
    },
    meta: {
      'consistency.ua_platform':'Meta publicly states that partners using Meta Business Tools such as the Meta Pixel provide device/browser information. Exact navigator.platform collection is not directly confirmed here.',
      'consistency.viewport_screen':'Observed Meta Pixel requests include sw/sh (screen width/height). This demo also compares viewport dimensions, which are not established by that request evidence.',
      'consistency.ua_webgl':'Meta publicly describes browser/device information from partners, but exact WebGL collection is not established.',
      'environment.navigator':'Meta publicly describes browser/device information from partners. Exact demo fields such as hardwareConcurrency, deviceMemory, maxTouchPoints and webdriver are not established.',
      'environment.display':'Observed Meta Pixel requests include sw/sh. Meta also publicly describes device/browser information. The rest of this demo row is not directly established.',
      'environment.network':'Meta publicly describes internet/electronic-network activity plus device/browser information. Exact navigator.connection values are not established.',
      'environment.page_context':'Observed Meta Pixel requests include dl (page URL), rl (referrer), if (iframe state), ts and event metadata.',
      'rendering.canvas':'No direct Canvas collection evidence has been established for the analyzed Meta Pixel evidence set.',
      'rendering.webgl':'No direct WebGL collection evidence has been established for the analyzed Meta Pixel evidence set.',
      'environment.audio':'No direct AudioContext collection evidence has been established for the analyzed Meta Pixel evidence set.'
    },
    ga: {
      'consistency.ua_platform':'Google officially documents browser User-Agent/device/OS collection. Exact navigator.platform use for this demo check is not established.',
      'consistency.viewport_screen':'Google officially documents screen_resolution derived from window.screen. The viewport side of this demo comparison is not established as a default GA field.',
      'consistency.ua_webgl':'Google officially documents browser/device information, but WebGL renderer collection is not established.',
      'environment.navigator':'Google officially documents browser UA/device information and language. Several other navigator fields shown by this demo are not established as GA defaults.',
      'environment.display':'Google officially documents screen_resolution from window.screen. The broader display/window fields in this demo are not all GA defaults.',
      'environment.locale':'Google officially documents language as a Google tag setting/default parameter. Exact timezone/Intl-resolved fields are not established here.',
      'environment.page_context':'Google officially documents page_location, page_referrer and page_title as automatically/default-populated web parameters.',
      'environment.performance':'The demo exposes Navigation Timing fields; these exact fields are not established here as default GA collection.'
    }
  };

  const DEF = {
    en: {
      headers:['Status','Detector','Category','Severity','Weight','Confidence','AppLovin Evidence','Meta Pixel Evidence','GA Evidence'],
      title:{al:'AppLovin collection evidence',meta:'Meta Pixel collection evidence',ga:'Google Analytics collection evidence'},
      intro:{al:'How strong is the evidence that AppLovin collects this signal?',meta:'How strong is the evidence that Meta Pixel collects this signal?',ga:'How strong is the evidence that Google Analytics / Google tag collects this signal?'},
      value:{
        'AL-DIRECT-PIXEL':'Exact raw field directly observed in AppLovin /v1/pixel traffic.',
        'AL-DIRECT-BS':'Relevant signal logic directly observed in AppLovin bs.js; exact serialization/use may still be unknown.',
        'AL-PUBLIC':'Signal category publicly disclosed by AppLovin; exact current field/implementation is not directly confirmed.',
        'META-DIRECT-NETWORK':'Exact or closely corresponding field directly observed in a Meta Pixel facebook.com/tr request.',
        'META-PUBLIC':'Meta publicly discloses this signal category for partner/business-tool data, but the exact Pixel field is not directly confirmed here.',
        'GA-OFFICIAL':'Google official Analytics / Google tag documentation explicitly states this field/category is collected, derived or default-populated.',
        'UNKNOWN':'No sufficient evidence yet for this exact signal/field.'
      }
    },
    zh: {
      headers:['状态','检测项','分类','风险等级','权重','置信度','AppLovin 证据','Meta Pixel 证据','GA 证据'],
      title:{al:'AppLovin 采集证据',meta:'Meta Pixel 采集证据',ga:'Google Analytics 采集证据'},
      intro:{al:'表示我们对 AppLovin 是否采集这个 Signal 掌握了多强的证据。',meta:'表示我们对 Meta Pixel 是否采集这个 Signal 掌握了多强的证据。',ga:'表示我们对 Google Analytics / Google tag 是否采集这个 Signal 掌握了多强的证据。'},
      value:{
        'AL-DIRECT-PIXEL':'已在 AppLovin /v1/pixel 的真实 Payload 中直接观察到 exact raw field。',
        'AL-DIRECT-BS':'已在 AppLovin bs.js 中直接观察到相关 Signal 代码；exact 序列化和服务端用途仍可能未知。',
        'AL-PUBLIC':'AppLovin 官方公开确认会采集这一类 Signal，但 exact field / 当前实现未直接确认。',
        'META-DIRECT-NETWORK':'已在 Meta Pixel 的 facebook.com/tr 真实请求中直接观察到 exact 或高度对应的字段。',
        'META-PUBLIC':'Meta 官方公开说明通过合作伙伴 / Meta Business Tools 会接收这一类 Signal，但当前 Pixel exact field 未直接确认。',
        'GA-OFFICIAL':'Google Analytics / Google tag 官方文档明确说明该字段 / 类别会被采集、派生或默认填充。',
        'UNKNOWN':'目前没有足够证据证明该 Pixel 会采集这个 exact signal / field。'
      }
    }
  };

  function isZh(){return (document.documentElement.lang||'').toLowerCase().startsWith('zh');}
  function tr(){return isZh()?DEF.zh:DEF.en;}
  function levels(vendor,id){return VENDOR_MAP[vendor]?.[id]||['UNKNOWN'];}
  function detail(vendor,id){return DETAILS[vendor]?.[id]||'No row-specific evidence note has been assigned.';}
  function cls(v){switch(v){case'AL-DIRECT-PIXEL':return'bi-al-pixel';case'AL-DIRECT-BS':return'bi-al-bs';case'AL-PUBLIC':return'bi-al-public';case'META-DIRECT-NETWORK':return'bi-meta-direct';case'META-PUBLIC':return'bi-meta-public';case'GA-OFFICIAL':return'bi-ga-official';default:return'bi-unknown';}}
  function esc(s){return String(s||'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
  function badge(vendor,v,id){return `<span class="bi-evidence-badge ${cls(v)}" data-vendor="${vendor}" data-signal-id="${esc(id)}" data-evidence-value="${v}" data-evidence-detail="${esc(detail(vendor,id))}">${v}</span>`;}

  function annotate(report){
    if(!report||!Array.isArray(report.signals))return report;
    report.evidenceSchemaVersion='4.0';
    for(const s of report.signals){
      s.vendorCollectionEvidence={appLovin:levels('al',s.id),meta:levels('meta',s.id),ga:levels('ga',s.id)};
    }
    return report;
  }

  function renderHeader(table){
    const h=table?.querySelector('thead tr');if(!h)return;
    h.innerHTML=tr().headers.map((x,i)=>i>=6?`<th class="bi-header-help" data-vendor-header="${i===6?'al':i===7?'meta':'ga'}">${x}<span class="bi-help-dot">?</span></th>`:`<th>${x}</th>`).join('');
  }

  function enhanceTable(){
    const table=document.querySelector('.tablewrap table');if(!table)return;
    renderHeader(table);
    const report=window.__browserIntegrityLastReport;if(!report||!Array.isArray(report.signals))return;
    annotate(report);
    const byId=new Map(report.signals.map(s=>[s.id,s]));
    table.querySelectorAll('tbody tr').forEach(row=>{
      const id=row.querySelector('td:nth-child(2) div')?.textContent?.trim();if(!id||!byId.has(id))return;
      while(row.children.length<9)row.appendChild(document.createElement('td'));
      while(row.children.length>9)row.removeChild(row.lastElementChild);
      ['al','meta','ga'].forEach((vendor,idx)=>{row.children[6+idx].innerHTML=levels(vendor,id).map(v=>badge(vendor,v,id)).join(' ');});
    });
    const json=document.getElementById('json');if(json)json.textContent=JSON.stringify(report,null,2);
  }
  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(enhanceTable));}

  const style=document.createElement('style');
  style.textContent=`
    .bi-evidence-badge{display:inline-block;padding:3px 7px;border-radius:999px;font-size:9px;font-weight:800;white-space:nowrap;margin:1px 3px 1px 0;border:1px solid transparent;line-height:1.35;cursor:help}
    .bi-al-pixel{background:#ecfdf5;color:#047857;border-color:#a7f3d0}.bi-al-bs{background:#ecfeff;color:#0e7490;border-color:#a5f3fc}.bi-al-public{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe}
    .bi-meta-direct{background:#eef2ff;color:#4338ca;border-color:#c7d2fe}.bi-meta-public{background:#f5f3ff;color:#6d28d9;border-color:#ddd6fe}.bi-ga-official{background:#fff7ed;color:#c2410c;border-color:#fed7aa}.bi-unknown{background:#f3f4f6;color:#4b5563;border-color:#e5e7eb}
    #rows td:nth-child(7),#rows td:nth-child(8),#rows td:nth-child(9){min-width:145px}.bi-header-help{cursor:help;white-space:nowrap}.bi-help-dot{display:inline-grid;place-items:center;width:14px;height:14px;margin-left:5px;border-radius:50%;background:#eef2ff;color:#4f46e5;font-size:9px;font-weight:900;vertical-align:middle}
    .bi-tooltip{position:fixed;z-index:99999;display:none;max-width:470px;padding:11px 12px;background:#111827;color:#f9fafb;border:1px solid #374151;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.22);font-size:11px;line-height:1.5;pointer-events:none}.bi-tooltip.show{display:block}.bi-tooltip-title{font-size:12px;font-weight:800;margin-bottom:5px}.bi-tooltip-intro{color:#d1d5db;margin-bottom:8px}.bi-tooltip-row{display:grid;grid-template-columns:max-content 1fr;gap:8px;align-items:start;margin-top:7px}.bi-tooltip-detail{margin-top:9px;padding-top:8px;border-top:1px solid #374151;color:#9ca3af}
  `;document.head.appendChild(style);
  const tip=document.createElement('div');tip.className='bi-tooltip';document.body.appendChild(tip);
  function position(el){const r=el.getBoundingClientRect(),pad=10,w=Math.min(470,innerWidth-pad*2);tip.style.maxWidth=w+'px';tip.style.left=Math.min(Math.max(pad,r.left),innerWidth-w-pad)+'px';tip.style.top=(r.bottom+8)+'px';requestAnimationFrame(()=>{const trr=tip.getBoundingClientRect();if(trr.bottom>innerHeight-pad)tip.style.top=Math.max(pad,r.top-trr.height-8)+'px';});}
  function showBadge(el){const d=tr(),v=el.dataset.evidenceValue,dt=el.dataset.evidenceDetail||'';tip.innerHTML=`<div class="bi-tooltip-row"><span class="bi-evidence-badge ${cls(v)}">${v}</span><div>${d.value[v]||v}</div></div>${dt?`<div class="bi-tooltip-detail">${dt}</div>`:''}`;tip.classList.add('show');position(el);}
  function showHeader(el,vendor){const d=tr();const vals=vendor==='al'?['AL-DIRECT-PIXEL','AL-DIRECT-BS','AL-PUBLIC','UNKNOWN']:vendor==='meta'?['META-DIRECT-NETWORK','META-PUBLIC','UNKNOWN']:['GA-OFFICIAL','UNKNOWN'];tip.innerHTML=`<div class="bi-tooltip-title">${d.title[vendor]}</div><div class="bi-tooltip-intro">${d.intro[vendor]}</div>${vals.map(v=>`<div class="bi-tooltip-row"><span class="bi-evidence-badge ${cls(v)}">${v}</span><div>${d.value[v]}</div></div>`).join('')}`;tip.classList.add('show');position(el);}
  function hide(){tip.classList.remove('show');}
  document.addEventListener('pointerover',e=>{const b=e.target.closest?.('[data-evidence-value]');if(b)return showBadge(b);const h=e.target.closest?.('[data-vendor-header]');if(h)showHeader(h,h.dataset.vendorHeader);});
  document.addEventListener('pointerout',e=>{if(e.target.closest?.('[data-evidence-value],[data-vendor-header]'))hide();});
  addEventListener('scroll',hide,true);addEventListener('resize',hide);
  addEventListener('browser-integrity:report',e=>{annotate(e.detail);schedule();},{capture:true});
  document.addEventListener('click',e=>{if(e.target?.id==='biZh'||e.target?.id==='biEn')schedule();});
  renderHeader(document.querySelector('.tablewrap table'));
  if(window.__browserIntegrityLastReport){annotate(window.__browserIntegrityLastReport);schedule();}
  window.AppLovinEvidence=Object.freeze({annotate,enhanceTable:schedule,levels,detail});
})();
