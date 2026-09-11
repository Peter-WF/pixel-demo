(() => {
  'use strict';

  const SOURCES = {
    alPixel:'https://hybrid-analysis.com/sample/0abee1435c6d9db908a086ca29571d1356b066366b0791e63b1fbdcab2318a22/6a0c8c66de50250a3d099be5',
    alBs:'https://res4.applovin.com/p/104/b/bs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js',
    alBsRuntime:'https://hybrid-analysis.com/sample/d30debf3f0cfbd41ca04b2864f4a0ee0db4e04089dba01d1c1a1c97018350b99/6a4bb7d0eca8e271ab0085c0',
    metaPrivacy:'https://www.facebook.com/privacy/policies/uso/',
    metaNetwork:'https://www.classaction.org/media/strong-et-al-v-lifestance-health-group-incorporated.pdf',
    gaDevice:'https://support.google.com/analytics/answer/12002752?hl=en',
    gaParams:'https://support.google.com/analytics/table/13594742?hl=en',
    gaSettings:'https://support.google.com/analytics/answer/13438166?hl=en'
  };

  const AL_PIXEL = {
    'consistency.ua_platform':['UA is directly observed; navigator.platform is not directly established by this excerpt.',`{
  "page": {"navigator": {"userAgent": "<browser UA>"}}
}`],
    'consistency.mobile_touch':['UA is direct; maxTouchPoints is not.',`{
  "page": {"navigator": {"userAgent": "<browser UA>"}}
}`],
    'consistency.chromium_runtime':['UA is direct; window.chrome is not.',`{
  "page": {"navigator": {"userAgent": "<Chromium-like UA>"}}
}`],
    'consistency.viewport_screen':['Screen/window fields are directly observed in /v1/pixel traffic.',`{
  "page": {"window": {
    "innerWidth": <number>, "innerHeight": <number>,
    "outerWidth": <number>, "outerHeight": <number>,
    "screenWidth": <number>, "screenHeight": <number>,
    "pixelRatio": <number>, "scrollX": <number>, "scrollY": <number>
  }}
}`],
    'consistency.ua_webgl':['UA is direct; WebGL is not.',`{"page":{"navigator":{"userAgent":"<browser UA>"}}}`],
    'environment.navigator':['Directly observed fields include userAgent, language/languages and cookieEnabled.',`{
  "page":{"navigator":{
    "userAgent":"<browser UA>",
    "language":"<language>",
    "languages":["..."],
    "cookieEnabled":true
  }}
}`],
    'environment.display':['Directly observed screen/window/DPR/scroll structure.',`{
  "page":{"window":{
    "innerWidth":<number>,"innerHeight":<number>,
    "outerWidth":<number>,"outerHeight":<number>,
    "screenWidth":<number>,"screenHeight":<number>,
    "screenX":<number>,"screenY":<number>,
    "scrollX":<number>,"scrollY":<number>,"pixelRatio":<number>
  }}
}`],
    'environment.page_context':['Directly observed document/topWindow/iframe context.',`{
  "page":{
    "document":{"location":"<url>","referrer":"<referrer>","title":"<title>"},
    "topWindow":{"origin":"<origin>","href":"<href>","pathname":"<path>"}
  },
  "inIframe":false
}`],
    'environment.performance':['Directly observed timing objects.',`{
  "axon":{"pixelTimings":{"...":"..."},"pageTimings":{"...":"..."}}
}`]
  };

  const META_NETWORK = {
    'consistency.viewport_screen':['Direct request evidence covers screen width/height; viewport dimensions are not proven by this sample.',`GET https://www.facebook.com/tr/?
  id=<pixel-id>
  &ev=PageView
  &sw=1664
  &sh=1110
  ...`],
    'environment.display':['Direct request evidence includes sw/sh (screen width/height). Other display fields in this demo are not proven by this sample.',`GET https://www.facebook.com/tr/?
  ...
  &sw=1664
  &sh=1110
  ...`],
    'environment.page_context':['Direct request evidence includes page URL, referrer, iframe state and timestamp.',`GET https://www.facebook.com/tr/?
  id=<pixel-id>
  &ev=PageView
  &dl=https%3A%2F%2Fexample.com%2F
  &rl=https%3A%2F%2Fwww.google.com%2F
  &if=false
  &ts=<timestamp>
  &sw=<width>
  &sh=<height>
  ...`]
  };

  const GA_PROOF = {
    'consistency.ua_platform':['Google official Analytics documentation states that browser User-Agent, browser/device and OS information are collected. Exact navigator.platform usage for this demo rule is not established.',`Officially documented granular device fields include:
• Browser User-Agent string
• browser minor version
• device brand/model/name
• operating-system minor version
• platform minor version`],
    'consistency.viewport_screen':['Google officially documents screen_resolution and states that it is calculated from window.screen. The viewport side of this demo rule is not established.',`screen_resolution
  Automatically collected
  Example: 1920x1080
  Source: window.screen`],
    'consistency.ua_webgl':['Google officially documents browser/device information, but this evidence does not establish WebGL collection.',`Official: browser UA / device / OS data
Unknown here: WebGL renderer/vendor`],
    'environment.navigator':['Google officially documents User-Agent/device information and language. Other navigator fields in this demo remain outside this evidence.',`language        -> navigator.language
browser/device  -> automatically collected device information
User-Agent      -> documented granular device data`],
    'environment.display':['Google officially documents screen_resolution from window.screen.',`screen_resolution = <Width>x<Height>
Source: window.screen`],
    'environment.locale':['Google tag documentation lists language with default navigator.language. Timezone/Intl fields shown by the demo are not established by this proof.',`language = navigator.language`],
    'environment.page_context':['Google tag documentation explicitly maps these default parameters.',`page_location = document.location
page_referrer = document.referrer
page_title    = document.title`]
  };

  const TXT={
    en:{title:'Collection evidence',source:'Evidence source',boundary:'Evidence boundary',proof:'Evidence excerpt',close:'Close',open:'Open source',analysis:'Stored analysis record',alBsNote:'Exact original source excerpt is not stored here; this panel shows the verified analysis boundary rather than fabricated source code.'},
    zh:{title:'采集证据',source:'证据来源',boundary:'证据边界',proof:'证据片段',close:'关闭',open:'打开证据来源',analysis:'已保存的分析记录',alBsNote:'当前没有保存对应的 exact 原始源码片段，因此这里只展示已经验证过的分析边界，不会用伪代码冒充原始代码。'}
  };
  function zh(){return (document.documentElement.lang||'').toLowerCase().startsWith('zh');}
  function t(){return zh()?TXT.zh:TXT.en;}
  function esc(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}

  const style=document.createElement('style');
  style.textContent=`
    .bi-evidence-badge[data-evidence-value="AL-DIRECT-PIXEL"],.bi-evidence-badge[data-evidence-value="AL-DIRECT-BS"],.bi-evidence-badge[data-evidence-value="AL-PUBLIC"],.bi-evidence-badge[data-evidence-value="META-DIRECT-NETWORK"],.bi-evidence-badge[data-evidence-value="META-PUBLIC"],.bi-evidence-badge[data-evidence-value="GA-OFFICIAL"]{cursor:pointer;box-shadow:inset 0 -1px 0 rgba(0,0,0,.08)}
    .bi-proof-backdrop{position:fixed;inset:0;z-index:100000;background:rgba(17,24,39,.48);display:none;align-items:center;justify-content:center;padding:24px}.bi-proof-backdrop.show{display:flex}.bi-proof-modal{width:min(780px,100%);max-height:min(780px,90vh);overflow:auto;background:#fff;border-radius:16px;box-shadow:0 22px 60px rgba(0,0,0,.28);border:1px solid #e5e7eb}.bi-proof-head{display:flex;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid #e5e7eb}.bi-proof-title{font-size:16px;font-weight:800}.bi-proof-sub{font-size:11px;color:#6b7280;margin-top:4px}.bi-proof-close{border:0;background:#f3f4f6;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:18px}.bi-proof-body{padding:18px 20px}.bi-proof-label{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280;font-weight:800;margin:15px 0 6px}.bi-proof-boundary{padding:10px 12px;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;color:#92400e;font-size:11px;line-height:1.55}.bi-proof-code{margin:0;background:#111827;color:#e5e7eb;border-radius:10px;padding:14px;overflow:auto;font-size:11px;line-height:1.55;white-space:pre-wrap}.bi-proof-links{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.bi-proof-link{display:inline-flex;text-decoration:none;border:1px solid #d1d5db;border-radius:8px;padding:8px 10px;color:#111827;font-size:11px;font-weight:700;background:#fff}.bi-proof-note{font-size:11px;color:#6b7280;line-height:1.55;margin-top:10px}
  `;document.head.appendChild(style);
  const back=document.createElement('div');back.className='bi-proof-backdrop';back.innerHTML='<div class="bi-proof-modal" role="dialog" aria-modal="true"><div class="bi-proof-head"><div><div class="bi-proof-title" id="biProofTitle"></div><div class="bi-proof-sub" id="biProofSub"></div></div><button class="bi-proof-close">×</button></div><div class="bi-proof-body" id="biProofBody"></div></div>';document.body.appendChild(back);

  function modal(label,id,boundary,snippet,links,note=''){
    const d=t();document.getElementById('biProofTitle').textContent=`${d.title} · ${label}`;document.getElementById('biProofSub').textContent=id||'';
    document.getElementById('biProofBody').innerHTML=`<div class="bi-proof-label">${esc(d.boundary)}</div><div class="bi-proof-boundary">${esc(boundary)}</div><div class="bi-proof-label">${esc(d.proof)}</div><pre class="bi-proof-code">${esc(snippet)}</pre>${note?`<div class="bi-proof-note">${esc(note)}</div>`:''}<div class="bi-proof-links">${links.map(x=>`<a class="bi-proof-link" target="_blank" rel="noopener" href="${x[1]}">${esc(x[0])} ↗</a>`).join('')}</div>`;back.classList.add('show');
  }
  function show(label,id){
    const d=t();
    if(label==='AL-DIRECT-PIXEL'){const e=AL_PIXEL[id]||['Exact AppLovin Pixel evidence exists for part of this row.',`{"AppLovin /v1/pixel":"direct field evidence"}`];return modal(label,id,e[0],e[1],[[d.open,SOURCES.alPixel]]);}
    if(label==='AL-DIRECT-BS'){return modal(label,id,'Canvas-related logic is present in the analyzed Browser Signal bundle. Exact readback, /v1/s field mapping and server-side use remain unverified.',`Analyzed bundle:
bs.c9e1074f5b3f9fc8ea15d152add07294-1.iife.js

Confirmed:
• Canvas-related logic exists in the Browser Signal bundle
• /v1/s is a separate opaque browser-signal endpoint

Not yet confirmed:
• exact readback API
• exact Canvas value serialized to /v1/s
• server-side use / weight`,[[d.open,SOURCES.alBs],[d.open,SOURCES.alBsRuntime]],d.alBsNote);}
    if(label==='AL-PUBLIC'){return modal(label,id,'This is category-level public disclosure, not proof of the exact field shown by the demo.','AppLovin public disclosure confirms the category; exact current implementation may differ.',[[d.open,'https://legal.applovin.com/privacy/']]);}
    if(label==='META-DIRECT-NETWORK'){const e=META_NETWORK[id]||['This field was observed in a Meta Pixel tracking request.','facebook.com/tr?...'];return modal(label,id,e[0],e[1],[[d.open,SOURCES.metaNetwork]]);}
    if(label==='META-PUBLIC'){return modal(label,id,'Meta publicly states that partners using Meta Business Tools, including Meta Pixel, provide website/activity plus device/browser information. This is category-level disclosure, not exact field proof.','Meta Privacy disclosure:
Partners using Meta Pixel can provide information about activities on/off Meta products, including device information, websites visited, apps used and purchases.',[[d.open,SOURCES.metaPrivacy]]);}
    if(label==='GA-OFFICIAL'){const e=GA_PROOF[id]||['Google official Analytics documentation explicitly documents this field/category.','See linked Google Analytics documentation.'];const links=id==='environment.page_context'?[[d.open,SOURCES.gaSettings],[d.open,SOURCES.gaParams]]:[[d.open,SOURCES.gaDevice],[d.open,SOURCES.gaSettings]];return modal(label,id,e[0],e[1],links);}
  }

  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-evidence-value]');if(!b)return;const v=b.dataset.evidenceValue;if(v==='UNKNOWN')return;e.preventDefault();e.stopPropagation();show(v,b.dataset.signalId||'');},true);
  back.querySelector('.bi-proof-close').onclick=()=>back.classList.remove('show');back.onclick=e=>{if(e.target===back)back.classList.remove('show');};document.addEventListener('keydown',e=>{if(e.key==='Escape')back.classList.remove('show');});
})();
