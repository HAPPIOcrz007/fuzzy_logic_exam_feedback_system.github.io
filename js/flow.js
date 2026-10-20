(function(F){
const N=(id,c,x,y,w,h,t)=>({id,c,x,y,w,h,t});
F.nodes=[N('teacher','in',20,30,190,95,'Teacher input'),N('norm','pr',240,30,190,95,'Normalise teacher'),
N('students','in',20,330,190,95,'students.csv'),N('sproc','pr',240,330,190,95,'studentProcess'),
N('fuzzy','pr',470,180,220,100,'fuzzyDifficulty (Mamdani)'),N('results','out',730,30,200,90,'results.csv'),
N('plot','pr',470,420,220,90,'plotResults (stats)'),N('summary','out',730,170,200,100,'Summary verdict'),
N('fig1','out',730,290,200,135,'Figure 1 · per student'),N('fig2','out',730,440,200,135,'Figure 2 · distribution')];
F.edges=[['teacher','norm'],['norm','fuzzy'],['students','sproc'],['sproc','fuzzy'],['fuzzy','results'],['fuzzy','plot','v'],['plot','summary'],['plot','fig1'],['plot','fig2']];
const $=id=>document.getElementById('n-'+id);
F.buildFlow=function(stage,onSel){const by={};F.nodes.forEach(n=>by[n.id]=n);
let p='';F.edges.forEach(([a,b,m])=>{a=by[a];b=by[b];let d;
if(m){const x=a.x+a.w/2,y1=a.y+a.h,y2=b.y;d=`M${x} ${y1}C${x} ${y1+40} ${x} ${y2-40} ${x} ${y2}`}
else{const x1=a.x+a.w,y1=a.y+a.h/2,x2=b.x,y2=b.y+b.h/2;d=`M${x1} ${y1}C${x1+50} ${y1} ${x2-50} ${y2} ${x2} ${y2}`}p+=`<path d="${d}"/>`});
stage.innerHTML=`<svg id="edges" width="980" height="600">${p}</svg>`;
F.nodes.forEach(n=>{const d=document.createElement('div');d.id='n-'+n.id;d.className='node '+n.c;
d.style.cssText=`left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px`;
d.innerHTML=`<i class="led g"></i><b>${n.t}</b><div class="sub"></div><div class="thumb"></div>`;d.onclick=()=>onSel(n.id);stage.appendChild(d)});};
F.select=id=>{document.querySelectorAll('.node').forEach(e=>e.classList.remove('sel'));$(id).classList.add('sel')};
F.updateFlow=function(R,S,drop){const set=(id,sub,led,th)=>{const e=$(id);e.querySelector('.sub').textContent=sub;e.querySelector('.led').className='led '+led;if(th!==undefined)e.querySelector('.thumb').innerHTML=th};
const f=v=>v.toFixed(1);
set('teacher',`C ${S.t[0]} · B ${S.t[1]} · T ${S.t[2]}`,'g');
set('norm',`→ ${R.tn.map(f).join(' / ')}`,'g');
set('students',`${S.file} · ${R.N} students`,R.N?'g':'r');
set('sproc',`scale [${R.scale.map(f).join(' ')}]${drop?` · dropped ${drop}`:''}`,drop?'y':'g');
set('fuzzy',`teacher → ${f(R.teacher)} (${F.label(R.teacher)})`,'g');
set('results',`${R.N+1} rows written`,R.N?'g':'r');
set('plot','mean '+f(R.m)+' · σ '+f(R.sd),'g');
set('summary',`gap ${R.gap>=0?'+':''}${f(R.gap)} · ${R.verdict}`,R.cls);
set('fig1',`bars + IQR band`,'g',F.fig1(R,false));set('fig2','histogram','g',F.fig2(R,false));};
})(window.FER=window.FER||{});
