'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import AIChatbot from './AIChatbot'

type Data = {
  hero: { name:string;title:string;tagline:string;bio:string;location:string;email:string;phone:string;linkedin:string;profileImage:string;resumeUrl?:string }
  skills: Array<{id:string;icon:string;title:string;description:string;technologies:string[]}>
  experience: Array<{id:string;title:string;company:string;location:string;period:string;description:string;achievements:string[]}>
  certifications: Array<{id:string;name:string;icon:string;category:string;image:string}>
}

const NAV = [{id:'home',l:'Home'},{id:'about',l:'About'},{id:'skills',l:'Skills'},{id:'experience',l:'Experience'},{id:'certifications',l:'Certifications'},{id:'lab',l:'Cyber Lab'},{id:'contact',l:'Contact'}]

export default function Portfolio({ data }: { data: Data }) {
  const curRef = useRef<HTMLDivElement>(null)
  const curRRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mousePos = useRef({x:0,y:0})

  // 3D Network Globe Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let t = 0, animId: number

    // 3D sphere nodes
    const nodes: {theta:number;phi:number;r:number;vt:number;vp:number;size:number;pulse:number}[] = []
    for(let i=0;i<80;i++) nodes.push({theta:Math.random()*Math.PI*2,phi:Math.random()*Math.PI,r:180+Math.random()*40,vt:(Math.random()-.5)*0.003,vp:(Math.random()-.5)*0.002,size:Math.random()*2+0.5,pulse:Math.random()*Math.PI*2})

    // Floating particles
    const parts: {x:number;y:number;vx:number;vy:number;s:number;alpha:number;color:string}[] = []
    const colors=['rgba(0,102,255,','rgba(0,212,255,','rgba(255,255,255,']
    for(let i=0;i<60;i++) parts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,s:Math.random()*1.5+.3,alpha:Math.random()*.5+.1,color:colors[Math.floor(Math.random()*3)]})

    const project3D = (theta:number,phi:number,r:number,cx:number,cy:number,mx:number,my:number) => {
      const tilt = (my/H-.5)*.4
      const pan = (mx/W-.5)*.4
      const x3 = r*Math.sin(phi)*Math.cos(theta)
      const y3 = r*Math.cos(phi)
      const z3 = r*Math.sin(phi)*Math.sin(theta)
      const x2 = x3*Math.cos(pan) - z3*Math.sin(pan)
      const z2 = x3*Math.sin(pan) + z3*Math.cos(pan)
      const y2 = y3*Math.cos(tilt) - z2*Math.sin(tilt)
      const z2f = y3*Math.sin(tilt) + z2*Math.cos(tilt)
      const scale = 500/(500+z2f+200)
      return { sx:cx+x2*scale, sy:cy+y2*scale, depth:(z2f+200)/400 }
    }

    const draw = () => {
      t += 0.005
      ctx.fillStyle='rgba(2,11,24,0.15)'
      ctx.fillRect(0,0,W,H)

      const cx=W*.5, cy=H*.45
      const mx=mousePos.current.x, my=mousePos.current.y

      // Sphere outline rings
      for(let ring=0;ring<3;ring++){
        const rad=140+ring*50
        ctx.beginPath()
        for(let a=0;a<=Math.PI*2;a+=0.05){
          const x=cx+Math.cos(a+t*.3)*rad
          const y=cy+Math.sin(a+t*.3)*rad*.35
          a===0?ctx.moveTo(x,y):ctx.lineTo(x,y)
        }
        ctx.strokeStyle=`rgba(0,102,255,${0.04-ring*0.01})`
        ctx.lineWidth=1
        ctx.stroke()
      }

      // Draw connections first
      for(let i=0;i<nodes.length;i++){
        const p1=project3D(nodes[i].theta+t,nodes[i].phi,nodes[i].r,cx,cy,mx,my)
        for(let j=i+1;j<nodes.length;j++){
          const p2=project3D(nodes[j].theta+t,nodes[j].phi,nodes[j].r,cx,cy,mx,my)
          const dist=Math.hypot(p1.sx-p2.sx,p1.sy-p2.sy)
          if(dist<80){
            ctx.strokeStyle=`rgba(0,102,255,${.12*(1-dist/80)*Math.min(p1.depth,p2.depth)})`
            ctx.lineWidth=.5
            ctx.beginPath()
            ctx.moveTo(p1.sx,p1.sy)
            ctx.lineTo(p2.sx,p2.sy)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach(n=>{
        n.theta+=n.vt; n.phi+=n.vp; n.pulse+=0.04
        const p=project3D(n.theta+t,n.phi,n.r,cx,cy,mx,my)
        const glow=.3+Math.sin(n.pulse)*.2
        const s=n.size*p.depth*1.5
        const r = Math.max(0.1, s*3)
        if (r > 0 && p.depth > 0) {
          const grad=ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,r)
          grad.addColorStop(0,`rgba(0,212,255,${glow*p.depth})`)
          grad.addColorStop(1,'transparent')
          ctx.fillStyle=grad
          ctx.beginPath()
          ctx.arc(p.sx,p.sy,r,0,Math.PI*2)
          ctx.fill()
        }
        const sr = Math.max(0.1, s)
        ctx.fillStyle=`rgba(255,255,255,${p.depth*.9})`
        ctx.beginPath()
        ctx.arc(p.sx,p.sy,sr,0,Math.PI*2)
        ctx.fill()
      })

      // Floating particles
      parts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=W; if(p.x>W)p.x=0
        if(p.y<0)p.y=H; if(p.y>H)p.y=0
        ctx.fillStyle=p.color+p.alpha+')'
        ctx.beginPath()
        ctx.arc(p.x,p.y,p.s,0,Math.PI*2)
        ctx.fill()
      })

      // Mouse ripple
      if(mx>0){
        ctx.strokeStyle='rgba(0,102,255,0.08)'
        ctx.lineWidth=1
        ctx.beginPath()
        ctx.arc(mx,my,Math.sin(t*3)*30+50,0,Math.PI*2)
        ctx.stroke()
      }

      animId=requestAnimationFrame(draw)
    }
    draw()

    const onResize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
    window.addEventListener('resize',onResize)
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',onResize)}
  },[mounted])

  useEffect(()=>{
    setMounted(true)
    setIsMobile(window.innerWidth<768)

    const onMove=(e:MouseEvent)=>{
      mousePos.current={x:e.clientX,y:e.clientY}
      if(curRef.current){curRef.current.style.left=e.clientX+'px';curRef.current.style.top=e.clientY+'px'}
      setTimeout(()=>{if(curRRef.current){curRRef.current.style.left=e.clientX+'px';curRRef.current.style.top=e.clientY+'px'}},90)
    }
    const onHover=()=>curRRef.current?.classList.add('on')
    const onLeave=()=>curRRef.current?.classList.remove('on')
    document.addEventListener('mousemove',onMove)
    document.querySelectorAll('a,button,[data-h]').forEach(el=>{el.addEventListener('mouseenter',onHover);el.addEventListener('mouseleave',onLeave)})

    const onScroll=()=>{
      setScrolled(window.scrollY>50)
      const ids=NAV.map(n=>n.id)
      for(const id of ids){const el=document.getElementById(id);if(el){const r=el.getBoundingClientRect();if(r.top<=100&&r.bottom>=100){setActive(id);break}}}
    }
    window.addEventListener('scroll',onScroll)

    // GSAP
    const loadGSAP=async()=>{
      const {gsap}=await import('gsap')
      const {ScrollTrigger}=await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.utils.toArray<HTMLElement>('.skill-fill').forEach(el=>{
        ScrollTrigger.create({trigger:el,start:'top 90%',onEnter:()=>el.classList.add('go')})
      })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>{
        gsap.fromTo(el,{opacity:0,y:30},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}})
      })
    }
    loadGSAP()

    return()=>{document.removeEventListener('mousemove',onMove);window.removeEventListener('scroll',onScroll)}
  },[])

  const scrollTo=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenuOpen(false)}

  if(!mounted) return null

  const fadeUp={initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.15},transition:{duration:.75,ease:[.23,1,.32,1]}}
  const stagger=(i:number)=>({...fadeUp,transition:{...fadeUp.transition,delay:i*.1}})

  return (
    <>
      {!isMobile&&<><div ref={curRef} className="cur"/><div ref={curRRef} className="cur-r"/></>}
      <canvas ref={canvasRef} id="bg-canvas"/>

      {/* ── NAV ── */}
      <motion.nav initial={{y:-80}} animate={{y:0}} transition={{duration:.6,ease:[.23,1,.32,1]}}
        style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:isMobile?'0 20px':'0 40px',background:scrolled?'rgba(2,11,24,0.96)':'transparent',backdropFilter:scrolled?'blur(20px)':'none',borderBottom:scrolled?'1px solid rgba(10,30,56,0.8)':'none',transition:'all .4s'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}} onClick={()=>scrollTo('home')}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#0066ff,#00d4ff)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',color:'#fff',fontWeight:700,fontFamily:'JetBrains Mono,monospace',clipPath:'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))'}}>AB</div>
          <div>
            <div style={{fontFamily:'Clash Display,sans-serif',fontSize:'.85rem',color:'#fff',fontWeight:600,letterSpacing:'-.01em',lineHeight:1.1}}>Ahamed Bazil</div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.5rem',color:'rgba(0,102,255,.8)',letterSpacing:'.15em'}}>CYBERSECURITY</div>
          </div>
        </div>
        {!isMobile&&(
          <div style={{display:'flex',gap:4,alignItems:'center'}}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>scrollTo(n.id)} style={{background:active===n.id?'rgba(0,102,255,.1)':'transparent',border:'none',color:active===n.id?'#fff':'rgba(120,160,200,.6)',fontFamily:'inherit',fontSize:'.82rem',fontWeight:500,cursor:'none',padding:'6px 14px',borderRadius:4,transition:'all .2s'}}>
                {n.l}
              </button>
            ))}
            <a href="/cmd-r9x4" style={{color:'rgba(60,80,120,.5)',fontFamily:'JetBrains Mono,monospace',fontSize:'.58rem',padding:'6px 10px',textDecoration:'none',letterSpacing:'.1em'}}>⚙</a>
          </div>
        )}
        {isMobile&&(
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:'none',border:'none',padding:8,display:'flex',flexDirection:'column',gap:5,cursor:'pointer'}}>
            {[24,16,24].map((w,i)=>(
              <span key={i} style={{display:'block',height:'1.5px',background:'#fff',width:w,transition:'all .3s',transform:menuOpen&&i===0?'translateY(6.5px) rotate(45deg)':menuOpen&&i===2?'translateY(-6.5px) rotate(-45deg)':'none',opacity:menuOpen&&i===1?0:1}}/>
            ))}
          </button>
        )}
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen&&(
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            style={{position:'fixed',top:68,left:0,right:0,bottom:0,zIndex:999,background:'rgba(2,11,24,.98)',backdropFilter:'blur(24px)',display:'flex',flexDirection:'column',padding:'32px 24px'}}>
            {NAV.map((n,i)=>(
              <motion.button key={n.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*.06}}
                onClick={()=>scrollTo(n.id)} style={{background:'none',border:'none',borderBottom:'1px solid rgba(10,30,56,.8)',color:active===n.id?'#fff':'rgba(120,160,200,.6)',textAlign:'left',padding:'18px 0',fontFamily:'Clash Display,sans-serif',fontSize:'1.4rem',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                <span>{n.l}</span>
                {active===n.id&&<span style={{width:6,height:6,borderRadius:'50%',background:'#0066ff'}}/>}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="home" className="grid-bg" style={{minHeight:'100vh',paddingTop:68,display:'flex',alignItems:'center',position:'relative',overflow:'hidden',zIndex:10}}>
        <div className="container" style={{width:'100%',paddingTop:60,paddingBottom:80}}>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?40:60,alignItems:'center'}}>
            <div>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.2}}
                style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
                <div className="badge">
                  <motion.div animate={{scale:[1,1.3,1],opacity:[1,.5,1]}} transition={{duration:2,repeat:Infinity}} style={{width:6,height:6,borderRadius:'50%',background:'#00d4ff'}}/>
                  Available for Opportunities
                </div>
              </motion.div>

              <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.3,ease:[.23,1,.32,1]}}>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.72rem',color:'rgba(0,102,255,.8)',letterSpacing:'.2em',marginBottom:12}}>{`// ${data.hero.title}`}</div>
                <h1 style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'clamp(2.4rem,6vw,5.2rem)',lineHeight:.95,color:'#fff',marginBottom:20,letterSpacing:'-.03em'}}>
                  {data.hero.name.split(' ').map((w,i)=>(
                    <span key={i} className={i===data.hero.name.split(' ').length-1?'grad':''} style={{display:'block'}}>{w}</span>
                  ))}
                </h1>
              </motion.div>

              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.7,delay:.5}}
                style={{fontSize:'1.05rem',color:'var(--white3)',lineHeight:1.85,maxWidth:480,marginBottom:36,borderLeft:'2px solid rgba(0,102,255,.3)',paddingLeft:18}}>
                {data.hero.bio}
              </motion.p>

              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.6}}
                style={{display:'flex',gap:32,marginBottom:40,flexWrap:'wrap'}}>
                {[{n:'3+',l:'Years\nExperience'},{n:'11',l:'Professional\nCertifications'},{n:'6',l:'Security\nDomains'}].map((s,i)=>(
                  <div key={s.l}>
                    <div className="big-num grad">{s.n}</div>
                    <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.6rem',color:'var(--white4)',letterSpacing:'.1em',marginTop:6,lineHeight:1.5,whiteSpace:'pre-line'}}>{s.l.toUpperCase()}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.7}}
                style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <motion.button whileHover={{scale:1.02,y:-2}} whileTap={{scale:.98}} className="btn-primary" onClick={()=>scrollTo('contact')}>
                  <span>Get In Touch</span><span>→</span>
                </motion.button>
                {data.hero.resumeUrl&&(
                  <motion.a whileHover={{scale:1.02}} href={data.hero.resumeUrl} download className="btn-outline" style={{textDecoration:'none'}}>
                    <span>↓</span><span>Download CV</span>
                  </motion.a>
                )}
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:.98}} className="btn-outline" onClick={()=>scrollTo('lab')}>
                  <span>🔐</span><span>Cyber Lab</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Right side — 3D globe hint + profile */}
            {!isMobile&&(
              <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{duration:1,delay:.4,ease:[.23,1,.32,1]}}
                style={{display:'flex',justifyContent:'center',alignItems:'center',position:'relative',height:420}}>
                {data.hero.profileImage?(
                  <div style={{position:'relative'}}>
                    <div style={{position:'absolute',inset:-2,background:'linear-gradient(135deg,#0066ff,#00d4ff,transparent)',borderRadius:'50%',opacity:.6,animation:'float 6s ease-in-out infinite'}}/>
                    <img src={data.hero.profileImage} alt={data.hero.name} style={{width:280,height:280,borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(0,102,255,.3)',position:'relative',zIndex:1,filter:'contrast(1.05)'}}/>
                    {/* Floating skill badges */}
                    {[{label:'Azure',x:-60,y:20,delay:.8},{label:'FortiGate',x:60,y:-30,delay:1},{label:'CISSP',x:-40,y:-60,delay:1.2}].map(b=>(
                      <motion.div key={b.label} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:b.delay}} style={{position:'absolute',left:`calc(50% + ${b.x}px)`,top:`calc(50% + ${b.y}px)`,transform:'translate(-50%,-50%)'}} className="badge">
                        {b.label}
                      </motion.div>
                    ))}
                  </div>
                ):(
                  <div style={{position:'relative',width:320,height:320}}>
                    {/* Animated rings */}
                    {[1,2,3].map((r,i)=>(
                      <motion.div key={r} animate={{rotate:360}} transition={{duration:10+i*5,repeat:Infinity,ease:'linear'}}
                        style={{position:'absolute',inset:i*30,border:`1px solid rgba(0,102,255,${.3-i*.08})`,borderRadius:'50%',borderStyle:'dashed'}}/>
                    ))}
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:8}}>
                      <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'4rem',background:'linear-gradient(135deg,#fff,#0066ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>AB</div>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.6rem',color:'rgba(0,102,255,.6)',letterSpacing:'.2em'}}>UPLOAD PHOTO</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Scroll */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}
            style={{position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <motion.div animate={{y:[0,8,0]}} transition={{duration:1.5,repeat:Infinity}}
              style={{width:1,height:48,background:'linear-gradient(to bottom,rgba(0,102,255,.6),transparent)'}}/>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.55rem',color:'var(--white4)',letterSpacing:'.2em'}}>SCROLL</span>
          </motion.div>
        </div>
      </section>

      {/* ── SKILLS VISUALIZATION ── */}
      <section id="skills" className="section section-dark" style={{zIndex:10}}>
        <div className="container">
          <motion.div {...fadeUp} style={{marginBottom:56}}>
            <div className="sec-tag">Expertise</div>
            <h2 className="sec-title">Skill <span className="grad">Matrix</span></h2>
            <p className="sec-sub">A comprehensive breakdown of my technical capabilities and proficiency levels across cybersecurity domains.</p>
          </motion.div>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:32}}>
            {/* Left — skill bars */}
            <div>
              <motion.div {...fadeUp} style={{marginBottom:8,fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--white4)',letterSpacing:'.2em'}}>PROFICIENCY LEVELS</motion.div>
              {[
                {name:'Cloud Security (Azure/AWS)',pct:92,color:'#0066ff'},
                {name:'Network Security & Firewalls',pct:95,color:'#00d4ff'},
                {name:'SIEM / EDR / XDR',pct:88,color:'#0066ff'},
                {name:'Incident Response & DRP',pct:85,color:'#00d4ff'},
                {name:'Vulnerability Assessment',pct:90,color:'#0066ff'},
                {name:'Identity & Access Management',pct:93,color:'#00d4ff'},
                {name:'Compliance & Governance',pct:82,color:'#0066ff'},
                {name:'Endpoint Security',pct:91,color:'#00d4ff'},
              ].map((skill,i)=>(
                <motion.div key={skill.name} {...stagger(i)} style={{marginBottom:20}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <span style={{fontSize:'.88rem',fontWeight:500,color:'var(--white2)'}}>{skill.name}</span>
                    <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.72rem',color:skill.color}}>{skill.pct}%</span>
                  </div>
                  <div className="skill-track">
                    <div className="skill-fill" style={{'--pct':`${skill.pct}%`,background:`linear-gradient(90deg,var(--blue),${skill.color})`} as any}/>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right — skill cards */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,alignContent:'start'}}>
              {data.skills.map((skill,i)=>(
                <motion.div key={skill.id} {...stagger(i)} className="card" style={{padding:'20px 18px'}}
                  whileHover={{y:-4,transition:{duration:.2}}}>
                  <div style={{fontSize:'1.6rem',marginBottom:10}}>{skill.icon}</div>
                  <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:600,fontSize:'.9rem',color:'#fff',marginBottom:8,lineHeight:1.2}}>{skill.title}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                    {skill.technologies.slice(0,3).map(t=>(
                      <span key={t} style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.55rem',padding:'2px 7px',border:'1px solid rgba(0,102,255,.2)',color:'rgba(0,212,255,.7)',background:'rgba(0,102,255,.05)'}}>{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section" style={{zIndex:10}}>
        <div className="container">
          <motion.div {...fadeUp} style={{marginBottom:56}}>
            <div className="sec-tag">About Me</div>
            <h2 className="sec-title">The <span className="grad">Professional</span></h2>
          </motion.div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:64,alignItems:'center'}}>
            <div>
              {data.hero.profileImage?(
                <motion.div {...fadeUp} style={{position:'relative'}}>
                  <img src={data.hero.profileImage} alt={data.hero.name} style={{width:'100%',maxWidth:420,border:'1px solid rgba(0,102,255,.2)',display:'block'}}/>
                  <div style={{position:'absolute',top:-12,left:-12,width:48,height:48,borderTop:'2px solid #0066ff',borderLeft:'2px solid #0066ff'}}/>
                  <div style={{position:'absolute',bottom:-12,right:-12,width:48,height:48,borderBottom:'2px solid #00d4ff',borderRight:'2px solid #00d4ff'}}/>
                </motion.div>
              ):(
                <motion.div {...fadeUp} className="card" style={{height:340,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
                  <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'5rem',color:'rgba(0,102,255,.15)'}}>AB</div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--white4)',letterSpacing:'.2em'}}>ADD PHOTO VIA ADMIN</div>
                </motion.div>
              )}
            </div>
            <div>
              <motion.p {...fadeUp} style={{fontSize:'1.05rem',color:'var(--white3)',lineHeight:1.9,marginBottom:32}}>{data.hero.bio}</motion.p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:32}}>
                {[{k:'Location',v:data.hero.location},{k:'Status',v:'Open to Work'},{k:'Role',v:'Team Leader'},{k:'Domain',v:'Cybersecurity'}].map((item,i)=>(
                  <motion.div key={item.k} {...stagger(i)} className="card" style={{padding:'14px 16px'}}>
                    <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.58rem',color:'var(--white4)',letterSpacing:'.15em',marginBottom:5}}>{item.k.toUpperCase()}</div>
                    <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:600,fontSize:'.9rem',color:'#fff'}}>{item.v}</div>
                  </motion.div>
                ))}
              </div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <motion.a whileHover={{scale:1.02}} className="btn-primary" href={`mailto:${data.hero.email}`} style={{textDecoration:'none'}}><span>Send Email</span></motion.a>
                {data.hero.linkedin&&<motion.a whileHover={{scale:1.02}} className="btn-outline" href={data.hero.linkedin} target="_blank" style={{textDecoration:'none'}}><span>LinkedIn</span></motion.a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section section-dark" style={{zIndex:10}}>
        <div className="container">
          <motion.div {...fadeUp} style={{marginBottom:56}}>
            <div className="sec-tag">Career</div>
            <h2 className="sec-title">Work <span className="grad">Experience</span></h2>
          </motion.div>
          <div style={{display:'flex',gap:32}}>
            {!isMobile&&(
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',paddingTop:12,paddingBottom:12}}>
                <div className="tl-dot"/>
                <div className="tl-line"/>
              </div>
            )}
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:24}}>
              {data.experience.map((exp,i)=>(
                <motion.div key={exp.id} {...stagger(i)} className="card" style={{padding:isMobile?'24px 20px':'36px 40px'}}>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'200px 1fr',gap:isMobile?20:48}}>
                    <div>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.6rem',color:'var(--blue)',letterSpacing:'.15em',marginBottom:8}}>CURRENT ROLE</div>
                      <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'1.1rem',color:'#fff',marginBottom:10,lineHeight:1.2}}>{exp.company}</div>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.68rem',color:'var(--white3)',marginBottom:4}}>{exp.location}</div>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--white4)',marginBottom:20}}>{exp.period}</div>
                      <div className="badge" style={{fontSize:'.6rem',padding:'5px 12px'}}>{exp.title.split(' ').slice(0,2).join(' ')}</div>
                    </div>
                    <div>
                      <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:600,fontSize:'1.05rem',color:'#fff',marginBottom:12}}>{exp.title}</div>
                      <p style={{fontSize:'.92rem',color:'var(--white3)',lineHeight:1.85,marginBottom:24,borderLeft:'2px solid rgba(0,102,255,.25)',paddingLeft:16}}>{exp.description}</p>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.62rem',color:'var(--blue)',letterSpacing:'.2em',marginBottom:16}}>KEY ACHIEVEMENTS</div>
                      <div style={{display:'flex',flexDirection:'column',gap:10}}>
                        {exp.achievements.map((a,j)=>(
                          <motion.div key={j} initial={{opacity:0,x:-12}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:j*.04}}
                            style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                            <div style={{width:6,height:6,borderRadius:'50%',background:'var(--blue)',flexShrink:0,marginTop:7,boxShadow:'0 0 8px rgba(0,102,255,.6)'}}/>
                            <span style={{fontSize:'.9rem',color:'var(--white2)',lineHeight:1.65}}>{a}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section id="certifications" className="section" style={{zIndex:10}}>
        <div className="container">
          <motion.div {...fadeUp} style={{marginBottom:48}}>
            <div className="sec-tag">Credentials</div>
            <h2 className="sec-title">Certifications & <span className="grad">Achievements</span></h2>
          </motion.div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {data.certifications.map((cert,i)=>(
              <motion.div key={cert.id} {...stagger(i%6)} className="cert-card">
                <div style={{width:40,height:40,border:'1px solid rgba(0,102,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'1.2rem',background:'rgba(0,102,255,.05)'}}>
                  {cert.image?<img src={cert.image} alt={cert.name} style={{width:26,height:26,objectFit:'contain'}}/>:cert.icon}
                </div>
                <div>
                  <div style={{fontFamily:'inherit',fontSize:'.82rem',fontWeight:500,color:'var(--white2)',lineHeight:1.35,marginBottom:6}}>{cert.name}</div>
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.58rem',color:'var(--cyan2)',padding:'2px 8px',border:'1px solid rgba(0,212,255,.15)',background:'rgba(0,212,255,.04)'}}>{cert.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CYBER LAB (Interactive Games) ── */}
      <CyberLab isMobile={isMobile}/>

      {/* ── CONTACT ── */}
      <section id="contact" className="section section-dark" style={{zIndex:10,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'clamp(4rem,15vw,14rem)',color:'rgba(0,102,255,.03)',whiteSpace:'nowrap',pointerEvents:'none',userSelect:'none'}}>CONTACT</div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <motion.div {...fadeUp} style={{marginBottom:56}}>
            <div className="sec-tag">Get In Touch</div>
            <h2 className="sec-title">Let&apos;s <span className="grad">Connect</span></h2>
            <p className="sec-sub">Open to cybersecurity roles, consulting, and challenging infrastructure projects across the GCC and globally.</p>
          </motion.div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?40:64}}>
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:36}}>
                {[{l:'Email',v:data.hero.email,h:`mailto:${data.hero.email}`,icon:'✉'},{l:'Phone',v:data.hero.phone,h:`tel:${data.hero.phone}`,icon:'📱'},{l:'LinkedIn',v:'ahamed-bazil-mn',h:data.hero.linkedin,icon:'💼'},{l:'Location',v:data.hero.location,h:'#',icon:'📍'}].map((item,i)=>(
                  <motion.a key={item.l} {...stagger(i)} href={item.h}
                    style={{display:'flex',alignItems:'center',gap:18,padding:'16px 20px',border:'1px solid var(--border)',background:'var(--card)',textDecoration:'none',transition:'all .3s'}}
                    whileHover={{borderColor:'rgba(0,102,255,.4)',x:4}}>
                    <span style={{fontSize:'1.1rem',width:28,textAlign:'center'}}>{item.icon}</span>
                    <div style={{width:1,height:20,background:'var(--border2)',flexShrink:0}}/>
                    <div>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.58rem',color:'var(--white4)',letterSpacing:'.15em',marginBottom:2}}>{item.l.toUpperCase()}</div>
                      <div style={{fontSize:'.88rem',color:'#fff',fontWeight:500}}>{item.v}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
              <motion.div {...fadeUp} className="card" style={{padding:'20px 24px',display:'flex',alignItems:'center',gap:14}}>
                <motion.div animate={{scale:[1,1.3,1],opacity:[1,.4,1]}} transition={{duration:2,repeat:Infinity}} style={{width:10,height:10,borderRadius:'50%',background:'#00d4ff',boxShadow:'0 0 16px rgba(0,212,255,.6)',flexShrink:0}}/>
                <div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.6rem',color:'var(--white4)',letterSpacing:'.15em',marginBottom:2}}>STATUS</div>
                  <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:600,color:'#fff'}}>Open to New Opportunities</div>
                </div>
              </motion.div>
            </div>
            <ContactForm email={data.hero.email}/>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'28px 32px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(2,11,24,.99)',flexWrap:'wrap',gap:12,position:'relative',zIndex:10}}>
        <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.62rem',color:'var(--white4)'}}>© {new Date().getFullYear()} Ahamed Bazil. All rights reserved.</span>
        <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.62rem',color:'var(--white4)'}}>ahamedbazil.com</span>
      </footer>

      {/* ── AI CHATBOT ── */}
      <AIChatbot />
    </>
  )
}

