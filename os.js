const $=(s,e=document)=>e.querySelector(s),H=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const K='goldengate-os-v1',VER='macOS Golden Gate 27.2.1';
let S={th:'dark',t:.4,wall:0,open:null,fs:null};
try{Object.assign(S,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const D=(n,c)=>({n,d:1,c}),F=(n,x)=>({n,x});
if(!S.fs)S.fs=D('you',[D('Desktop',[]),D('Documents',[F('Welcome.txt','Welcome to '+VER+' on the web.\n\nYour files, settings and open apps are saved in this browser.')]),D('Downloads',[]),D('Pictures',[]),D('Music',[])]);
const W=[['Golden Gate Day','linear-gradient(#5aa9e6,#bcdcf2 55%,#f6e3c8)','#c1452f'],['Golden Gate Dusk','linear-gradient(#2b2a6b,#c4527a 50%,#ffb26b)','#7a2418'],['Golden Gate Night','linear-gradient(#050816,#14224a 60%,#3a3f6b)','#2a1210']];
function apply(){const r=document.documentElement;r.dataset.th=S.th;r.style.setProperty('--t',S.t);const w=W[S.wall]||W[0];$('#wall').style.background=w[1];r.style.setProperty('--br',w[2])}
/* ---------- windows ---------- */
let Z=10,wins=[],cur=null;
function win(app,w,h,title){
 const e=H('div','win gl');e.style.cssText=`width:${w}px;height:${h}px;left:${90+wins.length%6*30}px;top:${70+wins.length%6*26}px`;
 e.innerHTML='<div class="ct"></div><div class="tb" data-drag><div class="tl"><i class="x"></i><i class="m"></i><i class="z"></i></div></div><b class="rz"></b>';
 const o={e,app,title,ct:$('.ct',e)};
 o.min=()=>{e.classList.add('min');if(cur===o)foc(wins.filter(x=>!x.e.classList.contains('min')).pop())};
 o.unmin=()=>{e.classList.remove('min');foc(o)};
 o.zoom=()=>e.classList.toggle('max');
 o.close=()=>{e.remove();wins=wins.filter(x=>x!==o);if(cur===o)cur=null;foc(wins.filter(x=>!x.e.classList.contains('min')).pop());sync()};
 $('.x',e).onclick=o.close;$('.m',e).onclick=o.min;$('.z',e).onclick=o.zoom;
 wins.push(o);$('#desk').append(e);foc(o);sync();return o}
function foc(o){cur=o||null;wins.forEach(x=>x.e.classList.toggle('foc',x===o));if(o)o.e.style.zIndex=++Z;$('#an').textContent=o?(A[o.app]?A[o.app].n:o.title):'Finder';dots()}
function sync(){S.open=[...new Set(wins.map(w=>w.app).filter(a=>A[a]))];save();dots()}
function dots(){document.querySelectorAll('.dk').forEach(d=>d.classList.toggle('on',wins.some(w=>w.app===d.dataset.a)))}
addEventListener('pointerdown',ev=>{const t=ev.target,w=t.closest('.win');if(!w)return;const o=wins.find(x=>x.e===w);if(o&&cur!==o)foc(o);
 const dg=t.closest('[data-drag]'),rz=t.closest('.rz');if(t.closest('button,input,.tl')||(!dg&&!rz)||w.classList.contains('max'))return;
 const r=w.getBoundingClientRect(),sx=ev.clientX,sy=ev.clientY;
 const mv=m=>{if(rz){w.style.width=Math.max(320,r.width+m.clientX-sx)+'px';w.style.height=Math.max(220,r.height+m.clientY-sy)+'px'}else{w.style.left=r.left+m.clientX-sx+'px';w.style.top=Math.max(26,r.top+m.clientY-sy)+'px'}};
 const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)});
/* ---------- apps ---------- */
const A={finder:{n:'Finder',c:'#5cb8ff,#1f6feb',g:'F',open:finder},settings:{n:'System Settings',c:'#a3a3a8,#55565c',g:'⚙',open:settings}};
function open(id,nw){const ws=wins.filter(w=>w.app===id);if(ws.length&&!nw){const w=ws[ws.length-1];return w.e.classList.contains('min')?w.unmin():foc(w)}A[id].open()}
function viewer(f){const w=win('viewer',480,320,f.n);w.ct.innerHTML='<pre></pre>';$('pre',w.ct).textContent=f.x}
function finder(){
 const w=win('finder',740,460,'Finder');let p=[],sel='';
 const node=()=>p.reduce((n,x)=>n.c.find(c=>c.n===x),S.fs);
 const render=()=>{const n=node();
  w.ct.innerHTML=`<div class="fnd"><div class="sb"><small>Favorites</small><div class="si ${p.length?'':'on'}" data-p="">Home</div>${S.fs.c.filter(c=>c.d).map(c=>`<div class="si ${p[0]===c.n?'on':''}" data-p="${c.n}">${c.n}</div>`).join('')}</div>
  <div class="mn"><div class="bar" data-drag><button class="btn" id="bk" ${p.length?'':'disabled'}>‹</button><span>${n.n}</span><span class="sp" style="flex:1"></span><button class="btn" id="nf">New Folder</button></div>
  <div class="gr">${n.c.length?n.c.map(c=>`<div class="it ${sel===c.n?'sel':''}" data-n="${c.n}"><div class="ic ${c.d?'':'f'}"></div>${c.n}</div>`).join(''):'<p style="opacity:.5;grid-column:1/-1">This folder is empty.</p>'}</div></div></div>`};
 w.ct.onclick=e=>{const s=e.target.closest('.si'),i=e.target.closest('.it');
  if(s){p=s.dataset.p?[s.dataset.p]:[];sel=''}else if(i)sel=i.dataset.n;else if(e.target.closest('#bk'))p.pop();
  else if(e.target.closest('#nf')){const n=prompt('Folder name','untitled folder'),c=node().c;if(n&&!c.some(x=>x.n===n)){c.push(D(n,[]));save()}}else return;render()};
 w.ct.ondblclick=e=>{const i=e.target.closest('.it');if(!i)return;const c=node().c.find(x=>x.n===i.dataset.n);if(c.d){p.push(c.n);sel='';render()}else viewer(c)};
 render()}
function settings(){
 const w=win('settings',720,440,'System Settings');let pane='Appearance';
 const P={Appearance:()=>`<h3>Appearance</h3><button class="btn ${S.th=='light'?'on':''}" data-th="light">Light</button> <button class="btn ${S.th=='dark'?'on':''}" data-th="dark">Dark</button><h3>Liquid Glass</h3>Clear <input type="range" id="gt" min="0" max="1" step=".01" value="${S.t}"> Tinted`,
  Wallpaper:()=>`<h3>Wallpaper</h3><div class="wp">${W.map((x,i)=>`<div class="wt ${S.wall==i?'on':''}" data-w="${i}" style="background:${x[1]}">${x[0]}</div>`).join('')}</div>`,
  General:()=>`<h3>About</h3><p>${VER}<br>Your files, settings and open apps are saved in this browser.</p><button class="btn" id="rs">Reset everything…</button>`};
 const render=()=>{w.ct.innerHTML=`<div class="fnd"><div class="sb"><small>System Settings</small>${Object.keys(P).map(k=>`<div class="si ${k==pane?'on':''}" data-k="${k}">${k}</div>`).join('')}</div><div class="pn" data-drag>${P[pane]()}</div></div>`;
  const g=$('#gt',w.ct);if(g)g.oninput=()=>{S.t=+g.value;apply();save()}};
 w.ct.onclick=e=>{const t=e.target,k=t.closest('[data-k]'),th=t.closest('[data-th]'),wp=t.closest('[data-w]');
  if(k)pane=k.dataset.k;else if(th)S.th=th.dataset.th;else if(wp)S.wall=+wp.dataset.w;else if(t.id=='rs')return reset();else return;apply();save();render()};
 render()}
function about(){const w=win('about',360,260,'About');w.ct.innerHTML=`<div class="ab"><h2>${VER}</h2><span>Web recreation, in progress</span><span style="opacity:.6">Stage 1 of 7</span></div>`}
function reset(){if(confirm('Erase all saved data and restart?')){try{localStorage.removeItem(K)}catch(e){}location.reload()}}
/* ---------- menu bar, dock ---------- */
const mb=$('#mb');
mb.innerHTML='<div class="mi" data-m="ap"><svg width="14" height="16" viewBox="0 0 14 16"><path fill="currentColor" d="M7 4.2C6 3 3 3 1.8 5.600.6 8.300 2.600 14 5 14c.9 0 1-.5 2-.5s1.100.5 2 .5c1.700 0 3.700-3.100 3.800-4.100-2.100-1-2.300-3.900 0-4.900-1.300-1.600-3.700-1.300-4.800-.3zM7.500 3c.1-1.300 1.100-2.300 2.300-2.600.1 1.300-.9 2.600-2.300 2.600z"/></svg></div><div class="mi" id="an" data-m="an" style="font-weight:700">Finder</div><div class="mi" data-m="File">File</div><div class="mi" data-m="Window">Window</div><div class="mi" data-m="Help">Help</div><div class="sp"></div><div class="mi" id="clk"></div>';
const M={ap:()=>[['About This Mac',about],['System Settings…',()=>open('settings')],'-',['Reset everything…',reset]],
 an:()=>[['About '+$('#an').textContent,about],'-',['Quit '+$('#an').textContent,()=>cur&&wins.filter(w=>w.app===cur.app).forEach(w=>w.close())]],
 File:()=>[['New Finder Window',()=>open('finder',1)],['Close Window',()=>cur&&cur.close()]],
 Window:()=>[['Minimize',()=>cur&&cur.min()],['Zoom',()=>cur&&cur.zoom()]],
 Help:()=>[[VER+' (web recreation)',()=>{}]]};
const closeM=()=>{$('.dd')?.remove();document.querySelectorAll('.mi.on').forEach(x=>x.classList.remove('on'))};
mb.onclick=e=>{const m=e.target.closest('[data-m]');if(!m)return;const was=m.classList.contains('on');closeM();if(was)return;m.classList.add('on');
 const d=H('div','dd gl');M[m.dataset.m]().forEach(i=>{if(i==='-')d.append(H('hr'));else{const x=H('div','di',i[0]);x.onclick=()=>{closeM();i[1]()};d.append(x)}});
 d.style.left=m.getBoundingClientRect().left+'px';d.style.top='28px';document.body.append(d)};
addEventListener('pointerdown',e=>{if(!e.target.closest('.dd,.mi'))closeM()});
const dock=$('#dock');
Object.keys(A).forEach(id=>{const d=H('div','dk',A[id].g);d.dataset.a=id;d.title=A[id].n;d.style.background=`linear-gradient(${A[id].c})`;d.onclick=()=>open(id);dock.append(d)});
dock.onmousemove=e=>[...dock.children].forEach(c=>{const r=c.getBoundingClientRect();c.style.transform=`scale(${1+.55*Math.max(0,1-Math.abs(e.clientX-r.left-r.width/2)/120)})`});
dock.onmouseleave=()=>[...dock.children].forEach(c=>c.style.transform='');
const tick=()=>$('#clk').textContent=new Date().toLocaleString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).replace(/,/g,'');
tick();setInterval(tick,15000);
apply();(S.open&&S.open.length?S.open:['finder']).forEach(a=>A[a]&&A[a].open());
