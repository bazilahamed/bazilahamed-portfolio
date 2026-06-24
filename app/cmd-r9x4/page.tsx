'use client'
import { useState, useEffect, useRef } from 'react'
import ImageUpload from '@/components/ImageUpload'

type Project = { id:string;title:string;description:string;image:string;tags:string[];link:string }
type Skill = { id:string;icon:string;title:string;description:string;technologies:string[] }
type Experience = { id:string;title:string;company:string;location:string;period:string;description:string;achievements:string[] }
type Certification = { id:string;name:string;icon:string;category:string;image:string }
type PortfolioData = { hero:Record<string,string>;skills:Skill[];projects?:Project[];experience:Experience[];certifications:Certification[] }

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [data, setData] = useState<PortfolioData | null>(null)
  const [activeTab, setActiveTab] = useState('hero')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [sessionTime, setSessionTime] = useState(15*60)
  const sessionInterval = useRef<ReturnType<typeof setInterval>|null>(null)
  const inactivityTimer = useRef<ReturnType<typeof setTimeout>|null>(null)

  const resetInactivity = () => {
    if(inactivityTimer.current) clearTimeout(inactivityTimer.current)
    inactivityTimer.current = setTimeout(()=>{ setAuthenticated(false); setPassword(''); setData(null); setMessage('⏱ Session expired after 15 minutes of inactivity.') }, 15*60*1000)
  }

  useEffect(()=>{
    if(!authenticated) { if(sessionInterval.current) clearInterval(sessionInterval.current); setSessionTime(15*60); return }
    setSessionTime(15*60)
    sessionInterval.current = setInterval(()=>setSessionTime(t=>Math.max(0,t-1)),1000)
    const events=['mousedown','keydown','scroll','touchstart']
    events.forEach(e=>window.addEventListener(e,resetInactivity))
    resetInactivity()
    return()=>{ if(sessionInterval.current) clearInterval(sessionInterval.current); events.forEach(e=>window.removeEventListener(e,resetInactivity)); if(inactivityTimer.current) clearTimeout(inactivityTimer.current) }
  },[authenticated])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError(''); setAuthLoading(true)
    try {
      const res = await fetch('/api/verify-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})})
      const json = await res.json()
      if(res.ok && json.success) { setAuthenticated(true) }
      else { setAuthError(json.error||'ACCESS DENIED — Invalid credentials'); setPassword('') }
    } catch { setAuthError('Connection error. Try again.') }
    setAuthLoading(false)
  }

  const loadData = async () => {
    try { const res=await fetch('/api/get-content'); setData(await res.json()) } catch { setData(null) }
  }
  useEffect(()=>{ if(authenticated) loadData() },[authenticated])

  const save = async () => {
    if(!data) return; setSaving(true); setMessage('')
    try {
      const res=await fetch('/api/update-content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password,data})})
      const json=await res.json()
      setMessage(json.success?'✅ Saved! Site updates in ~30 seconds.':'❌ '+(json.error||'Error'))
    } catch { setMessage('❌ Network error') }
    setSaving(false)
  }

  const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const inp:React.CSSProperties={width:'100%',padding:'11px 14px',background:'rgba(2,11,24,.8)',border:'1px solid #0a1e38',color:'#f0f6ff',fontFamily:'inherit',fontSize:'.88rem',outline:'none',marginBottom:12,transition:'border-color .2s'}
  const lbl:React.CSSProperties={display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:'#3a5070',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:6}
  const ta:React.CSSProperties={...inp,minHeight:100,resize:'vertical',lineHeight:1.65}
  const card:React.CSSProperties={border:'1px solid #0a1e38',padding:24,marginBottom:16,background:'rgba(2,11,24,.6)'}

  if(!authenticated) return (
    <div style={{minHeight:'100vh',background:'#020b18',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:"'Space Grotesk','Inter',sans-serif",cursor:'default',
      backgroundImage:'linear-gradient(rgba(0,102,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,102,255,.04) 1px,transparent 1px)',backgroundSize:'60px 60px'}}>
      <div style={{width:'100%',maxWidth:420,position:'relative'}}>
        {/* Corner decorations */}
        {[{t:-10,l:-10,bt:'borderTop',bl:'borderLeft'},{t:-10,r:-10,bt:'borderTop',br:'borderRight'},{b:-10,l:-10,bb:'borderBottom',bl:'borderLeft'},{b:-10,r:-10,bb:'borderBottom',br:'borderRight'}].map((_,i)=>(
          <div key={i} style={{position:'absolute',width:32,height:32,...(i===0?{top:-10,left:-10,borderTop:'2px solid #0066ff',borderLeft:'2px solid #0066ff'}:i===1?{top:-10,right:-10,borderTop:'2px solid #0066ff',borderRight:'2px solid #0066ff'}:i===2?{bottom:-10,left:-10,borderBottom:'2px solid #00d4ff',borderLeft:'2px solid #00d4ff'}:{bottom:-10,right:-10,borderBottom:'2px solid #00d4ff',borderRight:'2px solid #00d4ff'})}}/>
        ))}
        <div style={{background:'rgba(4,16,32,.95)',border:'1px solid #0a1e38',padding:'44px 40px',backdropFilter:'blur(20px)',position:'relative'}}>
          <div style={{position:'absolute',top:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,#0066ff,transparent)'}}/>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:28}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#00d4ff',boxShadow:'0 0 10px rgba(0,212,255,.6)',animation:'pulse 2s infinite'}}/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'#0066ff',letterSpacing:'.25em'}}>SYS::ACCESS // RESTRICTED</span>
          </div>
          <div style={{fontFamily:"'Clash Display','Space Grotesk',sans-serif",fontWeight:700,fontSize:'2rem',color:'#fff',marginBottom:6,letterSpacing:'-.02em',lineHeight:1.1}}>
            CONTROL<span style={{background:'linear-gradient(135deg,#0066ff,#00d4ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>//</span>ROOM
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'#3a5070',letterSpacing:'.1em',marginBottom:32}}>Portfolio Management System</div>
          <div style={{height:1,background:'linear-gradient(90deg,transparent,#0a1e38,transparent)',marginBottom:28}}/>
          <form onSubmit={handleAuth}>
            <div style={{marginBottom:16}}>
              <label style={lbl}>ACCESS_KEY</label>
              <input type="password" placeholder="••••••••••••" value={password} onChange={e=>setPassword(e.target.value)}
                style={{...inp,letterSpacing:'.2em',fontSize:'1rem',marginBottom:0}} onFocus={e=>(e.target.style.borderColor='rgba(0,102,255,.5)')} onBlur={e=>(e.target.style.borderColor='#0a1e38')}/>
            </div>
            {authError&&(
              <div style={{padding:'10px 14px',border:`1px solid ${authError.includes('LOCKED')||authError.includes('locked')?'rgba(255,102,0,.35)':'rgba(255,51,85,.35)'}`,background:authError.includes('LOCKED')||authError.includes('locked')?'rgba(255,102,0,.06)':'rgba(255,51,85,.06)',color:authError.includes('LOCKED')||authError.includes('locked')?'#ff6600':'#ff3355',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',marginBottom:14,lineHeight:1.5}}>
                {authError.includes('LOCKED')||authError.includes('locked')?'🔒':'⛔'} {authError}
              </div>
            )}
            <button type="submit" disabled={authLoading} style={{width:'100%',padding:'14px',background:authLoading?'transparent':'linear-gradient(135deg,#0066ff,#0052cc)',border:'1px solid #0066ff',color:authLoading?'#0066ff':'#fff',fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',letterSpacing:'.2em',cursor:authLoading?'not-allowed':'pointer',fontWeight:700,transition:'all .2s',clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))'}}>
              {authLoading?'VERIFYING...':'AUTHENTICATE →'}
            </button>
          </form>
          <div style={{position:'absolute',bottom:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,rgba(0,212,255,.3),transparent)'}}/>
        </div>
        <div style={{textAlign:'center',marginTop:16,fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:'#1a3050',letterSpacing:'.1em'}}>
          ahamedbazil.com // ENCRYPTED // NOINDEX
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}} *{cursor:default!important} input{cursor:text!important} button{cursor:pointer!important}`}</style>
    </div>
  )

  if(!data) return (
    <div style={{minHeight:'100vh',background:'#020b18',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",color:'#0066ff',gap:12}}>
      <div style={{width:20,height:20,border:'2px solid #0066ff',borderTop:'2px solid transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
      Loading content...
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{cursor:default!important}`}</style>
    </div>
  )

  const tabs=[{id:'hero',l:'Hero'},{id:'skills',l:'Skills'},{id:'experience',l:'Experience'},{id:'certifications',l:'Certifications'}]

  return (
    <div style={{minHeight:'100vh',background:'#020b18',fontFamily:"'Space Grotesk','Inter',sans-serif",color:'#c8d8f0',cursor:'default'}}>
      <style>{`*{cursor:default!important} input,textarea{cursor:text!important} button,a{cursor:pointer!important} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Header */}
      <div style={{padding:'0 32px',borderBottom:'1px solid #0a1e38',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(4,16,32,.96)',position:'sticky',top:0,zIndex:100,height:64,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:32,height:32,background:'linear-gradient(135deg,#0066ff,#00d4ff)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.6rem',color:'#fff',fontWeight:700,fontFamily:"'JetBrains Mono',monospace",clipPath:'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))'}}>AB</div>
          <div>
            <div style={{fontFamily:"'Clash Display','Space Grotesk',sans-serif",fontWeight:700,fontSize:'.88rem',color:'#fff',letterSpacing:'-.01em'}}>CONTROL//ROOM</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.5rem',color:'#3a5070',letterSpacing:'.15em'}}>PORTFOLIO CMS</div>
          </div>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          {/* Session timer */}
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'5px 12px',border:'1px solid #0a1e38',background:'rgba(2,11,24,.6)'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:sessionTime<120?'#ff6600':'#00d4ff',boxShadow:`0 0 6px ${sessionTime<120?'#ff6600':'#00d4ff'}`,animation:'pulse 2s infinite'}}/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:sessionTime<120?'#ff6600':'#3a5070',letterSpacing:'.1em'}}>SESSION: {fmt(sessionTime)}</span>
          </div>
          {message&&<div style={{fontSize:'.78rem',color:message.startsWith('✅')?'#00d4ff':'#ff3355',maxWidth:280}}>{message}</div>}
          <button onClick={save} disabled={saving} style={{padding:'9px 22px',background:saving?'transparent':'linear-gradient(135deg,#0066ff,#0052cc)',border:'1px solid #0066ff',color:saving?'#0066ff':'#fff',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',letterSpacing:'.12em',cursor:saving?'not-allowed':'pointer',fontWeight:700,transition:'all .2s'}}>
            {saving?'SAVING...':'SAVE & DEPLOY →'}
          </button>
          <a href="/" style={{padding:'8px 16px',border:'1px solid #0a1e38',color:'#3a5070',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',textDecoration:'none',letterSpacing:'.1em',transition:'all .2s'}}>VIEW SITE</a>
        </div>
      </div>

      <div style={{display:'flex',minHeight:'calc(100vh - 64px)'}}>
        {/* Sidebar */}
        <div style={{width:200,background:'rgba(4,16,32,.6)',borderRight:'1px solid #0a1e38',padding:'24px 0',flexShrink:0}}>
          {tabs.map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{display:'block',width:'100%',padding:'12px 24px',background:activeTab===tab.id?'rgba(0,102,255,.1)':'transparent',border:'none',borderLeft:activeTab===tab.id?'2px solid #0066ff':'2px solid transparent',color:activeTab===tab.id?'#fff':'#3a5070',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',letterSpacing:'.1em',textAlign:'left',cursor:'pointer',textTransform:'uppercase',transition:'all .2s'}}>
              {tab.l}
            </button>
          ))}
          <div style={{margin:'24px 16px 0',padding:'12px 14px',border:'1px solid #0a1e38',background:'rgba(2,11,24,.4)'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',color:'#1a3050',letterSpacing:'.15em',marginBottom:4}}>LOGGED IN AS</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'#0066ff'}}>ahamed.bazil</div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,padding:40,maxWidth:960,overflowY:'auto'}}>

          {/* HERO */}
          {activeTab==='hero'&&(
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'#0066ff',letterSpacing:'.2em',marginBottom:24}}>// HERO SECTION</div>
              <ImageUpload label="Profile Photo" size="large" value={data.hero.profileImage||''} onChange={url=>setData({...data,hero:{...data.hero,profileImage:url}})}/>
              {Object.entries(data.hero).filter(([k])=>k!=='profileImage').map(([key,val])=>(
                <div key={key} style={{marginBottom:16}}>
                  <label style={lbl}>{key}</label>
                  {key==='bio'?<textarea style={ta} value={val} onChange={e=>setData({...data,hero:{...data.hero,[key]:e.target.value}})} onFocus={e=>(e.target.style.borderColor='rgba(0,102,255,.4)')} onBlur={e=>(e.target.style.borderColor='#0a1e38')}/>
                  :<input style={inp} value={val} onChange={e=>setData({...data,hero:{...data.hero,[key]:e.target.value}})} onFocus={e=>(e.target.style.borderColor='rgba(0,102,255,.4)')} onBlur={e=>(e.target.style.borderColor='#0a1e38')}/>}
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {activeTab==='skills'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'#0066ff',letterSpacing:'.2em'}}>// SKILLS ({data.skills.length})</div>
                <button onClick={()=>setData({...data,skills:[...data.skills,{id:Date.now().toString(),icon:'🔧',title:'New Skill',description:'',technologies:[]}]})} style={{padding:'7px 16px',border:'1px solid #0a1e38',background:'transparent',color:'#0066ff',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',cursor:'pointer',transition:'all .2s'}}>+ ADD SKILL</button>
              </div>
              {data.skills.map((skill,i)=>(
                <div key={skill.id} style={card}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'#0066ff'}}>SKILL {i+1}</span>
                    <button onClick={()=>setData({...data,skills:data.skills.filter((_,idx)=>idx!==i)})} style={{background:'none',border:'none',color:'#ff3355',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem'}}>REMOVE</button>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:12}}>
                    <div><label style={lbl}>Icon</label><input style={inp} value={skill.icon} onChange={e=>{const s=[...data.skills];s[i]={...s[i],icon:e.target.value};setData({...data,skills:s})}}/></div>
                    <div><label style={lbl}>Title</label><input style={inp} value={skill.title} onChange={e=>{const s=[...data.skills];s[i]={...s[i],title:e.target.value};setData({...data,skills:s})}}/></div>
                  </div>
                  <label style={lbl}>Description</label>
                  <textarea style={ta} value={skill.description} onChange={e=>{const s=[...data.skills];s[i]={...s[i],description:e.target.value};setData({...data,skills:s})}}/>
                  <label style={lbl}>Technologies (comma separated)</label>
                  <input style={inp} value={skill.technologies.join(', ')} onChange={e=>{const s=[...data.skills];s[i]={...s[i],technologies:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)};setData({...data,skills:s})}}/>
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE */}
          {activeTab==='experience'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'#0066ff',letterSpacing:'.2em'}}>// EXPERIENCE ({data.experience.length})</div>
                <button onClick={()=>setData({...data,experience:[...data.experience,{id:Date.now().toString(),title:'New Role',company:'',location:'',period:'',description:'',achievements:[]}]})} style={{padding:'7px 16px',border:'1px solid #0a1e38',background:'transparent',color:'#0066ff',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',cursor:'pointer'}}>+ ADD ROLE</button>
              </div>
              {data.experience.map((exp,i)=>(
                <div key={exp.id} style={card}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'#0066ff'}}>ROLE {i+1}</span>
                    <button onClick={()=>setData({...data,experience:data.experience.filter((_,idx)=>idx!==i)})} style={{background:'none',border:'none',color:'#ff3355',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem'}}>REMOVE</button>
                  </div>
                  {(['title','company','location','period'] as const).map(field=>(
                    <div key={field}><label style={lbl}>{field}</label><input style={inp} value={exp[field]} onChange={e=>{const ex=[...data.experience];ex[i]={...ex[i],[field]:e.target.value};setData({...data,experience:ex})}}/></div>
                  ))}
                  <label style={lbl}>Description</label>
                  <textarea style={ta} value={exp.description} onChange={e=>{const ex=[...data.experience];ex[i]={...ex[i],description:e.target.value};setData({...data,experience:ex})}}/>
                  <label style={lbl}>Achievements (one per line)</label>
                  <textarea style={{...ta,minHeight:180}} value={exp.achievements.join('\n')} onChange={e=>{const ex=[...data.experience];ex[i]={...ex[i],achievements:e.target.value.split('\n').filter(Boolean)};setData({...data,experience:ex})}}/>
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATIONS */}
          {activeTab==='certifications'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'#0066ff',letterSpacing:'.2em'}}>// CERTIFICATIONS ({data.certifications.length})</div>
                <button onClick={()=>setData({...data,certifications:[...data.certifications,{id:Date.now().toString(),name:'New Cert',icon:'🏆',category:'Security',image:''}]})} style={{padding:'7px 16px',border:'1px solid #0a1e38',background:'transparent',color:'#0066ff',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',cursor:'pointer'}}>+ ADD CERT</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                {data.certifications.map((cert,i)=>(
                  <div key={cert.id} style={card}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'#0066ff'}}>CERT {i+1}</span>
                      <button onClick={()=>setData({...data,certifications:data.certifications.filter((_,idx)=>idx!==i)})} style={{background:'none',border:'none',color:'#ff3355',cursor:'pointer',fontSize:'.7rem'}}>✕</button>
                    </div>
                    <ImageUpload label="Badge Image" size="small" value={cert.image||''} onChange={url=>{const c=[...data.certifications];c[i]={...c[i],image:url};setData({...data,certifications:c})}}/>
                    <label style={lbl}>Icon (emoji)</label>
                    <input style={inp} value={cert.icon} onChange={e=>{const c=[...data.certifications];c[i]={...c[i],icon:e.target.value};setData({...data,certifications:c})}}/>
                    <label style={lbl}>Name</label>
                    <input style={inp} value={cert.name} onChange={e=>{const c=[...data.certifications];c[i]={...c[i],name:e.target.value};setData({...data,certifications:c})}}/>
                    <label style={lbl}>Category</label>
                    <input style={inp} value={cert.category} onChange={e=>{const c=[...data.certifications];c[i]={...c[i],category:e.target.value};setData({...data,certifications:c})}}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
