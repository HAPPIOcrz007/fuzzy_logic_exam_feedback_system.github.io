(function(F){
// Writes per-student Mamdani SVGs into results/. Sink = node server.js (automatic) or a folder you pick (Chrome/Edge).
const $=s=>document.querySelector(s),pad=n=>String(n).padStart(3,'0');
let sink=null,tok=0,tm,q=Promise.resolve();
const post=async(u,b)=>{const r=await fetch(u,{method:'POST',body:b});if(!r.ok)throw 0};
const server={clear:()=>post('/api/clear'),write:(n,t)=>post('/api/save?name='+encodeURIComponent(n),t)};
function folder(d){let rd;return{async clear(){rd=await d.getDirectoryHandle('results',{create:true});const ks=[];for await(const k of rd.keys())ks.push(k);for(const k of ks)await rd.removeEntry(k,{recursive:true})},
async write(n,t){const w=await(await rd.getFileHandle(n,{create:true})).createWritable();await w.write(t);await w.close()}}}
const ui=(p,t)=>{$('#prog i').style.width=p+'%';$('#prog span').textContent=t};
async function run(R,my){if(my!==tok)return;
const files=[['teacher.svg',()=>F.studentSvg(R,-1)],...R.names.map((n,i)=>[`student_${pad(i+1)}_${n.replace(/\W+/g,'_')}.svg`,()=>F.studentSvg(R,i)]),['fig1_per_student.svg',()=>F.fig1(R,true)],['fig2_distribution.svg',()=>F.fig2(R,true)],['results.csv',()=>F.resultsCsv(R)]];
try{ui(0,'Emptying results/ …');await sink.clear();
for(let i=0;i<files.length;i++){if(my!==tok)return;await sink.write(files[i][0],files[i][1]());ui(100*(i+1)/files.length,`Building results/ ${i+1}/${files.length} – please wait`);if(i%8==7)await new Promise(r=>setTimeout(r))}
ui(100,`✔ ${files.length} files saved in results/`)}catch(e){ui(0,'⚠ could not write results/')}}
F.results={schedule(R){F.cur=R;clearTimeout(tm);const my=++tok;
if(!sink){ui(0,'Click 📁 Results folder (or run node server.js)');return}
ui(0,'Change detected – rebuilding results/ …');tm=setTimeout(()=>{q=q.then(()=>run(R,my))},400)}};
$('#pick').onclick=async()=>{try{sink=folder(await showDirectoryPicker({mode:'readwrite'}));F.results.schedule(F.cur)}catch(e){}};
fetch('/api/ping').then(r=>r.ok&&r.text()).then(t=>{if(t==='ok'){sink=server;$('#pick').hidden=true;F.results.schedule(F.cur)}}).catch(()=>{});
})(window.FER=window.FER||{});
