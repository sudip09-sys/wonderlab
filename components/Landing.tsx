'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowRight,FlaskConical,Sun,Mic,Users,Pause,Play,MoveUpRight} from 'lucide-react';
import './landing.css';

function Silk({enabled}:{enabled:boolean}){
 const root=useRef<SVGSVGElement>(null);
 useEffect(()=>{
  const svg=root.current;if(!svg||!enabled)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');if(media.matches||!fine.matches)return;
  let frame=0,x=innerWidth*.78,y=170,tx=x,ty=y,last=0;const points:{x:number;y:number}[]=[];
  const move=(e:PointerEvent)=>{tx=e.clientX;ty=Math.min(e.clientY,innerHeight*.8);};
  const tick=(time:number)=>{x+=(tx-x)*.035;y+=(ty-y)*.035;svg.querySelector('[data-spider]')?.setAttribute('transform',`translate(${x} ${y})`);svg.querySelector('[data-thread]')?.setAttribute('d',`M ${innerWidth*.78} 0 Q ${x+35} ${y*.45} ${x} ${y}`);if(time-last>120){points.push({x,y});if(points.length>28)points.shift();last=time;}svg.querySelector('[data-trail]')?.setAttribute('d',points.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' '));frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);window.addEventListener('pointermove',move,{passive:true});return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);};
 },[enabled]);
 return <svg ref={root} className={'silk-layer '+(!enabled?'silk-hidden':'')} aria-hidden="true"><path data-thread fill="none" stroke="currentColor" strokeWidth=".7"/><path data-trail fill="none" stroke="currentColor" strokeWidth=".5" opacity=".4"/><g data-spider transform="translate(-100 -100)" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><ellipse cy="-6" rx="5" ry="8" fill="currentColor"/><circle cy="4" r="4" fill="currentColor"/>{[-1,1].map(s=><g key={s}>{[0,1,2,3].map(i=><path key={i} d={`M ${s*3} ${i*3-5} L ${s*(12+i*2)} ${i*5-16} L ${s*(18+i*2)} ${i*8-14}`}/>)}</g>)}</g></svg>;
}
export default function Landing({appOrigin='',assetBase='',homeHref='/'}:{appOrigin?:string;assetBase?:string;homeHref?:string}){
 const appUrl=(path:string)=>appOrigin+path;
 const [motion,setMotion]=useState(false),[experiment,setExperiment]=useState(0);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');setMotion(!media.matches);const change=()=>setMotion(!media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
 return <div className={'wonder-home '+(!motion?'motion-paused':'')}>
  <a className="home-skip" href="#home-main">Skip to content</a>
  <section className="cabinet">
   <Silk enabled={motion}/>
   <header className="cabinet-nav"><a className="cabinet-brand" href={homeHref} aria-label="WonderLab home"><FlaskConical size={25}/>wonderlab<span>®</span></a><nav aria-label="Home navigation"><a href="#cabinet-exhibits">The collection</a><a href={appUrl("/?view=studio")} className="nav-studio">Enter the studio <ArrowUpRight size={18}/></a></nav></header>
   <main id="home-main">
    <div className="cabinet-heading"><span className="cabinet-kicker"><span/> A HOME FOR CURIOUS MINDS</span><h1>Good ideas<br/>deserve a little<br/><em>wonder.</em><span className="heading-star" aria-hidden="true">✳</span></h1><div className="cabinet-intro"><p>Make something people can explore.<br/>Find your people. Practise your story.<br/>Leave your fingerprints on an idea.</p><a className="paper-button" href={appUrl("/?view=studio")}>Make your first discovery <ArrowUpRight size={20}/></a><span className="intro-note">Your curiosity is the only prerequisite.</span></div></div>
    <div className="curiosity-shelf" aria-label="A collection of things you can make">
     <a href={appUrl("/?view=project&id=sample")} className="found-object solar-postcard"><span className="postcard-top">FIELD NOTES <span>NO. 001</span></span><img src={assetBase+"/art/solar.webp"} alt="An illustrated solar-powered learning exhibit"/><span className="postcard-caption">a little sunshine,<br/><em>a lot of possibilities.</em><ArrowUpRight size={21}/></span><span className="object-label">01 / TRY A LIVE EXHIBIT</span></a>
     <button className={'found-object experiment-note experiment-'+experiment} onClick={()=>setExperiment(v=>(v+1)%3)} aria-label="Change the curiosity experiment"><span className="tape" aria-hidden="true"/><span className="note-heading">WHAT IF…</span><span className="orbit-art" aria-hidden="true"><span className="orbit-ring"/><span className="orbit-core">{['?','!','✳'][experiment]}</span><span className="orbit-dot"/></span><strong>{['you followed that little idea?','a question became an exhibit?','someone saw what you see?'][experiment]}</strong><span className="note-bottom">tap to wonder again ↗</span></button>
     <a href={appUrl("/?view=templates")} className="found-object contributor-ticket"><div className="ticket-punch"/><span className="ticket-overline">ADMIT ONE CURIOUS HUMAN</span><Users size={34} strokeWidth={1.2}/><strong>Made by you.<br/>Better together.</strong><span className="ticket-stamp">EVERY CONTRIBUTION<br/>GETS ITS CREDIT</span><span className="ticket-bottom">A place for your ideas <ArrowUpRight size={18}/></span></a>
     <a href={appUrl("/?view=history")} className="found-object rehearsal-tape"><span className="tape-top">WONDERLAB AUDIO CLUB <Mic size={16}/></span><strong>Say it.<br/><em>Then own it.</em></strong><span className="cassette-wheels" aria-hidden="true"><i/><span>REHEARSAL / VOL. 01</span><i/></span><span className="cassette-foot">Guided practice for your next big explanation <ArrowUpRight size={18}/></span></a>
     <span className="shelf-scribble" aria-hidden="true">collect questions.<br/>make something of them. ↗</span>
    </div>
   </main>
   <div className="cabinet-bottom"><span>SCROLL TO OPEN THE CABINET ↓</span><button onClick={()=>setMotion(v=>!v)} aria-pressed={!motion}>{motion?<Pause size={13}/>:<Play size={13}/>} Motion {motion?'on':'off'}</button><span>IMAGINATION, WITH SOMETHING TO SHOW FOR IT.</span></div>
  </section>
  <section className="collection-section" id="cabinet-exhibits" aria-labelledby="collection-heading"><div className="collection-title"><span>THINGS WORTH GETTING LOST IN</span><h2 id="collection-heading">Less watching.<br/><em>More wondering.</em></h2><p>An exhibit you can change. A story you can practise. A contribution with your name on it.</p></div><a className="featured-exhibit" href={appUrl("/?view=project&id=sample")}><div className="exhibit-art"><img src={assetBase+"/art/hero.webp"} alt="Creative students exploring a model solar-energy project"/><span><Sun size={15}/> INTERACTIVE EXHIBIT 001</span></div><div className="exhibit-copy"><span>ENERGY / EVERYDAY SCIENCE</span><h3>Can sunshine<br/>power the night?</h3><p>Change the sunlight, size the panels, and follow the energy. Meet the difference between making power and saving it.</p><strong>Explore the solar lab <ArrowUpRight size={22}/></strong></div></a></section>
  <section className="idea-journey" aria-labelledby="journey-heading"><span className="journey-eyebrow">FROM “WHAT IF” TO “I MADE THIS”</span><h2 id="journey-heading">Give your idea<br/>somewhere to go.</h2><div className="journey-steps">{[{n:'01',title:'Make it tangible.',body:'Start with a working solar exhibit. Change the model and make the explanation your own.',icon:Sun,url:'/?view=templates',link:'Find your starting point'},{n:'02',title:'Let others in.',body:'Invite collaborators, ask better questions, and give every contribution a place in the story.',icon:Users,url:'/?view=studio',link:'Open your workspace'},{n:'03',title:'Find your words.',body:'Practise explaining your project with six guided questions and saved, specific feedback.',icon:Mic,url:'/?view=history',link:'Meet Rehearsal'}].map(s=><article key={s.n}><div><span>{s.n}</span><s.icon size={25}/></div><h3>{s.title}</h3><p>{s.body}</p><a href={appUrl(s.url)}>{s.link}<ArrowRight size={17}/></a></article>)}</div></section>
  <footer className="cabinet-footer"><div><span>STAY CURIOUS. MAKE IT REAL.</span><h2>Your next good idea<br/>is waiting for you.</h2><a className="paper-button" href={appUrl("/?view=studio")}>Let’s see what happens <MoveUpRight size={22}/></a></div><div className="footer-line"><a className="cabinet-brand" href={homeHref}>wonderlab<span>®</span></a><p>Made for learning. Built for creating.</p><a href="https://github.com/sudip09-sys/wonderlab" target="_blank" rel="noreferrer">The project, out in the open <ArrowUpRight size={16}/></a></div></footer>
 </div>;
}

