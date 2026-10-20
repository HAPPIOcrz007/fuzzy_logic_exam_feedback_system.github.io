(function(F){
const $=s=>document.querySelector(s),col=v=>v<35?'#62f0b0':v<65?'#ffd166':'#ff6b81',esc=s=>String(s).replace(/[<&>]/g,''),
W=1000,H=500,L=48,T=14,PW=W-L-16;let st={};
const full=()=>st.id==='fig1'?st.R.N:100,minLen=()=>st.id==='fig1'?3:10,BM=()=>st.id==='fig1'?110:40;
function ctl(){const one=st.id==='fig1';$('#ctl').innerHTML=`<b>${one?'Difficulty per student':'Difficulty distribution'}</b><button data-a="in">＋</button><button data-a="out">－</button><button data-a="reset">Reset</button>`+
(one?`<select id="so"><option value="orig">Roll order</option><option value="asc">Easiest first</option><option value="desc">Hardest first</option></select>`:`<select id="bn"><option value="5">5-pt bins</option><option value="10" selected>10-pt bins</option><option value="20">20-pt bins</option></select>`)+
['t:Teacher','m:Mean','q:IQR'].map(x=>{const[k,n]=x.split(':');return`<label><input type="checkbox" data-h="${k}" checked> ${n}</label>`}).join('')+`<button data-a="dl">⬇ SVG</button><button data-a="x">✕</button>`}
function render(){const{id,R,x0,x1}=st,one=id==='fig1',PH=H-T-BM(),X=v=>L+PW*(v-x0)/(x1-x0);let mx=100,items,bins,s='';const Y=v=>T+PH*(1-v/mx);
if(one){items=R.ys.map((v,i)=>({v,i}));if(st.sort!=='orig')items.sort((a,b)=>st.sort==='asc'?a.v-b.v:b.v-a.v);st.items=items}
else{const n=100/st.bw;bins=Array.from({length:n},()=>[]);R.ys.forEach((v,i)=>bins[Math.min(n-1,Math.floor(v/st.bw))].push(i));st.bins=bins;mx=Math.max(...bins.map(b=>b.length),1)}
for(let g=0;g<=4;g++){const v=mx*g/4;s+=`<line x1="${L}" x2="${L+PW}" y1="${Y(v)}" y2="${Y(v)}" stroke="#2a3057"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" fill="#8b93b8" font-size="11">${Math.round(v)}</text>`}
s+=`<defs><clipPath id="cp"><rect x="${L}" y="0" width="${PW}" height="${H}"/></clipPath></defs><g clip-path="url(#cp)">`;
if(!st.hide.q)s+=one?`<rect x="${L}" width="${PW}" y="${Y(R.q3)}" height="${Y(R.q1)-Y(R.q3)}" fill="#b388ff" opacity=".15"/>`:`<rect x="${X(R.q1)}" width="${X(R.q3)-X(R.q1)}" y="${T}" height="${PH}" fill="#b388ff" opacity=".15"/>`;
if(one){const a=Math.max(0,Math.floor(x0)),b=Math.min(R.N,Math.ceil(x1)),bw=PW/(x1-x0),step=Math.max(1,Math.ceil((b-a)/45));
for(let k=a;k<b;k++){const v=items[k].v,h=st.hv===k;s+=`<rect x="${X(k)+bw*.1}" y="${Y(v)}" width="${bw*.8}" height="${Y(0)-Y(v)}" fill="${col(v)}" opacity="${h?1:.8}" ${h?'stroke="#fff"':''}/>`;
if((k-a)%step==0)s+=`<text transform="translate(${X(k)+bw/2+3},${Y(0)+6}) rotate(90)" fill="#8b93b8" font-size="${bw>14?10:8}">${items[k].i+1}. ${esc(R.names[items[k].i])}</text>`}}
else bins.forEach((b,i)=>{const bx=X(i*st.bw),bw=PW/(x1-x0)*st.bw,c=b.length,h=st.hv===i;s+=`<rect x="${bx+1}" y="${Y(c)}" width="${bw-2}" height="${Y(0)-Y(c)}" fill="${col(i*st.bw+st.bw/2)}" opacity="${h?1:.8}" ${h?'stroke="#fff"':''}/>`+(c?`<text x="${bx+bw/2}" y="${Y(c)-4}" text-anchor="middle" fill="#d7dcf0" font-size="11">${c}</text>`:'')});
const mk=(v,c,d,n,dy)=>one?`<line x1="${L}" x2="${L+PW}" y1="${Y(v)}" y2="${Y(v)}" stroke="${c}" stroke-width="2" ${d}/><text x="${L+PW-4}" y="${Y(v)-4+dy}" text-anchor="end" fill="${c}" font-size="12">${n} ${v.toFixed(1)}</text>`:`<line x1="${X(v)}" x2="${X(v)}" y1="${T}" y2="${T+PH}" stroke="${c}" stroke-width="2" ${d}/><text x="${X(v)+4}" y="${T+12+dy}" fill="${c}" font-size="12">${n} ${v.toFixed(1)}</text>`;
if(!st.hide.t)s+=mk(R.teacher,'#5ee0ff','','Teacher',0);if(!st.hide.m)s+=mk(R.m,'#b388ff','stroke-dasharray="5 4"','Mean',15);
s+='</g>';
if(!one){for(let v=Math.ceil(x0/10)*10;v<=x1;v+=10)s+=`<text x="${X(v)}" y="${H-20}" text-anchor="middle" fill="#8b93b8" font-size="11">${v}</text>`;s+=`<text x="${L+PW/2}" y="${H-4}" text-anchor="middle" fill="#8b93b8" font-size="12">Difficulty score (count of students on y)</text>`}
$('#csv').innerHTML=s}
const px=e=>{const r=$('#csv').getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]};
function setR(a,b){const f=full(),l=Math.max(minLen(),Math.min(b-a,f));a=Math.max(0,Math.min(a,f-l));st.x0=a;st.x1=a+l;render()}
function zoom(f,x){const{x0,x1}=st,a=x0+(x-L)/PW*(x1-x0),n=a-(a-x0)*f;setR(n,n+(x1-x0)*f)}
function hover(e){const[x,y]=px(e),{R,id,x0,x1}=st,t=$('#tip');let k=null,h='';
if(x>=L&&x<=L+PW&&y>=T&&y<=H-BM()){const v=x0+(x-L)/PW*(x1-x0);
if(id==='fig1'){const q=Math.floor(v),it=st.items[q];if(it){k=q;const d=it.v-R.teacher;h=`<b>${it.i+1}. ${esc(R.names[it.i])}</b><br>difficulty ${it.v.toFixed(2)} · ${F.label(it.v)}<br>vs teacher ${d>=0?'+':''}${d.toFixed(1)}`}}
else{const i=Math.floor(v/st.bw),b=st.bins[i];if(b){k=i;h=`<b>${i*st.bw}–${(i+1)*st.bw}</b> · ${b.length} students (${(100*b.length/R.N).toFixed(0)}%)<br>${b.slice(0,6).map(j=>esc(R.names[j])).join(', ')}${b.length>6?' …':''}`}}}
if(k!==st.hv){st.hv=k;render()}
t.style.display=h?'block':'none';if(h){t.innerHTML=h;const r=$('#cv').getBoundingClientRect();t.style.left=Math.min(e.clientX-r.left+14,r.width-240)+'px';t.style.top=(e.clientY-r.top+14)+'px'}}
F.chart={open(id,R){st={id,R,x0:0,sort:'orig',bw:10,hide:{},hv:null};st.x1=full();$('#modal').hidden=false;ctl();render()},close(){$('#modal').hidden=true;st={}}};
const cv=$('#cv');
cv.onmousemove=e=>{if(st.d){const x=px(e)[0],{a,b,s}=st.d,dv=(s-x)/PW*(b-a);setR(a+dv,b+dv)}else hover(e)};
cv.onmousedown=e=>{st.d={a:st.x0,b:st.x1,s:px(e)[0]}};
document.onmouseup=()=>{st.d=null};
cv.onmouseleave=()=>{if(!st.id)return;st.d=null;st.hv=null;$('#tip').style.display='none';render()};
cv.onwheel=e=>{e.preventDefault();zoom(e.deltaY>0?1.25:.8,px(e)[0])};
$('#ctl').onclick=e=>{const a=e.target.dataset.a;if(!a)return;
if(a==='in')zoom(.7,L+PW/2);if(a==='out')zoom(1.4,L+PW/2);if(a==='reset')setR(0,full());if(a==='x')F.chart.close();
if(a==='dl'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([(st.id==='fig1'?F.fig1:F.fig2)(st.R,true)],{type:'image/svg+xml'}));l.download=st.id+'.svg';l.click()}};
$('#ctl').onchange=e=>{const t=e.target;if(t.id==='so')st.sort=t.value;if(t.id==='bn')st.bw=+t.value;if(t.dataset.h)st.hide[t.dataset.h]=!t.checked;st.hv=null;render()};
$('#modal').onclick=e=>{if(e.target.id==='modal')F.chart.close()};
document.onkeydown=e=>{if(e.key==='Escape')F.chart.close()};
})(window.FER=window.FER||{});