// ── CYBER LAB ──
function CyberLab({isMobile}:{isMobile:boolean}) {
  const [activeGame, setActiveGame] = useState<'password'|'phishing'|'cipher'|null>(null)
  const fadeUp={initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.1},transition:{duration:.75,ease:[.23,1,.32,1]}}

  return (
    <section id="lab" className="section section-dark" style={{zIndex:10}}>
      <div className="container">
        <motion.div {...fadeUp} style={{marginBottom:16}}>
          <div className="sec-tag">Interactive</div>
          <h2 className="sec-title">Cyber <span className="grad">Lab</span></h2>
          <p className="sec-sub" style={{marginTop:12}}>Test your cybersecurity knowledge with these interactive challenges. Built by a cybersecurity professional, for curious minds.</p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':window&&window.innerWidth<900?'1fr 1fr':'repeat(3,1fr)',gap:20,marginTop:48}}>
          {[
            {id:'password' as const,icon:'🔐',title:'Password Strength Analyzer',desc:'Type any password and get a real-time security score with professional recommendations.',badge:'LIVE TOOL'},
            {id:'phishing' as const,icon:'🎣',title:'Phishing Email Detector',desc:'Can you spot the phishing email? Test your ability to identify social engineering attacks.',badge:'QUIZ'},
            {id:'cipher' as const,icon:'🔑',title:'Caesar Cipher Decoder',desc:'Decode encrypted messages using the classic Caesar cipher — the same technique used in early cryptography.',badge:'CHALLENGE'},
          ].map((game,i)=>(
            <motion.div key={game.id} {...{...fadeUp,transition:{...fadeUp.transition,delay:i*.1}}}
              className="game-card" style={{cursor:'pointer',borderColor:activeGame===game.id?'rgba(0,102,255,.5)':'var(--border2)'}}
              onClick={()=>setActiveGame(activeGame===game.id?null:game.id)}
              whileHover={{y:-4,transition:{duration:.2}}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                <span style={{fontSize:'2rem'}}>{game.icon}</span>
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.58rem',padding:'3px 8px',border:'1px solid rgba(0,102,255,.3)',color:'var(--cyan)',background:'rgba(0,102,255,.08)'}}>{game.badge}</span>
              </div>
              <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:600,fontSize:'1rem',color:'#fff',marginBottom:10,lineHeight:1.3}}>{game.title}</div>
              <p style={{fontSize:'.85rem',color:'var(--white3)',lineHeight:1.65,marginBottom:20}}>{game.desc}</p>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:activeGame===game.id?'var(--cyan)':'var(--blue)',letterSpacing:'.1em'}}>
                {activeGame===game.id?'▼ CLOSE':'▶ LAUNCH'}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activeGame==='password'&&<PasswordGame key="pw"/>}
          {activeGame==='phishing'&&<PhishingGame key="ph"/>}
          {activeGame==='cipher'&&<CipherGame key="ci"/>}
        </AnimatePresence>
      </div>
    </section>
  )
}

