(function(F){
const FN=['Aarav','Diya','Vihaan','Anaya','Arjun','Isha','Kabir','Meera','Rohan','Saanvi','Aditya','Tara','Yash','Riya','Neel','Kiara','Dev','Pooja','Om','Sneha'];
const LN=['Sharma','Patil','Deshmukh','Kulkarni','Joshi','Rao','Iyer','Shah','Mehta','Nair','Gupta','Jadhav','More','Pawar','Kale','Bhat','Singh'];
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// t = teacher raw [complexity,breadth,time]; m = student means (0-100 scale); sd; u = unit multiplier per column; n = class size
F.scenarios=[
{name:'Balanced paper',n:100,t:[50,50,50],m:[50,50,50],sd:10,u:[1,1,1],seed:1},
{name:'Easy paper',n:100,t:[20,85,25],m:[25,80,30],sd:10,u:[1,1,1],seed:2},
{name:'Brutal paper',n:100,t:[90,15,90],m:[88,20,85],sd:8,u:[1,1,1],seed:3},
{name:'Teacher underestimates',n:80,t:[35,70,40],m:[75,35,80],sd:9,u:[1,1,1],seed:4},
{name:'Teacher overestimates',n:100,t:[80,30,75],m:[35,70,35],sd:9,u:[1,1,1],seed:5},
{name:'Time crunch',n:60,t:[50,60,60],m:[50,60,95],sd:6,u:[1,1,1],seed:6},
{name:'Off-syllabus questions',n:100,t:[60,70,50],m:[60,10,55],sd:8,u:[1,1,1],seed:7},
{name:'Wide-spread class',n:100,t:[55,50,55],m:[55,50,55],sd:25,u:[1,1,1],seed:8},
{name:'Small class (35)',n:35,t:[65,40,60],m:[60,45,55],sd:10,u:[1,1,1],seed:9},
{name:'Raw units >100 (time in min)',n:100,t:[60,50,75],m:[60,50,70],sd:10,u:[1,1,1.8],seed:10}];
F.gen=function(s){const r=rng(s.seed),g=()=>Math.sqrt(-2*Math.log(r()+1e-9))*Math.cos(6.2832*r());
const names=[],raw=[];for(let i=0;i<s.n;i++){names.push(FN[(i*3+s.seed)%FN.length]+' '+LN[(i*7+s.seed*2)%LN.length]);
raw.push(s.m.map((m,k)=>Math.round(Math.min(Math.max(m+s.sd*g(),0),100)*s.u[k]*10)/10));}
return{names,raw};};
// csv helpers (studentProcess.m layout: name, complexity, breadth, time)
F.parseCsv=function(txt){const rows=txt.split(/\r?\n/).map(l=>l.split(',').map(x=>x.trim())).filter(r=>r.length>=4&&r[0]!=='');
if(rows.length&&isNaN(parseFloat(rows[0][1])))rows.shift();const names=[],raw=[];let dropped=0;
rows.forEach(r=>{const v=r.slice(1,4).map(parseFloat);if(v.some(isNaN)){dropped++;return}names.push(r[0]);raw.push(v.map(x=>Math.max(x,0)))});
return{names,raw,dropped};};
F.resultsCsv=function(R){return'Role,Name,Difficulty\nTeacher,Pilot,'+R.teacher.toFixed(4)+'\n'+R.names.map((n,i)=>'Student,'+n+','+R.ys[i].toFixed(4)).join('\n')+'\n'};
})(window.FER=window.FER||{});
