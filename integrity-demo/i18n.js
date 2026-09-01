(() => {
  'use strict';

  const zh = (navigator.language || '').toLowerCase().startsWith('zh');
  let lang = zh ? 'zh' : 'en';
  let applying = false;

  const T = {
    en: {
      title: 'Browser Integrity Inspector',
      sub: 'AppLovin-inspired browser integrity benchmark · client-side heuristic only',
      howTitle: 'How to use this page',
      steps: [
        ['STEP 1', 'Open in the target environment', 'Use the browser, automation framework, fingerprint browser, VM or device you want to test.'],
        ['STEP 2', 'Interact naturally for a few seconds', 'Move the pointer, scroll or click so behavior signals have enough observation time.'],
        ['STEP 3', 'Run Scan and inspect flags', 'Prioritize the combination of flagged detectors. The final Risk Score is only a heuristic summary.'],
        ['STEP 4', 'Screenshot or export JSON', 'Use Screenshot Mode for a clean comparison, or Copy JSON for detector-level analysis.']
      ],
      note: 'Important: FLAG means suspicious evidence was observed; it does not mean the visitor is definitely cheating. For accuracy testing, compare normal browsers and known automation / spoofing environments using the same collector version.',
      shot: 'Screenshot Mode', exitShot: 'Exit Screenshot Mode', copy: 'Copy JSON', copied: 'Copied', run: 'Run Scan', scanning: 'Scanning…',
      summary: 'Integrity Summary', flags: 'Flagged signals', total: 'Total signals', max: 'Max severity', weight: 'Heuristic weight', env: 'Runtime Environment', suspicious: 'Suspicious Signals', quick: 'Quick Evidence', all: 'All Signals', raw: 'Raw Integrity JSON',
      footer: 'A flagged signal is evidence, not a fraud verdict. Production decisions should combine these browser signals with server-side request, IP/ASN, replay, session history, identity and event-sequence evidence.',
      noSuspicious: 'No suspicious client-side signals were detected.', waiting: 'Waiting for scan…',
      headers: ['Status','Detector','Category','Severity','Weight','Confidence','AppLovin']
    },
    zh: {
      title: '浏览器完整性检测器',
      sub: '参考 AppLovin 思路的浏览器 Integrity / Anti-Fraud Benchmark · 仅客户端启发式判断',
      howTitle: '这个页面怎么用',
      steps: [
        ['第 1 步', '在目标环境中打开页面', '用你想测试的真实浏览器、自动化框架、指纹浏览器、虚拟机、云手机或设备打开这个页面。'],
        ['第 2 步', '自然操作几秒钟', '移动鼠标、滚动或点击几下，让 Behavior 类信号有足够的观察时间。'],
        ['第 3 步', '运行检测并查看命中项', '重点看哪些 Detector 同时被命中。最终 Risk Score 只是为了方便横向比较的汇总分。'],
        ['第 4 步', '截图或导出 JSON', '用「截图模式」生成更干净的对比截图；需要详细分析时用「复制 JSON」。']
      ],
      note: '注意：FLAG 只表示观察到了可疑证据，并不等于“确定作弊”。验证准确率时，建议用同一个 Collector 版本，同时测试正常浏览器和已知的自动化 / Spoofing 环境，再比较命中组合。',
      shot: '截图模式', exitShot: '退出截图模式', copy: '复制 JSON', copied: '已复制', run: '重新检测', scanning: '检测中…',
      summary: '完整性结果摘要', flags: '异常信号数', total: '总信号数', max: '最高风险等级', weight: '启发式权重', env: '运行环境', suspicious: '可疑信号', quick: '关键证据', all: '全部检测项', raw: '原始 Integrity JSON',
      footer: 'FLAG 表示异常证据，不等于作弊结论。生产环境应结合服务端请求、IP/ASN、代理/VPN、重放、会话历史、Identity 和事件序列等信号做最终判断。',
      noSuspicious: '未检测到明显的客户端异常信号。', waiting: '等待检测…',
      headers: ['状态','检测项','分类','风险等级','权重','置信度','AppLovin']
    }
  };

  const titles = {
    'Automation framework markers': '自动化框架特征',
    'UA × platform consistency': 'UA × Platform 一致性',
    'Mobile UA × touch consistency': '移动端 UA × Touch 一致性',
    'Chromium UA × runtime': 'Chromium UA × Runtime 一致性',
    'Viewport × screen consistency': 'Viewport × Screen 一致性',
    'UA × WebGL consistency': 'UA × WebGL 一致性',
    'Native API surface tampering': '原生 API 篡改检测',
    'Synthetic interaction events': '合成交互事件',
    'Pointer timing regularity': '鼠标移动时间规律性',
    'Navigator / software environment': 'Navigator / 软件环境',
    'Screen / display / orientation': '屏幕 / 显示 / 方向',
    'Network capability': '网络能力',
    'Locale / timezone': 'Locale / 时区',
    'Page / iframe context': '页面 / Iframe 上下文',
    'Canvas rendering evidence': 'Canvas 渲染证据',
    'WebGL rendering environment': 'WebGL 渲染环境',
    'Storage capability': 'Storage 能力',
    'Audio capability': 'Audio 能力',
    'Navigation / timing': '页面 Navigation / Timing'
  };
  const reverseTitles = Object.fromEntries(Object.entries(titles).map(([a,b]) => [b,a]));
  const cats = {automation:'自动化',consistency:'一致性',rendering:'渲染',tamper:'篡改',behavior:'行为',environment:'环境'};
  const reverseCats = Object.fromEntries(Object.entries(cats).map(([a,b]) => [b,a]));

  const style = document.createElement('style');
  style.textContent = `
    .bi-lang{display:flex;border:1px solid var(--border);border-radius:9px;overflow:hidden;background:#fff}
    .bi-lang button{border:0;background:transparent;padding:9px 11px;font-weight:700;color:var(--muted);cursor:pointer}
    .bi-lang button.active{background:#111827;color:#fff}
    .bi-howto{margin-bottom:18px}.bi-howgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .bi-step{background:var(--panel2);padding:13px;border-radius:10px;min-height:96px}.bi-stepno{font-size:10px;font-weight:800;color:#2563eb;letter-spacing:.04em}.bi-steptitle{font-size:13px;font-weight:750;margin-top:6px}.bi-stepdesc{font-size:11px;color:var(--muted);line-height:1.5;margin-top:5px}
    .bi-note{margin-top:12px;padding:11px 13px;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;color:#92400e;font-size:11px;line-height:1.55}
    body.shot .bi-howto{display:none}@media(max-width:1000px){.bi-howgrid{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.bi-howgrid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const actions = document.querySelector('.actions');
  if (actions && !document.getElementById('biLang')) {
    const switcher = document.createElement('div');
    switcher.className = 'bi-lang'; switcher.id = 'biLang';
    switcher.innerHTML = '<button type="button" id="biZh">中文</button><button type="button" id="biEn">EN</button>';
    actions.insertBefore(switcher, actions.firstChild);
    document.getElementById('biZh').addEventListener('click', () => { lang='zh'; apply(); });
    document.getElementById('biEn').addEventListener('click', () => { lang='en'; apply(); });
  }

  const status = document.getElementById('status');
  if (status && !document.getElementById('biHowto')) {
    const box = document.createElement('div');
    box.className = 'card bi-howto'; box.id = 'biHowto';
    status.parentNode.insertBefore(box, status);
  }

  function renderGuide() {
    const d = T[lang];
    const box = document.getElementById('biHowto'); if (!box) return;
    box.innerHTML = `<div class="section-title">${d.howTitle}</div><div class="bi-howgrid">${d.steps.map(s => `<div class="bi-step"><div class="bi-stepno">${s[0]}</div><div class="bi-steptitle">${s[1]}</div><div class="bi-stepdesc">${s[2]}</div></div>`).join('')}</div><div class="bi-note">${d.note}</div>`;
  }

  function setText(selector, value) { const el=document.querySelector(selector); if(el) el.textContent=value; }
  function translateTitle(text) { if(lang==='zh') return titles[text] || text; return reverseTitles[text] || text; }
  function translateCat(text) { const s=(text||'').trim().toLowerCase(); if(lang==='zh') return cats[s] || text; return reverseCats[text] || text; }

  function apply() {
    if (applying) return; applying=true;
    const d=T[lang]; document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    setText('.header h1',d.title); setText('.header .sub',d.sub);
    const shot=document.getElementById('shot'), copy=document.getElementById('copy'), run=document.getElementById('run');
    if(shot) shot.textContent=document.body.classList.contains('shot')?d.exitShot:d.shot;
    if(copy && !/Copied|已复制/.test(copy.textContent)) copy.textContent=d.copy;
    if(run && !/Scanning|检测中/.test(run.textContent)) run.textContent=d.run;
    const zhBtn=document.getElementById('biZh'), enBtn=document.getElementById('biEn'); if(zhBtn)zhBtn.classList.toggle('active',lang==='zh');if(enBtn)enBtn.classList.toggle('active',lang==='en');
    renderGuide();

    const cards=[...document.querySelectorAll('.card')];
    const byId=id=>document.getElementById(id)?.closest('.card');
    const summaryCard=document.getElementById('flags')?.closest('.card'); if(summaryCard){const st=summaryCard.querySelector('.section-title');if(st)st.textContent=d.summary; const labels=summaryCard.querySelectorAll('.label');[d.flags,d.total,d.max,d.weight].forEach((v,i)=>{if(labels[i])labels[i].textContent=v;});}
    const envCard=document.getElementById('env')?.closest('.card'); if(envCard?.querySelector('.section-title'))envCard.querySelector('.section-title').textContent=d.env;
    const susCard=document.getElementById('suspicious')?.closest('.card'); if(susCard?.querySelector('.section-title'))susCard.querySelector('.section-title').textContent=d.suspicious;
    const quickCard=document.getElementById('quick')?.closest('.card'); if(quickCard?.querySelector('.section-title'))quickCard.querySelector('.section-title').textContent=d.quick;
    const rows=document.getElementById('rows'); const allCard=rows?.closest('.card'); if(allCard?.querySelector('.section-title'))allCard.querySelector('.section-title').textContent=d.all;
    const summary=document.querySelector('details summary'); if(summary)summary.textContent=d.raw;
    const footer=document.querySelector('.footer');if(footer)footer.textContent=d.footer;
    document.querySelectorAll('thead th').forEach((th,i)=>{if(d.headers[i])th.textContent=d.headers[i];});

    document.querySelectorAll('.sig-title').forEach(el=>el.textContent=translateTitle(el.textContent));
    document.querySelectorAll('#rows td:nth-child(2) strong').forEach(el=>el.textContent=translateTitle(el.textContent));
    document.querySelectorAll('.catname').forEach(el=>el.textContent=translateCat(el.textContent));
    document.querySelectorAll('.pill').forEach(el=>{const flagged=el.classList.contains('flag'); el.textContent=lang==='zh'?(flagged?'异常':'正常'):(flagged?'FLAG':'OK');});
    document.querySelectorAll('.empty').forEach(el=>{if(/No suspicious|未检测到明显/.test(el.textContent))el.textContent=d.noSuspicious;else if(/Waiting for scan|等待检测/.test(el.textContent))el.textContent=d.waiting;});
    applying=false;
  }

  let timer=null;
  const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,30);});
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  apply();
})();
