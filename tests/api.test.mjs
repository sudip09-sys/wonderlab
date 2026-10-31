import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import {api} from '../lib/service.ts';
import {defaultExhibit,questions} from '../lib/learning.ts';

const owner={userId:'owner',email:'owner@example.test',displayName:'Project Owner'},other={userId:'other',email:'other@example.test',displayName:'A Teammate'};
function setup(){
 const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');for(const f of fs.readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')))sqlite.exec(fs.readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
 const prepare=(sql,args=[])=>({bind(...next){return prepare(sql,next);},async all(){return{results:sqlite.prepare(sql).all(...args),success:true};},async first(){return sqlite.prepare(sql).get(...args)??null;},async run(){return{success:true,meta:sqlite.prepare(sql).run(...args)};}});
 const db={prepare,async batch(statements){sqlite.exec('BEGIN');try{const values=[];for(const s of statements)values.push(await s.run());sqlite.exec('COMMIT');return values;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
 async function call(path,method='GET',data,user=owner,headers={}){const response=await api(new Request('https://wonderlab.test/api/'+path,{method,headers:{'Content-Type':'application/json','x-wonderlab-request':'1',...headers},...(data===undefined?{}:{body:JSON.stringify(data)})}),db,user);return{status:response.status,data:response.headers.get('Content-Type')?.includes('json')?await response.json():new Uint8Array(await response.arrayBuffer())};}
 return{call,sqlite};
}
test('authentication, CSRF and validation protect writes',async()=>{
 const {call,sqlite}=setup();assert.equal((await call('projects','POST',{title:'My project'},null)).status,401);assert.equal((await call('projects','POST',{title:'My project'},owner,{'Origin':'https://attacker.test'})).status,403);assert.equal((await call('projects','POST',{title:'x'})).status,400);assert.equal(sqlite.prepare('SELECT count(*) AS n FROM projects').get().n,0);sqlite.close();
});
test('the complete project, collaboration, rehearsal and publishing flow persists data',async()=>{
 const {call,sqlite}=setup();let r=await call('projects','POST',{title:'Our solar exhibit'});assert.equal(r.status,201);let p=r.data.project;const pid=p.id;
 assert.equal((await call('projects/'+pid,'GET',undefined,other)).status,403);
 assert.equal((await call('projects/'+pid+'/members','POST',{email:other.email,role:'viewer'})).status,201);
 assert.equal((await call('projects/'+pid,'PUT',{expectedVersion:1,content:p.content},other)).status,403);
 await call('projects/'+pid+'/members','POST',{email:other.email,role:'editor'});
 assert.equal((await call('projects/'+pid+'/members','POST',{email:'third@example.test',role:'editor'},other)).status,403);
 let content={...p.content,inputs:{capacity:4,sunlight:2.5,battery:5}};
 r=await call('projects/'+pid,'PUT',{expectedVersion:1,content},other);assert.equal(r.status,200);p=r.data.project;assert.equal(p.revision,2);
 assert.equal((await call('projects/'+pid,'PUT',{expectedVersion:1,content})).status,409);
 assert.equal((await call('projects/'+pid,'PUT',{expectedVersion:2,content:{...content,inputs:{...content.inputs,battery:100}}})).status,400);
 await call('projects/'+pid+'/comments','POST',{body:'A private team note.'},other);
 await call('projects/'+pid+'/credits','POST',{kind:'Research',body:'Checked energy accounting and sources.'},other);
 r=await call('projects/'+pid+'/publish','POST',{expectedVersion:2});assert.equal(r.status,200);p=r.data.project;assert.equal(p.revision,3);
 const pub=(await call('public/'+pid,'GET',undefined,null)).data.project;assert.equal(pub.comments.length,0);assert.equal(pub.content.inputs.sunlight,2.5);assert.equal(pub.content.credits.length,2);assert.equal(pub.members,undefined);assert.ok(!JSON.stringify(pub).includes(other.email));
 await call('public/'+pid+'/comments','POST',{body:'The storage example helped me.'},other);
 assert.equal((await call('public/'+pid,'GET',undefined,null)).data.project.comments.length,1);
 r=await call('rehearsals','POST',{projectId:pid},other);assert.equal(r.status,201);let attempt=r.data.rehearsal;assert.equal(attempt.snapshot.inputs.sunlight,2.5);
 assert.equal((await call('rehearsals/'+attempt.id,'GET')).status,404);
 await call('projects/'+pid,'PUT',{expectedVersion:3,content:{...content,inputs:{...content.inputs,sunlight:8}}});
 assert.equal((await call('public/'+pid)).data.project.content.inputs.sunlight,2.5);
 assert.equal((await call('rehearsals/'+attempt.id,'PUT',{answers:{generation:'8'},complete:true},other)).status,400);
 const answers=Object.fromEntries(questions(attempt.snapshot).map(q=>[q.id,q.kind==='number'?String(q.expected):q.kind==='choice'?q.expected:'Day and night demand differ. The battery has losses, and fixed weather assumptions affect the model.']));
 r=await call('rehearsals/'+attempt.id,'PUT',{answers,complete:true},other);assert.equal(r.status,200);attempt=r.data.rehearsal;assert.equal(attempt.result.correct,4);assert.equal(attempt.snapshot.inputs.sunlight,2.5);
 assert.equal((await call('rehearsals/'+attempt.id,'PUT',{answers},other)).status,409);
 const pdf=await call('projects/'+pid+'/report');assert.equal(pdf.status,200);assert.ok(new TextDecoder().decode(pdf.data).startsWith('%PDF-1.4'));
 const fork=await call('projects/'+pid+'/duplicate','POST',{},other);assert.equal(fork.status,201);assert.ok(fork.data.project.credits.some(c=>c.author_name==='A Teammate'));
 const before=sqlite.prepare('SELECT count(*) AS n FROM versions WHERE project_id=?').get(pid).n;
 const version1=(await call('projects/'+pid)).data.project.versions.find(v=>v.number===1);
 r=await call('projects/'+pid+'/restore','POST',{versionId:version1.id,expectedVersion:4});assert.equal(r.status,200);assert.equal(r.data.project.content.inputs.sunlight,5);assert.equal(sqlite.prepare('SELECT count(*) AS n FROM versions WHERE project_id=?').get(pid).n,before+1);
 await call('projects/'+pid+'/unpublish','POST',{});assert.equal((await call('public/'+pid)).status,404);
 assert.equal((await call('projects/'+pid,'DELETE')).status,200);assert.equal(sqlite.prepare('SELECT count(*) AS n FROM versions WHERE project_id=?').get(pid).n,0);assert.equal(sqlite.prepare('SELECT project_id FROM rehearsals WHERE id=?').get(attempt.id).project_id,null);sqlite.close();
});