function PasswordGame() {
  const [pw,setPw]=useState('')
  const [show,setShow]=useState(false)

  const analyze=(p:string)=>{
    let score=0
    const checks={length:p.length>=12,upper:/[A-Z]/.test(p),lower:/[a-z]/.test(p),num:/[0-9]/.test(p),special:/[!@#$%^&*(),.?":{}|<>]/.test(p),noCommon:!['password','123456','qwerty','abc123'].some(c=>p.toLowerCase().includes(c))}
    Object.values(checks).forEach(v=>{if(v)score++})
    const labels=['Critical','Weak','Fair','Good','Strong','Excellent']
    const colors=['#ff0040','#ff4444','#ff8800','#ffcc00','#00cc66','#0066ff']
    return{score,checks,label:labels[score]||'Critical',color:colors[score]||'#ff0040',pct:Math.round((score/6)*100)}
  }

  const a=analyze(pw)

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
      style={{marginTop:24,padding:isMobileCheck()?'24px 20px':'32px 40px',border:'1px solid rgba(0,102,255,.3)',background:'rgba(4,16,32,.95)',backdropFilter:'blur(20px)'}}>
      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.7rem',color:'var(--blue)',letterSpacing:'.2em',marginBottom:20}}>// PASSWORD STRENGTH ANALYZER</div>
      <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
        <input type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Enter a password to analyze..." className="inp" style={{flex:1,minWidth:200}}/>
        <button onClick={()=>setShow(!show)} className="btn-outline" style={{cursor:'pointer',whiteSpace:'nowrap',padding:'12px 20px',fontSize:'.8rem'}}>{show?'Hide':'Show'}</button>
      </div>
      {pw&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <span style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'1.1rem',color:a.color}}>{a.label}</span>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.75rem',color:a.color}}>{a.pct}%</span>
          </div>
          <div style={{height:6,background:'var(--border)',borderRadius:4,marginBottom:24,overflow:'hidden'}}>
            <motion.div initial={{width:0}} animate={{width:`${a.pct}%`}} transition={{duration:.8,ease:[.23,1,.32,1]}} style={{height:'100%',background:a.color,borderRadius:4,boxShadow:`0 0 12px ${a.color}60`}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {Object.entries({
              '12+ Characters':a.checks.length,
              'Uppercase Letters':a.checks.upper,
              'Lowercase Letters':a.checks.lower,
              'Numbers':a.checks.num,
              'Special Characters':a.checks.special,
              'Not a Common Password':a.checks.noCommon,
            }).map(([k,v])=>(
              <div key={k} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',border:`1px solid ${v?'rgba(0,102,255,.25)':'var(--border)'}`,background:v?'rgba(0,102,255,.05)':'transparent'}}>
                <span style={{fontSize:'1rem'}}>{v?'✅':'❌'}</span>
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:v?'var(--cyan)':'var(--white4)'}}>{k}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

const isMobileCheck=()=>typeof window!=='undefined'&&window.innerWidth<768

function PhishingGame() {
  const [current,setCurrent]=useState(0)
  const [selected,setSelected]=useState<boolean|null>(null)
  const [score,setScore]=useState(0)
  const [done,setDone]=useState(false)

  const emails=[
    {from:'security@paypa1.com',subject:'Urgent: Your account has been limited!',body:'Dear Customer, We have detected suspicious activity. Click here immediately to verify your account or it will be suspended in 24 hours.',isPhishing:true,hint:'The domain is "paypa1.com" (number 1 instead of L) — a classic homograph attack.'},
    {from:'newsletter@github.com',subject:'GitHub Security Alert: New sign-in from Chrome',body:'A new sign-in to your GitHub account was detected from Chrome on Windows. If this was you, no action is needed. If not, please review your security settings.',isPhishing:false,hint:'Legitimate GitHub security alert — correct domain, professional tone, no urgent pressure.'},
    {from:'hr@company-payroll.net',subject:'Action Required: Update your direct deposit',body:'Hi Employee, Please update your direct deposit information before Friday or your paycheck will be delayed. Click here to update.',isPhishing:true,hint:'Unsolicited payroll change request from unknown domain — a Business Email Compromise (BEC) attack.'},
    {from:'no-reply@microsoft.com',subject:'Your Microsoft 365 subscription renewal',body:'Your Microsoft 365 Business subscription will automatically renew on June 1, 2026. Your payment method on file will be charged. Manage your subscription at account.microsoft.com.',isPhishing:false,hint:'Legitimate renewal notice — correct domain, no urgency tricks, directs to official domain.'},
  ]

  const e=emails[current]

  const answer=(isPhishing:boolean)=>{
    setSelected(isPhishing)
    if(isPhishing===e.isPhishing) setScore(s=>s+1)
    setTimeout(()=>{
      if(current<emails.length-1){setCurrent(c=>c+1);setSelected(null)}
      else setDone(true)
    },2000)
  }

  if(done) return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}
      style={{marginTop:24,padding:'32px 40px',border:'1px solid rgba(0,102,255,.3)',background:'rgba(4,16,32,.95)',textAlign:'center'}}>
      <div style={{fontSize:'3rem',marginBottom:16}}>{score>=3?'🏆':score>=2?'🥈':'🎯'}</div>
      <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'2rem',color:'#fff',marginBottom:8}}>{score}/{emails.length} Correct</div>
      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.72rem',color:'var(--white3)',marginBottom:24}}>{score===4?'EXPERT — Perfect score! You think like a security professional.':score===3?'ADVANCED — Strong phishing awareness.':score===2?'INTERMEDIATE — Keep practicing.':'BEGINNER — Study phishing indicators.'}</div>
      <button onClick={()=>{setCurrent(0);setSelected(null);setScore(0);setDone(false)}} className="btn-primary" style={{cursor:'pointer'}}><span>Play Again</span></button>
    </motion.div>
  )

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
      style={{marginTop:24,padding:'32px 40px',border:'1px solid rgba(0,102,255,.3)',background:'rgba(4,16,32,.95)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.7rem',color:'var(--blue)',letterSpacing:'.2em'}}>// PHISHING DETECTOR — EMAIL {current+1}/{emails.length}</div>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.7rem',color:'var(--white3)'}}>Score: {score}</div>
      </div>
      <div style={{padding:'20px 24px',border:'1px solid var(--border)',background:'rgba(2,11,24,.8)',marginBottom:24,fontFamily:'JetBrains Mono,monospace'}}>
        <div style={{fontSize:'.7rem',color:'var(--white4)',marginBottom:12,display:'grid',gap:6}}>
          <div><span style={{color:'var(--blue)'}}>FROM: </span>{e.from}</div>
          <div><span style={{color:'var(--blue)'}}>SUBJECT: </span>{e.subject}</div>
        </div>
        <div style={{height:1,background:'var(--border)',marginBottom:16}}/>
        <p style={{fontSize:'.85rem',color:'var(--white2)',lineHeight:1.75,fontFamily:'inherit'}}>{e.body}</p>
      </div>
      {selected===null?(
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:.98}} onClick={()=>answer(true)} style={{flex:1,padding:'14px',background:'rgba(255,51,85,.1)',border:'1px solid rgba(255,51,85,.4)',color:'#ff3355',fontFamily:'JetBrains Mono,monospace',fontSize:'.8rem',letterSpacing:'.1em',cursor:'pointer',transition:'all .2s'}}>
            🎣 PHISHING
          </motion.button>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:.98}} onClick={()=>answer(false)} style={{flex:1,padding:'14px',background:'rgba(0,204,102,.1)',border:'1px solid rgba(0,204,102,.4)',color:'#00cc66',fontFamily:'JetBrains Mono,monospace',fontSize:'.8rem',letterSpacing:'.1em',cursor:'pointer',transition:'all .2s'}}>
            ✅ LEGITIMATE
          </motion.button>
        </div>
      ):(
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{padding:'16px 20px',border:`1px solid ${selected===e.isPhishing?'rgba(0,102,255,.4)':'rgba(255,51,85,.4)'}`,background:`${selected===e.isPhishing?'rgba(0,102,255,.08)':'rgba(255,51,85,.08)'}`}}>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.7rem',color:selected===e.isPhishing?'var(--cyan)':'#ff3355',marginBottom:6}}>
            {selected===e.isPhishing?'✅ CORRECT!':'❌ INCORRECT!'}
          </div>
          <p style={{fontSize:'.85rem',color:'var(--white3)',lineHeight:1.65}}>{e.hint}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

