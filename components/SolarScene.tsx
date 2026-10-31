'use client';
import {useEffect,useRef} from 'react';
import {simulate,type Inputs} from '../lib/learning';

export default function SolarScene({inputs}:{inputs:Inputs}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  let frame=0,t=0,stopped=false;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const m=simulate(inputs);
  function draw(){
   if(stopped||!canvas||!ctx)return;
   const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(window.devicePixelRatio||1,2);
   if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
   const scale=Math.min(w/760,h/400),cx=w*.5,cy=h*.61;
   const p=(x:number,y:number,z=0)=>[cx+(x-y)*49*scale,cy+(x+y)*21*scale-z*52*scale];
   const poly=(points:number[][],fill:string,stroke?:string)=>{ctx.beginPath();points.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}};
   const box=(x:number,y:number,z:number,a:number,b:number,height:number,colors:string[])=>{poly([p(x,y,z),p(x,y+b,z),p(x,y+b,z+height),p(x,y,z+height)],colors[0]);poly([p(x,y+b,z),p(x+a,y+b,z),p(x+a,y+b,z+height),p(x,y+b,z+height)],colors[1]);poly([p(x,y,z+height),p(x+a,y,z+height),p(x+a,y+b,z+height),p(x,y+b,z+height)],colors[2]);};
   ctx.strokeStyle='#263947';ctx.lineWidth=.6;ctx.globalAlpha=.45;
   for(let i=-7;i<8;i++){const a=p(i,-5),b=p(i,6);ctx.beginPath();ctx.moveTo(...a as [number,number]);ctx.lineTo(...b as [number,number]);ctx.stroke();const c=p(-7,i),d=p(7,i);ctx.beginPath();ctx.moveTo(...c as [number,number]);ctx.lineTo(...d as [number,number]);ctx.stroke();}ctx.globalAlpha=1;
   const sx=w*.23,sy=h*.20,sunOn=inputs.sunlight>0;
   const glow=ctx.createRadialGradient(sx,sy,1,sx,sy,70*scale);glow.addColorStop(0,sunOn?'#f1ca6850':'#a3b8c215');glow.addColorStop(1,'#f1ca6800');ctx.fillStyle=glow;ctx.fillRect(sx-90*scale,sy-90*scale,180*scale,180*scale);
   ctx.beginPath();ctx.arc(sx,sy,21*scale,0,Math.PI*2);ctx.fillStyle=sunOn?'#f4cb72':'#7c90a1';ctx.fill();ctx.strokeStyle=sunOn?'#f4cb72':'#7c90a1';ctx.lineWidth=2*scale;
   for(let i=0;i<12;i++){const a=i*Math.PI/6+t*.07;ctx.beginPath();ctx.moveTo(sx+Math.cos(a)*29*scale,sy+Math.sin(a)*29*scale);ctx.lineTo(sx+Math.cos(a)*36*scale,sy+Math.sin(a)*36*scale);ctx.stroke();}
   box(-4.4,-2.2,-.18,8.5,5,.2,['#1c3845','#24434e','#294e56']);
   box(.2,-1.25,.02,2.3,2.15,1.65,['#d2d9cb','#a8beb4','#e8ecdf']);
   poly([p(.05,-1.4,1.65),p(2.65,-1.4,1.65),p(2.65,-.18,2.5),p(.05,-.18,2.5)],'#314751');
   poly([p(.05,-.18,2.5),p(2.65,-.18,2.5),p(2.65,1.05,1.65),p(.05,1.05,1.65)],'#405f68','#66878a');
   // Front windows retain a warm glow when the grid supplies demand.
   poly([p(.55,.91,.52),p(1.12,.91,.52),p(1.12,.91,1.25),p(.55,.91,1.25)],'#f0cc83');
   poly([p(1.5,.91,.02),p(2.02,.91,.02),p(2.02,.91,1.15),p(1.5,.91,1.15)],'#31525b');
   const rows=Math.max(1,Math.ceil(inputs.capacity/2));
   for(let i=0;i<rows;i++){const x=-3.7+(i%3)*.94,y=-1.45+Math.floor(i/3)*1.25;box(x+.1,y+.15,.03,.08,.7,.65,['#486773','#486773','#657f87']);const a=[p(x,y,.9),p(x+.82,y,.9),p(x+.82,y+.92,.55),p(x,y+.92,.55)];poly(a,inputs.capacity>0?'#25517b':'#475a69','#78a5b5');for(let k=1;k<4;k++){const q1=p(x+.82*k/4,y,.9),q2=p(x+.82*k/4,y+.92,.55);ctx.beginPath();ctx.moveTo(...q1 as[number,number]);ctx.lineTo(...q2 as[number,number]);ctx.strokeStyle='#75a0b5';ctx.lineWidth=.6;ctx.stroke();}for(let k=1;k<4;k++){const q1=p(x,y+.92*k/4,.9-.35*k/4),q2=p(x+.82,y+.92*k/4,.9-.35*k/4);ctx.beginPath();ctx.moveTo(...q1 as[number,number]);ctx.lineTo(...q2 as[number,number]);ctx.stroke();}}
   box(3.05,.2,.02,.66,.8,1.35,['#a5bab3','#d9e4da','#eef3e8']);
   const fill=inputs.battery?Math.min(m.stored/inputs.battery,1):0;
   poly([p(3.19,1.01,.19),p(3.58,1.01,.19),p(3.58,1.01,1.17),p(3.19,1.01,1.17)],'#426260');
   if(fill>0)poly([p(3.23,1.02,.23),p(3.54,1.02,.23),p(3.54,1.02,.23+.9*fill),p(3.23,1.02,.23+.9*fill)],'#9be6bd');
   const tracks=[{points:[p(-2.8,1.1,.05),p(-2.8,2.2,.05),p(1.4,2.2,.05),p(1.4,1,.05)],color:'#8ee4bb',active:m.direct>0},{points:[p(1.4,2.2,.05),p(3.5,2.2,.05),p(3.5,1,.05)],color:'#f1ca72',active:m.stored>0}];
   for(const tr of tracks){ctx.beginPath();tr.points.forEach((q,i)=>i?ctx.lineTo(...q as[number,number]):ctx.moveTo(...q as[number,number]));ctx.strokeStyle=tr.active?tr.color:'#4f6d71';ctx.lineWidth=2*scale;ctx.stroke();if(tr.active&&!reduce){const k=(t*.36)% (tr.points.length-1),j=Math.floor(k),f=k-j,q=tr.points[j],r=tr.points[j+1];ctx.beginPath();ctx.arc(q[0]+(r[0]-q[0])*f,q[1]+(r[1]-q[1])*f,4*scale,0,Math.PI*2);ctx.fillStyle=tr.color;ctx.shadowColor=tr.color;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;}}
   ctx.font=`${Math.max(10,12*scale)}px Arial`;ctx.textAlign='center';ctx.fillStyle='#a5bdc7';const labels=[{at:p(-2.6,2.8),label:'SOLAR PANELS'},{at:p(1.3,1.35),label:'HOME'},{at:p(4,1.3),label:'STORAGE'}];for(const a of labels)ctx.fillText(a.label,a.at[0],a.at[1]+25*scale);
   t+=.016;if(!reduce)frame=requestAnimationFrame(draw);
  }
  draw();const observer=new ResizeObserver(()=>{if(reduce)draw();});observer.observe(canvas);
  return()=>{stopped=true;cancelAnimationFrame(frame);observer.disconnect();};
 },[inputs.capacity,inputs.sunlight,inputs.battery]);
 return <canvas ref={ref} className="solar-canvas" role="img" aria-label={`Illustrative solar exhibit. ${inputs.capacity} kilowatts of panels, ${inputs.sunlight} effective sunlight hours, and ${inputs.battery} kilowatt-hours of battery capacity. Exact results appear below.`}/>;
}
