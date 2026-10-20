(function(F){
const $=s=>document.querySelector(s),f=v=>v.toFixed(2);
const S={sc:0,t:[],students:null,file:'',drop:0,sel:'teacher'};let R;
const names=['Complexity','Breadth','Time'];
function dl(n,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=n;a.click()}
function load(i){const s=F.scenarios[i];S.sc=i;S.t=s.t.slice();S.students=F.gen(s);S.file='students'+(i+1)+'.csv';S.drop=0}
function custom(){S.sc='custom'}
function renderList(){$('#slist').innerHTML=F.scenarios.map((s,i)=>`<li data-i="${i}" class="${S.sc===i?'on':''}">${i+1}. ${s.name}</li>`).join('')+`<li class="${S.sc==='custom'?'on':''}">✎ Custom</li>`;
document.querySelectorAll('#slist li[data-i]').forEach(li=>li.onclick=()=>{load(+li.dataset.i);refresh()})}
function live(){R=F.run(S);F.updateFlow(R,S,S.drop);renderList();F.results.schedule(R)}
function refresh(){live();panel(S.sel)}
function codePanel(k){const c=F.code[k];return`<h3>${c.title}</h3><p>${c.desc}</p><pre>${c.code}</pre>`}
function panel(id){S.sel=id;F.select(id);let h='';
if(id==='teacher'){h=`<h3>Teacher input</h3><p>Pilot values on a 0-100 scale. <b>Breadth is inverse</b> (wide coverage = easier), so Complexity 100 / Breadth 0 / Time 100 is the hardest paper. Editing switches to <b>Custom</b> and reruns.</p>`+
names.map((n,i)=>`<div class="row"><label>${n}</label><input type="range" min="0" max="100" value="${S.t[i]}" data-i="${i}"><b id="tv${i}">${S.t[i]}</b></div>`).join('')+
`<h4>Teacher difficulty</h4><div class="big" id="ts"></div>`}
else if(id==='students'){const sr=S.students.raw.slice(0,8);h=`<h3>${S.file}</h3><p>${R.N} students · name, complexity, breadth, time. Any class size is accepted.</p>
<label class="btn">＋ Add students.csv<input type="file" id="up" accept=".csv" hidden></label>
<table><tr><th>#</th><th>Name</th><th>C</th><th>B</th><th>T</th></tr>${sr.map((r,i)=>`<tr><td>${i+1}</td><td>${S.students.names[i]}</td><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table><p>…first 8 of ${R.N}</p>`}
else if(F.code[id]){h=codePanel(id);
if(id==='fuzzy'){const w=R.T.w,cl=['#62f0b0','#ffd166','#ff6b81'];h+=`<h4>Live · teacher rule firing</h4>`+['Easy','Moderate','Difficult'].map((n,i)=>`<div>${n} ${w[i].toFixed(2)}<div class="bar" style="width:${w[i]*100}%;background:${cl[i]}"></div></div>`).join('')+`<h4>Aggregated output · centroid ${f(R.teacher)}</h4>`+F.aggSvg(R)}
if(id==='norm')h+=`<p class="mono">scale = [${R.scale.map(f).join(', ')}]\nnormalised = [${R.tn.map(f).join(', ')}]</p>`;
if(id==='plot')h+=`<p class="mono">${summary()}</p>`}
else if(id==='results'){h=`<h3>results.csv</h3><p>Teacher on top, then every student. Per-student Mamdani SVGs are written to <b>results/</b> and rebuilt after every change.</p><button id="dc">⬇ Download results.csv</button><table><tr><th>Role</th><th>Name</th><th>Diff</th></tr><tr><td>Teacher</td><td>Pilot</td><td>${f(R.teacher)}</td></tr>${R.ys.slice(0,10).map((v,i)=>`<tr><td>Student</td><td>${i+1}. ${R.names[i]}</td><td>${f(v)}</td></tr>`).join('')}</table>`}
else if(id==='summary'){h=`<h3>Summary</h3><p>Status: <i class="led ${R.cls}" style="position:static;display:inline-block"></i> ${R.cls==='g'?'green · as expected':R.cls==='y'?'yellow · easier than expected':'red · harder than expected'}</p><p class="mono">${summary()}</p>`}
else{const fg=id==='fig1'?F.fig1(R,true):F.fig2(R,true);h=`<h3>${id==='fig1'?'Difficulty per student':'Difficulty distribution'}</h3>${fg}<p><button id="ex">⤢ Explore interactive chart</button> <button id="ds">⬇ SVG</button></p>`}
$('#info').innerHTML=h;
const tsEl=$('#ts');if(tsEl)tsEl.textContent=f(R.teacher)+' / 100 · '+F.label(R.teacher);
document.querySelectorAll('#info input[type=range]').forEach(r=>r.oninput=()=>{S.t[+r.dataset.i]=+r.value;custom();$('#tv'+r.dataset.i).textContent=r.value;live();$('#ts').textContent=f(R.teacher)+' / 100 · '+F.label(R.teacher)});
if($('#up'))$('#up').onchange=e=>{const fl=e.target.files[0];if(!fl)return;fl.text().then(t=>{const p=F.parseCsv(t);if(!p.names.length){alert('No valid rows: need name,complexity,breadth,time');return}S.students=p;S.file=fl.name;S.drop=p.dropped;custom();refresh()})};
if($('#dc'))$('#dc').onclick=()=>dl('results.csv',F.resultsCsv(R),'text/csv');
if($('#ex'))$('#ex').onclick=()=>F.chart.open(id,R);
if($('#ds'))$('#ds').onclick=()=>dl(id+'.svg',(id==='fig1'?F.fig1:F.fig2)(R,true),'image/svg+xml')}
function summary(){return`Teacher estimate : ${f(R.teacher)} (${F.label(R.teacher)})\nStudent mean     : ${f(R.m)} (${F.label(R.m)})\nMedian / Std dev : ${f(R.med)} / ${f(R.sd)}\nIQR (middle 50%) : ${f(R.q1)} to ${f(R.q3)}\nMin / Max        : ${f(R.min)} / ${f(R.max)}\nGap              : ${R.gap>=0?'+':''}${f(R.gap)} → ${R.verdict}\nEasy ${R.counts[0]} | Moderate ${R.counts[1]} | Difficult ${R.counts[2]}`}
$('#exp').onclick=async()=>{const keep=JSON.parse(JSON.stringify(S));for(let i=0;i<F.scenarios.length;i++){load(i);const r=F.run(S),p='results_s'+String(i+1).padStart(2,'0')+'_';
dl(p+'results.csv',F.resultsCsv(r),'text/csv');dl(p+'fig1.svg',F.fig1(r,true),'image/svg+xml');dl(p+'fig2.svg',F.fig2(r,true),'image/svg+xml');await new Promise(z=>setTimeout(z,500))}
Object.assign(S,keep);refresh()};
F.buildFlow($('#stage'),id=>{panel(id);if(id==='fig1'||id==='fig2')F.chart.open(id,R)});load(0);refresh();
})(window.FER=window.FER||{});
