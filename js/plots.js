(function(F){
const col=v=>v<35?'#62f0b0':v<65?'#ffd166':'#ff6b81',BG='<rect width="100%" height="100%" fill="#0f1220"/>';
const wrap=(W,H,b)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="sans-serif">${BG}${b}</svg>`;
function lines(R,x0,x1,Y,X,full){let s=`<line x1="${x0}" x2="${x1}" y1="${Y(R.teacher)}" y2="${Y(R.teacher)}" stroke="#5ee0ff" stroke-width="2"/><line x1="${x0}" x2="${x1}" y1="${Y(R.m)}" y2="${Y(R.m)}" stroke="#b388ff" stroke-width="1.5" stroke-dasharray="5 4"/>`;
if(full)s+=`<text x="${x1-4}" y="${Y(R.teacher)-4}" text-anchor="end" fill="#5ee0ff" font-size="11">Teacher ${R.teacher.toFixed(1)}</text><text x="${x1-4}" y="${Y(R.m)+12}" text-anchor="end" fill="#b388ff" font-size="11">Mean ${R.m.toFixed(1)}</text>`;return s}
F.fig1=function(R,full){const W=full?900:300,H=full?440:110,L=full?38:4,T=full?14:4,B=full?118:4,w=W-L-4,h=H-T-B,Y=v=>T+h*(1-v/100),bw=w/R.N;
let s=`<rect x="${L}" width="${w}" y="${Y(R.q3)}" height="${Y(R.q1)-Y(R.q3)}" fill="#b388ff" opacity=".15"/>`;
R.ys.forEach((v,i)=>s+=`<rect x="${L+i*bw+bw*.1}" y="${Y(v)}" width="${bw*.8}" height="${Y(0)-Y(v)}" fill="${col(v)}" opacity=".85"/>`);
if(full){[0,25,50,75,100].forEach(g=>s+=`<line x1="${L}" x2="${W-4}" y1="${Y(g)}" y2="${Y(g)}" stroke="#2a3057"/><text x="${L-5}" y="${Y(g)+4}" text-anchor="end" fill="#8b93b8" font-size="10">${g}</text>`);
const st=Math.max(1,Math.ceil(R.N/40));R.names.forEach((n,i)=>{if(i%st==0)s+=`<text transform="translate(${L+i*bw+bw/2+3},${Y(0)+6}) rotate(90)" fill="#8b93b8" font-size="8">${i+1}. ${n}</text>`})}
return wrap(W,H,s+lines(R,L,W-4,Y,0,full))};
F.fig2=function(R,full){const W=full?700:300,H=full?380:110,L=full?40:4,T=full?14:4,B=full?36:4,w=W-L-6,h=H-T-B,X=v=>L+w*v/100;
const bins=Array(10).fill(0);R.ys.forEach(v=>bins[Math.min(9,Math.floor(v/10))]++);const mx=Math.max(...bins,1),Y=c=>T+h*(1-c/mx);
let s=`<rect x="${X(R.q1)}" width="${X(R.q3)-X(R.q1)}" y="${T}" height="${h}" fill="#b388ff" opacity=".15"/>`;
bins.forEach((c,i)=>s+=`<rect x="${X(i*10)+1}" y="${Y(c)}" width="${w/10-2}" height="${Y(0)-Y(c)}" fill="${col(i*10+5)}" opacity=".85"/>`+(full&&c?`<text x="${X(i*10)+w/20}" y="${Y(c)-3}" text-anchor="middle" fill="#d7dcf0" font-size="10">${c}</text>`:''));
if(full)for(let g=0;g<=100;g+=10)s+=`<text x="${X(g)}" y="${H-18}" text-anchor="middle" fill="#8b93b8" font-size="10">${g}</text>`+`<text x="${W/2}" y="${H-3}" text-anchor="middle" fill="#8b93b8" font-size="11">Difficulty score</text>`;
const vl=(v,c,d)=>`<line x1="${X(v)}" x2="${X(v)}" y1="${T}" y2="${T+h}" stroke="${c}" stroke-width="2" ${d?'stroke-dasharray="5 4"':''}/>`;
return wrap(W,H,s+vl(R.teacher,'#5ee0ff')+vl(R.m,'#b388ff',1))};
// fuzzy output shape for the teacher
F.aggSvg=function(R){const a=R.T.agg,W=300,H=90,pts=a.map((v,i)=>`${i/2*3},${H-4-v*(H-12)}`).join(' ');
return wrap(W,H,`<polygon points="0,${H-4} ${pts} ${W},${H-4}" fill="#b388ff" opacity=".5" stroke="#b388ff"/><line x1="${R.teacher*3}" x2="${R.teacher*3}" y1="0" y2="${H}" stroke="#5ee0ff" stroke-width="2"/>`)};

const esc=s=>String(s).replace(/[<&>]/g,''),IC=['#5ee0ff','#b388ff','#ffd166'],OC=['#62f0b0','#ffd166','#ff6b81'];
function pan(x,y,w,h,t,P,C,mu,v,agg,desc){const ix=x+14,iw=w-28,iy=y+30,ih=h-60,X=u=>ix+iw*u/100;
let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#171b2e" stroke="#2a3057"/><text x="${ix}" y="${y+19}" fill="#b388ff" font-size="13" font-weight="700">${t}</text><line x1="${ix}" x2="${ix+iw}" y1="${iy+ih}" y2="${iy+ih}" stroke="#2a3057"/>`;
s+=[0,25,50,75,100].map(g=>`<text x="${X(g)}" y="${iy+ih+14}" text-anchor="middle" fill="#8b93b8" font-size="10">${g}</text>`).join('');
if(agg)s+=`<polygon points="${X(0)},${iy+ih} ${F.xs.map((u,k)=>`${X(u)},${iy+ih*(1-agg[k])}`).join(' ')} ${X(100)},${iy+ih}" fill="#b388ff" opacity=".45"/>`;
P.forEach((p,k)=>s+=`<polyline fill="none" stroke="${C[k]}" stroke-width="2" points="${F.xs.filter((_,j)=>j%4==0).map(u=>`${X(u)},${iy+ih*(1-F.mf(u,p))}`).join(' ')}"/>`);
s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${iy}" y2="${iy+ih}" stroke="${agg?'#5ee0ff':'#fff'}" stroke-width="2" ${agg?'':'stroke-dasharray="4 3"'}/>`;
if(mu)mu.forEach((m,k)=>s+=m>0?`<circle cx="${X(v)}" cy="${iy+ih*(1-m)}" r="4" fill="${C[k]}"/>`:'');
return s+`<text x="${ix}" y="${y+h-8}" fill="#d7dcf0" font-size="11">${desc}</text>`}
F.studentSvg=function(R,i){const r=i<0?R.T:R.rs[i],nm=i<0?'Teacher (pilot)':`${i+1}. ${R.names[i]}`,LB=['Low','Medium','High'],OL=['Easy','Moderate','Difficult'];
let s=`<text x="20" y="30" fill="#5ee0ff" font-size="18" font-weight="700">${esc(nm)}</text><text x="880" y="30" text-anchor="end" fill="#d7dcf0" font-size="14">Mamdani difficulty ${r.y.toFixed(2)} · ${F.label(r.y)}</text>`;
[['Complexity',r.mc,r.c],['Breadth (inverse)',r.mb,r.b],['Time',r.mt,r.t]].forEach(([n,mu,v],k)=>s+=pan(20+k*290,50,270,190,`${n} = ${v.toFixed(1)}`,F.IN,IC,mu,v,null,LB.map((l,j)=>l+' '+mu[j].toFixed(2)).join(' · ')));
s+=pan(20,260,860,290,`Aggregated output → centroid ${r.y.toFixed(2)}`,F.OUT,OC,null,r.y,r.agg,OL.map((l,j)=>l+' strength '+r.w[j].toFixed(2)).join('   ·   '));
return wrap(900,570,s)};
})(window.FER=window.FER||{});
