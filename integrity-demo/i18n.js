(() => {
  'use strict';

  const zhDefault = (navigator.language || '').toLowerCase().startsWith('zh');
  let lang = zhDefault ? 'zh' : 'en';
  let applying = false;

  const T = {
    en: {
      title:'Browser Integrity Inspector',
      sub:'AppLovin-inspired browser integrity benchmark · client-side heuristic only',
      howTitle:'How to use this page',
      steps:[
        ['STEP 1','Open in the target environment','Use the browser, automation framework, fingerprint browser, VM or device you want to test.'],
        ['STEP 2','Interact naturally for a few seconds','Move the pointer, scroll or click so behavior signals have enough observation time.'],
        ['STEP 3','Run Scan and inspect flags','Prioritize the combination of flagged detectors. The final Risk Score is only a heuristic summary.'],
        ['STEP 4','Screenshot or export JSON','Use Screenshot Mode for a clean comparison, or Copy JSON for detector-level analysis.']
      ],
      note:'FLAG means suspicious evidence was observed; it does not mean the visitor is definitely cheating. Compare normal and known automation/spoofing environments using the same collector version.',
      evidenceTitle:'How to read the AppLovin evidence columns',
      evidenceIntro:'The table now separates two different questions: (1) do we know AppLovin collects the underlying signal? and (2) do we know AppLovin uses this exact detection rule? They are not the same thing.',
      collectionTitle:'Collection Evidence',
      collection:[
        ['AL-DIRECT-PIXEL','Directly observed in AppLovin Pixel','Exact raw fields were observed in b.applovin.com/v1/pixel traffic. Examples include UA, language(s), cookieEnabled, screen/window dimensions, DPR, scroll offsets, page/top-window context and timing fields.'],
        ['AL-DIRECT-BS','Directly confirmed in bs.js / /v1/s','Exact field/signal has been confirmed from AppLovin bs.js or the re.applovin.com/v1/s path. We currently have no decoded exact bs.js fields promoted to this level.'],
        ['AL-PUBLIC','Publicly disclosed category','AppLovin documentation/privacy disclosures confirm this category is collected, but the exact field or current bs.js implementation is not directly confirmed.'],
        ['UNKNOWN','Not confirmed','We do not yet have sufficient evidence that AppLovin collects this exact signal.']
      ],
      logicTitle:'Detection Logic',
      logic:[
        ['AL-DIRECT','Exact AppLovin rule confirmed','The exact detector/rule has been verified from AppLovin implementation evidence.'],
        ['AL-INFERRED','Strongly inferred','Evidence suggests AppLovin performs this class of integrity check, but the exact rule/threshold is not confirmed.'],
        ['OUR-HEURISTIC','Our rule','This detector is implemented by this demo. It should not be described as AppLovin’s exact logic.'],
        ['N/A','No detector','This row is informational/raw evidence rather than a fraud rule.']
      ],
      evidenceFoot:'Important: AL-DIRECT-PIXEL refers to direct evidence of raw signal collection, not direct evidence of the anti-fraud rule. For example, AppLovin directly collecting screen.width does not prove it uses our Viewport × Screen threshold. At present, most concrete detection rules in this demo are OUR-HEURISTIC.',
      shot:'Screenshot Mode', exitShot:'Exit Screenshot Mode', copy:'Copy JSON', run:'Run Scan',
      summary:'Integrity Summary', flags:'Flagged signals', total:'Total signals', max:'Max severity', weight:'Heuristic weight', env:'Runtime Environment', suspicious:'Suspicious Signals', quick:'Quick Evidence', all:'All Signals', raw:'Raw Integrity JSON',
      footer:'A flagged signal is evidence, not a fraud verdict. Production decisions should combine browser evidence with server-side request, IP/ASN, replay, session history, identity and event-sequence evidence.',
      noSuspicious:'No suspicious client-side signals were detected.', waiting:'Waiting for scan…'
    },
    zh: {
      title:'浏览器完整性检测器',
      sub:'参考 AppLovin 思路的 Browser Integrity / Anti-Fraud Benchmark · 仅客户端启发式判断',
      howTitle:'这个页面怎么用',
      steps:[
        ['第 1 步','在目标环境中打开页面','用你想测试的真实浏览器、自动化框架、指纹浏览器、虚拟机、云手机或设备打开这个页面。'],
        ['第 2 步','自然操作几秒钟','移动鼠标、滚动或点击几下，让 Behavior 类信号有足够的观察时间。'],
        ['第 3 步','运行检测并查看命中项','重点看哪些 Detector 同时被命中。最终 Risk Score 只是为了方便横向比较的汇总分。'],
        ['第 4 步','截图或导出 JSON','用「截图模式」生成更干净的对比截图；需要详细分析时用「复制 JSON」。']
      ],
      note:'FLAG 只表示观察到了可疑证据，并不等于“确定作弊”。验证准确率时，建议用同一个 Collector 版本，同时测试正常浏览器和已知自动化 / Spoofing 环境。',
      evidenceTitle:'怎么理解 AppLovin 的两列证据',
      evidenceIntro:'现在把两个问题拆开了：① AppLovin 是否确定采集了底层 Signal；② AppLovin 是否确定使用了页面里的这个具体检测规则。这两件事不能混为一谈。',
      collectionTitle:'Collection Evidence / 采集证据',
      collection:[
        ['AL-DIRECT-PIXEL','Pixel 中直接观察到','已经在 b.applovin.com/v1/pixel 的真实 Payload 中直接看到 exact raw field。例如 UA、language(s)、cookieEnabled、screen/window 尺寸、DPR、scroll、页面/topWindow 上下文、timing 等。'],
        ['AL-DIRECT-BS','bs.js / /v1/s 中直接确认','已经从 AppLovin bs.js 或 re.applovin.com/v1/s 中确认 exact field / signal。目前我们还没有把任何成功解出的 bs.js exact field 升级到这一档。'],
        ['AL-PUBLIC','官方公开确认类别','AppLovin 官方文档或隐私披露确认会采集这一类数据，但还没有直接确认当前 bs.js 的 exact field / implementation。'],
        ['UNKNOWN','尚未确认','目前没有足够证据证明 AppLovin 会采集这个 exact signal。']
      ],
      logicTitle:'Detection Logic / 检测逻辑',
      logic:[
        ['AL-DIRECT','AppLovin 规则直接确认','已经从 AppLovin 实现证据中确认了这个 exact detector / rule。'],
        ['AL-INFERRED','强推断','证据支持 AppLovin 会做这一类 Integrity 判断，但具体算法、组合和阈值没有被确认。'],
        ['OUR-HEURISTIC','我们的检测规则','这是 Demo 自己实现的 Detector，不能说成 AppLovin 当前使用的 exact logic。'],
        ['N/A','没有检测规则','这一行只是原始 Signal / 环境信息展示，并没有拿它直接做作弊判断。']
      ],
      evidenceFoot:'最重要的区别：AL-DIRECT-PIXEL 只证明“原始 Signal 被 AppLovin 直接采集”，不证明“我们的检测算法就是 AppLovin 的算法”。例如确认 AppLovin 采了 screen.width，并不等于确认它使用了我们 Viewport × Screen 的阈值。当前 Demo 中大部分具体 Detector 都仍是 OUR-HEURISTIC。',
      shot:'截图模式', exitShot:'退出截图模式', copy:'复制 JSON', run:'重新检测',
      summary:'完整性结果摘要', flags:'异常信号数', total:'总信号数', max:'最高风险等级', weight:'启发式权重', env:'运行环境', suspicious:'可疑信号', quick:'关键证据', all:'全部检测项', raw:'原始 Integrity JSON',
      footer:'FLAG 表示异常证据，不等于作弊结论。生产环境应结合服务端请求、IP/ASN、代理/VPN、重放、会话历史、Identity 和事件序列等信号做最终判断。',
      noSuspicious:'未检测到明显的客户端异常信号。', waiting:'等待检测…'
    }
  };

  const titles = {
    'Automation framework markers':'自动化框架特征','UA × platform consistency':'UA × Platform 一致性','Mobile UA × touch consistency':'移动端 UA × Touch 一致性','Chromium UA × runtime':'Chromium UA × Runtime 一致性','Viewport × screen consistency':'Viewport × Screen 一致性','UA × WebGL consistency':'UA × WebGL 一致性','Native API surface tampering':'原生 API 篡改检测','Synthetic interaction events':'合成交互事件','Pointer timing regularity':'鼠标移动时间规律性','Navigator / software environment':'Navigator / 软件环境','Screen / display / orientation':'屏幕 / 显示 / 方向','Network capability':'网络能力','Locale / timezone':'Locale / 时区','Page / iframe context':'页面 / Iframe 上下文','Canvas rendering evidence':'Canvas 渲染证据','WebGL rendering environment':'WebGL 渲染环境','Storage capability':'Storage 能力','Audio capability':'Audio 能力','Navigation / timing':'页面 Navigation / Timing'
  };
  const reverseTitles = Object.fromEntries(Object.entries(titles).map(([a,b])=>[b,a]));
  const cats={automation:'自动化',consistency:'一致性',rendering:'渲染',tamper:'篡改',behavior:'行为',environment:'环境'};
  const reverseCats=Object.fromEntries(Object.entries(cats).map(([a,b])=>[b,a]));

  const style=document.createElement('style');
  style.textContent=`
    .bi-lang{display:flex;border:1px solid var(--border);border-radius:9px;overflow:hidden;background:#fff}.bi-lang button{border:0;background:transparent;padding:9px 11px;font-weight:700;color:var(--muted);cursor:pointer}.bi-lang button.active{background:#111827;color:#fff}
    .bi-howto,.bi-evidence{margin-bottom:18px}.bi-howgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.bi-step{background:var(--panel2);padding:13px;border-radius:10px;min-height:96px}.bi-stepno{font-size:10px;font-weight:800;color:#2563eb}.bi-steptitle{font-size:13px;font-weight:750;margin-top:6px}.bi-stepdesc{font-size:11px;color:var(--muted);line-height:1.5;margin-top:5px}.bi-note{margin-top:12px;padding:11px 13px;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;color:#92400e;font-size:11px;line-height:1.55}
    .bi-evidence-intro{font-size:12px;color:var(--muted);line-height:1.55;margin:-2px 0 12px}.bi-ev-section{margin-top:13px}.bi-ev-section-title{font-size:12px;font-weight:800;margin-bottom:8px}.bi-evidence-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.bi-evidence-item{border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--panel2)}.bi-ev-tag{display:inline-block;padding:4px 7px;border-radius:999px;font-size:9px;font-weight:850;background:#eef2ff;color:#3730a3}.bi-ev-name{font-size:11px;font-weight:750;margin-left:5px}.bi-ev-desc{font-size:10.5px;color:var(--muted);line-height:1.5;margin-top:7px}.bi-evidence-foot{font-size:10.5px;color:var(--muted);line-height:1.55;margin-top:11px}
    body.shot .bi-howto,body.shot .bi-evidence{display:none}@media(max-width:1000px){.bi-howgrid{grid-template-columns:repeat(2,1fr)}.bi-evidence-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.bi-howgrid,.bi-evidence-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const actions=document.querySelector('.actions');
  if(actions&&!document.getElementById('biLang')){const s=document.createElement('div');s.className='bi-lang';s.id='biLang';s.innerHTML='<button id="biZh">中文</button><button id="biEn">EN</button>';actions.insertBefore(s,actions.firstChild);document.getElementById('biZh').onclick=()=>{lang='zh';apply()};document.getElementById('biEn').onclick=()=>{lang='en';apply()};}
  const status=document.getElementById('status');
  if(status&&!document.getElementById('biHowto')){const b=document.createElement('div');b.className='card bi-howto';b.id='biHowto';status.parentNode.insertBefore(b,status)}
  if(status&&!document.getElementById('biEvidence')){const b=document.createElement('div');b.className='card bi-evidence';b.id='biEvidence';status.parentNode.insertBefore(b,status)}

  function renderGuide(){const d=T[lang],b=document.getElementById('biHowto');if(!b)return;b.innerHTML=`<div class="section-title">${d.howTitle}</div><div class="bi-howgrid">${d.steps.map(s=>`<div class="bi-step"><div class="bi-stepno">${s[0]}</div><div class="bi-steptitle">${s[1]}</div><div class="bi-stepdesc">${s[2]}</div></div>`).join('')}</div><div class="bi-note">${d.note}</div>`}
  function cards(items){return items.map(e=>`<div class="bi-evidence-item"><div><span class="bi-ev-tag">${e[0]}</span><span class="bi-ev-name">${e[1]}</span></div><div class="bi-ev-desc">${e[2]}</div></div>`).join('')}
  function renderEvidence(){const d=T[lang],b=document.getElementById('biEvidence');if(!b)return;b.innerHTML=`<div class="section-title">${d.evidenceTitle}</div><div class="bi-evidence-intro">${d.evidenceIntro}</div><div class="bi-ev-section"><div class="bi-ev-section-title">${d.collectionTitle}</div><div class="bi-evidence-grid">${cards(d.collection)}</div></div><div class="bi-ev-section"><div class="bi-ev-section-title">${d.logicTitle}</div><div class="bi-evidence-grid">${cards(d.logic)}</div></div><div class="bi-evidence-foot">${d.evidenceFoot}</div>`}
  const set=(q,v)=>{const e=document.querySelector(q);if(e)e.textContent=v};
  function translateTitle(x){return lang==='zh'?(titles[x]||x):(reverseTitles[x]||x)}
  function translateCat(x){const s=(x||'').trim().toLowerCase();return lang==='zh'?(cats[s]||x):(reverseCats[x]||x)}

  function apply(){if(applying)return;applying=true;const d=T[lang];document.documentElement.lang=lang==='zh'?'zh-CN':'en';set('.header h1',d.title);set('.header .sub',d.sub);const shot=document.getElementById('shot'),copy=document.getElementById('copy'),run=document.getElementById('run');if(shot)shot.textContent=document.body.classList.contains('shot')?d.exitShot:d.shot;if(copy&&!/Copied|已复制/.test(copy.textContent))copy.textContent=d.copy;if(run&&!/Scanning|检测中/.test(run.textContent))run.textContent=d.run;document.getElementById('biZh')?.classList.toggle('active',lang==='zh');document.getElementById('biEn')?.classList.toggle('active',lang==='en');renderGuide();renderEvidence();
    const summaryCard=document.getElementById('flags')?.closest('.card');if(summaryCard){const st=summaryCard.querySelector('.section-title');if(st)st.textContent=d.summary;const ls=summaryCard.querySelectorAll('.label');[d.flags,d.total,d.max,d.weight].forEach((v,i)=>{if(ls[i])ls[i].textContent=v})}
    const env=document.getElementById('env')?.closest('.card');if(env?.querySelector('.section-title'))env.querySelector('.section-title').textContent=d.env;const sus=document.getElementById('suspicious')?.closest('.card');if(sus?.querySelector('.section-title'))sus.querySelector('.section-title').textContent=d.suspicious;const quick=document.getElementById('quick')?.closest('.card');if(quick?.querySelector('.section-title'))quick.querySelector('.section-title').textContent=d.quick;const all=document.getElementById('rows')?.closest('.card');if(all?.querySelector('.section-title'))all.querySelector('.section-title').textContent=d.all;const rs=document.querySelector('details summary');if(rs)rs.textContent=d.raw;const f=document.querySelector('.footer');if(f)f.textContent=d.footer;
    document.querySelectorAll('.sig-title').forEach(e=>e.textContent=translateTitle(e.textContent));document.querySelectorAll('#rows td:nth-child(2) strong').forEach(e=>e.textContent=translateTitle(e.textContent));document.querySelectorAll('.catname').forEach(e=>e.textContent=translateCat(e.textContent));document.querySelectorAll('.pill').forEach(e=>{const flag=e.classList.contains('flag');e.textContent=lang==='zh'?(flag?'异常':'正常'):(flag?'FLAG':'OK')});document.querySelectorAll('.empty').forEach(e=>{if(/No suspicious|未检测到明显/.test(e.textContent))e.textContent=d.noSuspicious;else if(/Waiting for scan|等待检测/.test(e.textContent))e.textContent=d.waiting});applying=false}

  let timer;const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,30)});obs.observe(document.body,{childList:true,subtree:true,characterData:true});apply();
})();