function CipherGame() {
  const [shift,setShift]=useState(3)
  const [input,setInput]=useState('')
  const [mode,setMode]=useState<'encode'|'decode'>('decode')

  const messages=['Khoor, Zruog!','Fdhvdu flskhu lv ixq!','Vhfxulwb lv hyhubzkhuh.','Hqfubswlrq surwhfwv gdwd.']
  const [msgIdx,setMsgIdx]=useState(0)

  const process=(text:string,s:number,enc:boolean)=>text.split('').map(c=>{
    if(!/[a-zA-Z]/.test(c)) return c
    const base=c<='Z'?65:97
    const shifted=enc?(((c.charCodeAt(0)-base+s)%26)+base):(((c.charCodeAt(0)-base-s+26)%26)+base)
    return String.fromCharCode(shifted)
  }).join('')

  const encoded=mode==='decode'?messages[msgIdx]:process(input,shift,true)
  const decoded=mode==='decode'?process(messages[msgIdx],shift,false):process(input,shift,true)

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
      style={{marginTop:24,padding:'32px 40px',border:'1px solid rgba(0,102,255,.3)',background:'rgba(4,16,32,.95)'}}>
      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.7rem',color:'var(--blue)',letterSpacing:'.2em',marginBottom:20}}>// CAESAR CIPHER {mode.toUpperCase()}</div>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {(['decode','encode'] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{padding:'8px 20px',background:mode===m?'var(--blue)':'transparent',border:`1px solid ${mode===m?'var(--blue)':'var(--border2)'}`,color:mode===m?'#fff':'var(--white3)',fontFamily:'JetBrains Mono,monospace',fontSize:'.7rem',letterSpacing:'.1em',cursor:'pointer',transition:'all .2s'}}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--white4)',letterSpacing:'.15em'}}>SHIFT VALUE</span>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.75rem',color:'var(--blue)'}}>{shift}</span>
        </div>
        <input type="range" min={1} max={25} value={shift} onChange={e=>setShift(+e.target.value)} style={{width:'100%',accentColor:'#0066ff',cursor:'pointer'}}/>
        <div style={{display:'flex',justifyContent:'space-between',fontFamily:'JetBrains Mono,monospace',fontSize:'.6rem',color:'var(--white4)',marginTop:4}}>
          <span>1</span><span>← ROT13 = 13 →</span><span>25</span>
        </div>
      </div>
      {mode==='decode'?(
        <div style={{display:'flex',gap:12,marginBottom:12,flexWrap:'wrap'}}>
          {messages.map((_,i)=>(
            <button key={i} onClick={()=>setMsgIdx(i)} style={{padding:'6px 14px',background:msgIdx===i?'rgba(0,102,255,.2)':'transparent',border:`1px solid ${msgIdx===i?'var(--blue)':'var(--border2)'}`,color:msgIdx===i?'var(--cyan)':'var(--white4)',fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',cursor:'pointer',transition:'all .2s'}}>
              MSG {i+1}
            </button>
          ))}
        </div>
      ):(
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--white4)',letterSpacing:'.15em',marginBottom:8}}>INPUT TEXT</div>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type text to encode..." className="inp"/>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
        {[{l:mode==='decode'?'ENCODED':'PLAIN TEXT',v:encoded,c:'var(--white3)'},{l:mode==='decode'?'DECODED (SHIFT '+shift+')':'ENCODED (SHIFT '+shift+')',v:decoded,c:'var(--cyan)'}].map(item=>(
          <div key={item.l} style={{padding:'16px 18px',border:'1px solid var(--border)',background:'rgba(2,11,24,.6)'}}>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.58rem',color:'var(--white4)',letterSpacing:'.15em',marginBottom:8}}>{item.l}</div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.85rem',color:item.c,lineHeight:1.6,wordBreak:'break-all'}}>{item.v||'—'}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ContactForm({email}:{email:string}) {
  const [form,setForm]=useState({name:'',email:'',message:''})
  const [status,setStatus]=useState<'idle'|'sending'|'ok'|'err'>('idle')

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setStatus('sending')
    try{
      const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      if(res.ok){setStatus('ok');setForm({name:'',email:'',message:''})}else setStatus('err')
    }catch{setStatus('err')}
  }

  if(status==='ok') return (
    <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="card"
      style={{padding:48,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,textAlign:'center',minHeight:320}}>
      <div style={{fontSize:'3rem'}}>✅</div>
      <div style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'1.4rem',color:'#fff'}}>Message Sent!</div>
      <p style={{color:'var(--white3)',lineHeight:1.7}}>Thank you for reaching out. I'll get back to you within 24-48 hours.</p>
      <button onClick={()=>setStatus('idle')} className="btn-outline" style={{cursor:'pointer',marginTop:8}}><span>Send Another</span></button>
    </motion.div>
  )

  return (
    <motion.form initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} onSubmit={submit} className="card" style={{padding:'36px 32px'}}>
      {[{k:'name',l:'Your Name',p:'John Smith',t:'text'},{k:'email',l:'Email Address',p:'john@company.com',t:'email'}].map(f=>(
        <div key={f.k} style={{marginBottom:20}}>
          <label style={{display:'block',fontFamily:'JetBrains Mono,monospace',fontSize:'.6rem',color:'var(--white4)',letterSpacing:'.15em',marginBottom:8}}>{f.l.toUpperCase()}</label>
          <input type={f.t} required placeholder={f.p} value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} className="inp"/>
        </div>
      ))}
      <div style={{marginBottom:24}}>
        <label style={{display:'block',fontFamily:'JetBrains Mono,monospace',fontSize:'.6rem',color:'var(--white4)',letterSpacing:'.15em',marginBottom:8}}>MESSAGE</label>
        <textarea required placeholder="Tell me about the opportunity or project..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="inp" style={{minHeight:130,resize:'vertical',lineHeight:1.7}}/>
      </div>
      {status==='err'&&<div style={{color:'#ff3355',fontFamily:'JetBrains Mono,monospace',fontSize:'.7rem',marginBottom:16}}>Failed to send. Please try again.</div>}
      <motion.button type="submit" disabled={status==='sending'} whileHover={{scale:1.01}} whileTap={{scale:.99}}
        className="btn-primary" style={{width:'100%',justifyContent:'center',cursor:status==='sending'?'not-allowed':'none',opacity:status==='sending'?.7:1}}>
        <span>{status==='sending'?'Sending...':'Send Message'}</span>
        <span>{status==='sending'?'⟳':'→'}</span>
      </motion.button>
    </motion.form>
  )
}
