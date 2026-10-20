(function(F){
// Ruspini input sets (always sum to 1) and trapezoid output sets
const IN=[[0,0,50],[0,50,100],[50,100,100]],OUT=[[0,0,10,40],[30,45,55,70],[60,90,100,100]],xs=[];for(let x=0;x<=100;x+=0.5)xs.push(x);
const mf=(x,p)=>{if(p.length<4)p=[p[0],p[1],p[1],p[2]];const[a,b,c,d]=p;return Math.max(Math.min(b>a?(x-a)/(b-a):1,1,d>c?(d-x)/(d-c):1),0)},clip=v=>Math.min(Math.max(v,0),100);
const outMF=OUT.map(p=>xs.map(x=>mf(x,p)));
F.fuzzy=function(c,b,t){c=clip(c);b=clip(b);t=clip(t);
const mc=IN.map(p=>mf(c,p)),mb=IN.map(p=>mf(b,p)),mt=IN.map(p=>mf(t,p)),w=[0,0,0];
for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++){const s=i+(2-j)+k,o=s<=2?0:s==3?1:2;w[o]=Math.max(w[o],Math.min(mc[i],mb[j],mt[k]));}
let n=0,d=0;const agg=xs.map((x,m)=>{const v=Math.max(Math.min(w[0],outMF[0][m]),Math.min(w[1],outMF[1][m]),Math.min(w[2],outMF[2][m]));n+=x*v;d+=v;return v});
return{y:d>0?n/d:50,w,agg,mc,mb,mt,c,b,t};};
F.xs=xs;F.clip=clip;F.mf=mf;F.IN=IN;F.OUT=OUT;
F.process=function(raw){const scale=[0,1,2].map(k=>Math.max(100,...raw.map(r=>r[k])));
return{scale,norm:raw.map(r=>r.map((v,k)=>v*100/scale[k]))};};
const pct=(s,p)=>{const q=1+(s.length-1)*p,lo=Math.floor(q),hi=Math.ceil(q);return s[lo-1]+(q-lo)*(s[hi-1]-s[lo-1])};
F.label=v=>v<35?'Easy':v<65?'Moderate':'Difficult';
F.run=function(S){const sp=F.process(S.students.raw);
const tn=S.t.map(v=>clip(v)),T=F.fuzzy(...tn),rs=sp.norm.map(r=>F.fuzzy(...r)),ys=rs.map(r=>r.y),N=ys.length;
const s=[...ys].sort((a,b)=>a-b),m=ys.reduce((a,b)=>a+b,0)/N,med=pct(s,.5),sd=Math.sqrt(ys.reduce((a,v)=>a+(v-m)**2,0)/Math.max(N-1,1));
const gap=m-T.y,cls=gap>10?'r':gap<-10?'y':'g',verdict=gap>10?'HARDER than the teacher expected':gap<-10?'EASIER than the teacher expected':'about AS EXPECTED';
return{N,names:S.students.names,ys,rs,teacher:T.y,T,tn,scale:sp.scale,m,med,sd,q1:pct(s,.25),q3:pct(s,.75),min:s[0],max:s[N-1],gap,cls,verdict,
counts:[ys.filter(v=>v<35).length,ys.filter(v=>v>=35&&v<65).length,ys.filter(v=>v>=65).length]};};
})(window.FER=window.FER||{});
