import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,defaultExhibit,evaluate,questions} from '../lib/learning.ts';
import {projectPdf} from '../lib/pdf.ts';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('published teaching fixtures preserve energy and timing',()=>{
 const fixtures=[[[4,5,5],[16,5,4.75,1.25,6.7368421052631575]],[[4,5,0],[16,0,0,6,12]],[[4,0,20],[0,0,0,10,0]],[[1,2,5],[1.6,0,0,8.4,0]],[[4,2.5,5],[8,3.8,3.61,2.39,0]],[[4,5,20],[16,11.4,6,0,0]]];
 for(const [[capacity,sunlight,battery],out] of fixtures){const m=simulate({capacity,sunlight,battery});[m.generation,m.stored,m.night,m.grid,m.exported].forEach((n,i)=>close(n,out[i]));}
});
test('energy balance holds across the input grid and storage never generates energy',()=>{
 for(let capacity=0;capacity<=12;capacity+=1.5)for(let sunlight=0;sunlight<=8;sunlight++)for(let battery=0;battery<=20;battery+=2){const m=simulate({capacity,sunlight,battery});close(m.generation+m.grid,10+m.exported+m.remaining+m.chargeLoss+m.dischargeLoss);assert.ok(m.stored<=battery+1e-8);assert.ok(m.night<=6);assert.ok(m.grid>=0);close(m.generation,simulate({capacity,sunlight,battery:0}).generation);}
});
test('invalid or non-finite model inputs fail explicitly',()=>{for(const n of [NaN,Infinity,-1,13])assert.throws(()=>simulate({capacity:n,sunlight:5,battery:5}));});
test('free text gets coverage hints, never an automatic semantic grade',()=>{
 const answers=Object.fromEntries(questions(defaultExhibit).map(q=>[q.id,q.kind==='number'?String(q.expected):q.kind==='choice'?q.expected:'day night battery loss kwh because fixed weather']));
 const result=evaluate(defaultExhibit,answers);assert.equal(result.correct,4);assert.equal(result.checked,4);assert.equal(result.feedback.find(f=>f.id==='timing').correct,null);assert.match(result.notice,/not an academic grade/);
 answers.generation='16e999';assert.equal(evaluate(defaultExhibit,answers).correct,3);
});
test('PDF export creates a self-contained document with correct object offsets',()=>{
 const bytes=projectPdf({...defaultExhibit,title:'Solar learning (test)'},3),pdf=new TextDecoder().decode(bytes);assert.ok(pdf.startsWith('%PDF-1.4'));assert.ok(pdf.includes('Solar learning'));assert.ok(pdf.includes(String.fromCharCode(92)+'(test'));assert.match(pdf,/Version|version 3/);const offset=Number(pdf.match(/startxref\n(\d+)/)[1]);assert.equal(pdf.slice(offset,offset+4),'xref');assert.ok(pdf.endsWith('%%EOF\n'));
});
