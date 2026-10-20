// Run:  node server.js   then open http://localhost:7980
const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname,res=path.join(root,'results'),T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.csv':'text/csv'};
fs.mkdirSync(res,{recursive:true});
http.createServer((q,r)=>{const u=new URL(q.url,'http://x');
if(u.pathname==='/api/ping')return r.end('ok');
if(u.pathname==='/api/clear'){fs.readdirSync(res).forEach(f=>fs.rmSync(path.join(res,f),{recursive:true}));return r.end('ok')}
if(u.pathname==='/api/save'){let b='';q.setEncoding('utf8');q.on('data',c=>b+=c).on('end',()=>{fs.writeFileSync(path.join(res,path.basename(u.searchParams.get('name'))),b);r.end('ok')});return}
const p=path.join(root,u.pathname==='/'?'index.html':path.normalize(u.pathname));
if(!p.startsWith(root)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){r.statusCode=404;return r.end()}
r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(r)
}).listen(7980,()=>console.log('http://localhost:7980'));
