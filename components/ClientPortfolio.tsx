'use client'

import { useEffect, useRef, useState } from 'react'

type PortfolioData = {
  hero: {
    name: string
    title: string
    tagline: string
    bio: string
    location: string
    email: string
    phone: string
    linkedin: string
    github: string
    resumeUrl: string
  }
  skills: Array<{
    id: string
    icon: string
    title: string
    description: string
    technologies: string[]
  }>
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    period: string
    description: string
    achievements: string[]
  }>
  certifications: Array<{
    id: string
    name: string
    icon: string
    category: string
  }>
}

export default function ClientPortfolio({ data }: { data: PortfolioData }) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCertFilter, setActiveCertFilter] = useState('All')
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
      if (cursorRingRef.current) {
        setTimeout(() => {
          if (cursorRingRef.current) {
            cursorRingRef.current.style.left = e.clientX + 'px'
            cursorRingRef.current.style.top = e.clientY + 'px'
          }
        }, 80)
      }
    }

    const addHover = () => cursorRingRef.current?.classList.add('hovered')
    const removeHover = () => cursorRingRef.current?.classList.remove('hovered')

    document.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    const lines = [
      '> Initializing secure connection...',
      '> Loading portfolio data...',
      '> Authentication: VERIFIED',
      '> Welcome to Ahamed Bazil\'s domain.',
    ]
    lines.forEach((line, i) => {
      setTimeout(() => setTerminalLines(prev => [...prev, line]), i * 600)
    })

    const handleScroll = () => {
      const sections = ['home', 'skills', 'experience', 'certifications', 'contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousemove', move)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const certCategories = ['All', ...Array.from(new Set(data.certifications.map(c => c.category)))]
  const filteredCerts = activeCertFilter === 'All'
    ? data.certifications
    : data.certifications.filter(c => c.category === activeCertFilter)

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'EXP' },
    { id: 'certifications', label: 'CERTS' },
    { id: 'contact', label: 'CONTACT' },
  ]

  if (!mounted) return null

  return (
    <>
      {!isMobile && (
        <>
          <div ref={cursorRef} className="cursor" />
          <div ref={cursorRingRef} className="cursor-ring" />
        </>
      )}

      <div className="scanline" />

      {/* NAV */}
      <nav className="pf-nav">
        <div className="pf-logo" onClick={() => scrollTo('home')}>
          <div className="pf-logo-box">AB</div>
          <div>
            <div className="pf-logo-name">Ahamed Bazil</div>
            <div className="pf-logo-sub">CYBERSECURITY</div>
          </div>
        </div>

        <div className="pf-nav-desktop">
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={'pf-nav-btn' + (activeSection === item.id ? ' pf-nav-active' : '')}>
              {item.label}
            </button>
          ))}
          <a href="/admin" className="pf-admin-link">ADMIN</a>
        </div>

        <button className="pf-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={'pf-ham-line' + (menuOpen ? ' ham1-open' : '')} />
          <span className={'pf-ham-line' + (menuOpen ? ' ham2-open' : '')} />
          <span className={'pf-ham-line' + (menuOpen ? ' ham3-open' : '')} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="pf-mobile-menu">
          {navItems.map((item, idx) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={'pf-mob-item' + (activeSection === item.id ? ' pf-mob-active' : '')}>
              <span className="pf-mob-num">0{idx+1}.</span>
              {item.label}
            </button>
          ))}
          <a href="/admin" className="pf-mob-admin">⚙ ADMIN PANEL</a>
        </div>
      )}

      {/* HERO */}
      <section id="home" className="grid-bg pf-hero">
        <div className="pf-hero-deco1" />
        <div className="pf-hero-deco2" />

        <div className="pf-terminal" style={{ opacity: mounted ? 1 : 0 }}>
          <div className="pf-term-header">
            <div className="pf-dot pf-dot-r" /><div className="pf-dot pf-dot-o" /><div className="pf-dot pf-dot-g" />
            <span className="pf-term-title">bash — terminal</span>
          </div>
          <div className="pf-term-body">
            {terminalLines.map((line, i) => (
              <div key={i} className={'pf-term-line' + (line.startsWith('> Auth') ? ' pf-term-ok' : line.startsWith('> Welcome') ? ' pf-term-info' : '')}>{line}</div>
            ))}
            {terminalLines.length < 4 && <span className="pf-term-cur">█</span>}
          </div>
        </div>

        <div className="pf-hero-inner">
          <div className="pf-hero-status">
            <div className="pf-status-dot" />
            <span className="pf-status-text">AVAILABLE FOR OPPORTUNITIES</span>
          </div>
          <div className="pf-hero-tag">{`{ ${data.hero.title.toUpperCase()} }`}</div>
          <h1 className="glitch pf-hero-name" data-text={data.hero.name}>{data.hero.name}</h1>
          <div className="pf-hero-tagline">
            {data.hero.tagline.split('•').map((item, i, arr) => (
              <span key={i} className="pf-tg-group">
                <span className="pf-tg-item">{item.trim()}</span>
                {i < arr.length - 1 && <span className="pf-tg-sep">—</span>}
              </span>
            ))}
          </div>
          <p className="pf-hero-bio">{data.hero.bio}</p>
          <div className="pf-hero-stats">
            {[{ num: '3+', label: 'Years Experience' },{ num: '11', label: 'Certifications' },{ num: '6', label: 'Core Domains' }].map(s => (
              <div key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="pf-stat-label">{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div className="pf-hero-ctas">
            <button className="mag-btn" onClick={() => scrollTo('contact')}><span>Get In Touch</span><span>→</span></button>
            <button className="pf-btn-sec" onClick={() => scrollTo('skills')}>View Skills</button>
          </div>
        </div>

        <div className="pf-scroll-ind">
          <div className="pf-scroll-line" />
          <span className="pf-scroll-txt">SCROLL</span>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="pf-section">
        <div className="pf-container">
          <div className="pf-sec-hdr">
            <span className="pf-sec-label">02 / EXPERTISE</span>
            <div className="pf-sec-title-row">
              <h2 className="pf-sec-title">Core Skills</h2>
              <div className="pf-sec-line" />
            </div>
          </div>
          <div className="pf-skills-grid">
            {data.skills.map((skill, i) => (
              <div key={skill.id}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className={'pf-skill-card' + (hoveredSkill === skill.id ? ' pf-skill-hov' : '')}>
                <div className="pf-skill-num">{String(i+1).padStart(2,'0')}</div>
                {hoveredSkill === skill.id && <div className="pf-skill-accent" />}
                <div className="pf-skill-icon">{skill.icon}</div>
                <h3 className="pf-skill-title">{skill.title}</h3>
                <p className="pf-skill-desc">{skill.description}</p>
                <div className="pf-tech-tags">
                  {skill.technologies.map(t => <span key={t} className="pf-tech-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="pf-section pf-sec-dark">
        <div className="pf-container">
          <div className="pf-sec-hdr">
            <span className="pf-sec-label">03 / CAREER</span>
            <div className="pf-sec-title-row">
              <h2 className="pf-sec-title">Experience</h2>
              <div className="pf-sec-line" />
            </div>
          </div>
          {data.experience.map(exp => (
            <div key={exp.id} className="pf-exp-card">
              <div className="pf-exp-left">
                <div className="pf-exp-badge">CURRENT</div>
                <div className="pf-exp-co">{exp.company}</div>
                <div className="pf-exp-loc">{exp.location}</div>
                <div className="pf-exp-per">{exp.period}</div>
                <div className="pf-exp-role-box">
                  <div className="pf-exp-role-lbl">ROLE</div>
                  <div className="pf-exp-role-val">{exp.title}</div>
                </div>
              </div>
              <div className="pf-exp-right">
                <p className="pf-exp-desc">{exp.description}</p>
                <div className="pf-exp-ach-lbl">KEY ACHIEVEMENTS</div>
                {exp.achievements.map((a, i) => (
                  <div key={i} className="pf-exp-ach">
                    <span className="pf-exp-ach-n">{String(i+1).padStart(2,'0')}.</span>
                    <span className="pf-exp-ach-t">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications" className="pf-section">
        <div className="pf-container">
          <div className="pf-sec-hdr">
            <span className="pf-sec-label">04 / CREDENTIALS</span>
            <div className="pf-sec-title-row">
              <h2 className="pf-sec-title">Certifications</h2>
              <div className="pf-sec-line" />
            </div>
          </div>
          <div className="pf-cert-filters">
            {certCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCertFilter(cat)}
                className={'pf-filt-btn' + (activeCertFilter === cat ? ' pf-filt-active' : '')}>
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="pf-certs-grid">
            {filteredCerts.map(cert => (
              <div key={cert.id} className="pf-cert-card">
                <span className="pf-cert-icon">{cert.icon}</span>
                <div>
                  <div className="pf-cert-name">{cert.name}</div>
                  <span className="pf-cert-cat">{cert.category.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="pf-section pf-sec-dark pf-contact">
        <div className="pf-contact-wm">CONTACT</div>
        <div className="pf-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="pf-sec-hdr">
            <span className="pf-sec-label">05 / REACH OUT</span>
            <h2 className="pf-sec-title" style={{ marginTop: 12 }}>Let&apos;s Connect</h2>
          </div>
          <div className="pf-contact-grid">
            <div>
              <p className="pf-contact-p">Open to cybersecurity consulting, team leadership roles, and challenging infrastructure projects. Based in Bahrain, available globally.</p>
              <div className="pf-contact-rows">
                {[
                  { label: 'EMAIL', value: data.hero.email, href: `mailto:${data.hero.email}` },
                  { label: 'PHONE', value: data.hero.phone, href: `tel:${data.hero.phone}` },
                  { label: 'LOCATION', value: data.hero.location, href: '#' },
                  { label: 'LINKEDIN', value: 'ahamed-bazil-mn', href: data.hero.linkedin },
                ].map(item => (
                  <div key={item.label} className="pf-contact-row">
                    <div className="pf-contact-lbl">{item.label}</div>
                    <div className="pf-contact-div" />
                    <a href={item.href} className="pf-contact-val">{item.value}</a>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm email={data.hero.email} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pf-footer">
        <div className="pf-footer-copy">© {new Date().getFullYear()} Ahamed Bazil. All rights reserved.</div>
        <div className="pf-footer-domain">ahamedbazil.com</div>
      </footer>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;}

        /* NAV */
        .pf-nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:0 40px;background:rgba(2,4,8,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(13,32,53,0.8);display:flex;align-items:center;justify-content:space-between;height:64px;}
        .pf-logo{display:flex;align-items:center;gap:12px;cursor:pointer;flex-shrink:0;}
        .pf-logo-box{width:32px;height:32px;border:1px solid rgba(0,255,136,0.4);display:flex;align-items:center;justify-content:center;font-size:0.65rem;color:#00ff88;font-family:'IBM Plex Mono',monospace;font-weight:700;}
        .pf-logo-name{color:#c8dce8;font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;line-height:1.1;white-space:nowrap;}
        .pf-logo-sub{color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.55rem;letter-spacing:0.15em;}
        .pf-nav-desktop{display:flex;gap:28px;align-items:center;}
        .pf-nav-btn{background:none;border:none;color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.65rem;letter-spacing:0.2em;cursor:pointer;transition:color 0.2s;padding:4px 0;border-bottom:1px solid transparent;white-space:nowrap;}
        .pf-nav-active{color:#00ff88;border-bottom-color:#00ff88;}
        .pf-admin-link{padding:7px 14px;border:1px solid rgba(13,32,53,0.8);color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.6rem;letter-spacing:0.15em;text-decoration:none;transition:all 0.2s;white-space:nowrap;}
        .pf-admin-link:hover{border-color:rgba(0,255,136,0.3);color:#00ff88;}

        /* HAMBURGER */
        .pf-hamburger{display:none;background:none;border:none;cursor:pointer;padding:8px;flex-direction:column;gap:5px;align-items:flex-end;}
        .pf-ham-line{display:block;height:1.5px;background:#c8dce8;transition:all 0.3s;transform-origin:center;}
        .pf-ham-line:nth-child(1){width:22px;}
        .pf-ham-line:nth-child(2){width:16px;}
        .pf-ham-line:nth-child(3){width:22px;}
        .ham1-open{transform:translateY(6.5px) rotate(45deg);width:22px!important;}
        .ham2-open{opacity:0;}
        .ham3-open{transform:translateY(-6.5px) rotate(-45deg);width:22px!important;}

        /* MOBILE MENU */
        .pf-mobile-menu{position:fixed;top:64px;left:0;right:0;bottom:0;z-index:999;background:rgba(2,4,8,0.97);backdrop-filter:blur(24px);display:flex;flex-direction:column;padding:40px 28px;gap:0;animation:pfFadeDown 0.25s ease;overflow-y:auto;}
        @keyframes pfFadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
        .pf-mob-item{background:none;border:none;border-bottom:1px solid #0d2035;color:#5a7a8a;text-align:left;padding:18px 0;font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:16px;transition:color 0.2s;}
        .pf-mob-item:hover,.pf-mob-active{color:#00ff88;}
        .pf-mob-num{font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#00ff88;letter-spacing:0.1em;}
        .pf-mob-admin{margin-top:24px;padding:14px;border:1px solid #163250;color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.75rem;letter-spacing:0.15em;text-decoration:none;text-align:center;transition:all 0.2s;}

        /* HERO */
        .pf-hero{min-height:100vh;padding-top:64px;display:flex;align-items:center;position:relative;overflow:hidden;}
        .pf-hero-deco1{position:absolute;top:15%;right:5%;width:40vw;height:60vh;border:1px solid rgba(0,255,136,0.04);pointer-events:none;}
        .pf-hero-deco2{position:absolute;top:20%;right:8%;width:35vw;height:55vh;border:1px solid rgba(0,255,136,0.03);pointer-events:none;}
        .pf-terminal{position:absolute;top:100px;right:40px;width:320px;background:rgba(6,13,20,0.95);border:1px solid #0d2035;font-family:'IBM Plex Mono',monospace;font-size:0.72rem;overflow:hidden;transition:opacity 1s ease 0.5s;}
        .pf-term-header{background:#060d14;padding:8px 12px;border-bottom:1px solid #0d2035;display:flex;gap:6px;align-items:center;}
        .pf-dot{width:8px;height:8px;border-radius:50%;}
        .pf-dot-r{background:#ff3355;}.pf-dot-o{background:#ff7a00;}.pf-dot-g{background:#00ff88;}
        .pf-term-title{margin-left:8px;color:#5a7a8a;font-size:0.6rem;}
        .pf-term-body{padding:16px 16px 20px;}
        .pf-term-line{color:#c8dce8;margin-bottom:6px;animation:pfFadeIn 0.3s ease;}
        .pf-term-ok{color:#00ff88;}.pf-term-info{color:#00aaff;}
        .pf-term-cur{color:#00ff88;animation:pfBlink 1s infinite;}
        .pf-hero-inner{max-width:1200px;margin:0 auto;padding:60px 40px;width:100%;}
        .pf-hero-status{margin-bottom:32px;display:flex;align-items:center;gap:12px;}
        .pf-status-dot{width:8px;height:8px;border-radius:50%;background:#00ff88;box-shadow:0 0 12px #00ff88;animation:pfPulse 2s infinite;}
        .pf-status-text{font-family:'IBM Plex Mono',monospace;font-size:0.7rem;color:#00ff88;letter-spacing:0.15em;}
        .pf-hero-tag{font-family:'IBM Plex Mono',monospace;font-size:0.7rem;color:#5a7a8a;letter-spacing:0.2em;margin-bottom:16px;}
        .pf-hero-name{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2.8rem,9vw,8rem);line-height:0.9;color:#c8dce8;margin-bottom:24px;letter-spacing:-0.02em;}
        .pf-hero-tagline{display:flex;align-items:center;gap:12px;margin-bottom:32px;flex-wrap:wrap;}
        .pf-tg-group{display:flex;align-items:center;gap:12px;}
        .pf-tg-item{color:#c8dce8;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:300;}
        .pf-tg-sep{color:#00ff88;opacity:0.4;}
        .pf-hero-bio{max-width:560px;color:#5a7a8a;font-size:1rem;line-height:1.8;margin-bottom:48px;border-left:2px solid rgba(0,255,136,0.2);padding-left:20px;}
        .pf-hero-stats{display:flex;gap:40px;margin-bottom:48px;flex-wrap:wrap;}
        .pf-stat-label{color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;margin-top:4px;}
        .pf-hero-ctas{display:flex;gap:16px;flex-wrap:wrap;}
        .pf-btn-sec{padding:14px 32px;background:transparent;border:1px solid #163250;color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;}
        .pf-btn-sec:hover{border-color:rgba(0,255,136,0.3);color:#c8dce8;}
        .pf-scroll-ind{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;}
        .pf-scroll-line{width:1px;height:60px;background:linear-gradient(to bottom,rgba(0,255,136,0.4),transparent);animation:pfPulse 2s infinite;}
        .pf-scroll-txt{font-family:'IBM Plex Mono',monospace;font-size:0.6rem;color:#5a7a8a;letter-spacing:0.2em;}

        /* SECTIONS */
        .pf-section{padding:120px 0;}
        .pf-sec-dark{background:#060d14;}
        .pf-container{max-width:1200px;margin:0 auto;padding:0 40px;}
        .pf-sec-hdr{margin-bottom:64px;}
        .pf-sec-label{font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#5a7a8a;letter-spacing:0.2em;}
        .pf-sec-title-row{display:flex;align-items:center;gap:24px;margin-top:12px;}
        .pf-sec-title{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2rem,5vw,3.5rem);color:#c8dce8;line-height:1;}
        .pf-sec-line{flex:1;height:1px;background:linear-gradient(to right,rgba(0,255,136,0.3),transparent);}

        /* SKILLS */
        .pf-skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2px;}
        .pf-skill-card{padding:32px 28px;background:#060d14;border:1px solid #0d2035;cursor:default;transition:all 0.3s;position:relative;overflow:hidden;}
        .pf-skill-hov{background:rgba(0,255,136,0.03);border-color:rgba(0,255,136,0.2);}
        .pf-skill-num{position:absolute;top:20px;right:20px;font-family:'IBM Plex Mono',monospace;font-size:0.6rem;color:#163250;letter-spacing:0.1em;}
        .pf-skill-accent{position:absolute;left:0;top:0;bottom:0;width:2px;background:#00ff88;}
        .pf-skill-icon{font-size:2rem;margin-bottom:16px;}
        .pf-skill-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;color:#c8dce8;margin-bottom:12px;}
        .pf-skill-desc{color:#5a7a8a;font-size:0.875rem;line-height:1.7;margin-bottom:20px;}
        .pf-tech-tags{display:flex;flex-wrap:wrap;gap:6px;}
        .pf-tech-tag{padding:3px 10px;background:rgba(0,255,136,0.04);border:1px solid rgba(0,255,136,0.12);color:#00cc6a;font-family:'IBM Plex Mono',monospace;font-size:0.65rem;letter-spacing:0.05em;}

        /* EXPERIENCE */
        .pf-exp-card{display:grid;grid-template-columns:260px 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid #0d2035;margin-bottom:60px;}
        .pf-exp-badge{font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#00ff88;letter-spacing:0.15em;margin-bottom:8px;}
        .pf-exp-co{font-family:'Syne',sans-serif;font-weight:700;font-size:1.4rem;color:#c8dce8;margin-bottom:8px;line-height:1.2;}
        .pf-exp-loc,.pf-exp-per{color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.72rem;margin-bottom:4px;}
        .pf-exp-role-box{margin-top:24px;padding:16px;border:1px solid #0d2035;background:rgba(0,255,136,0.02);}
        .pf-exp-role-lbl{color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.6rem;letter-spacing:0.15em;margin-bottom:6px;}
        .pf-exp-role-val{color:#c8dce8;font-size:0.85rem;font-weight:600;}
        .pf-exp-desc{color:#5a7a8a;font-size:0.95rem;line-height:1.8;margin-bottom:32px;border-left:2px solid #163250;padding-left:20px;}
        .pf-exp-ach-lbl{color:#00ff88;font-family:'IBM Plex Mono',monospace;font-size:0.65rem;letter-spacing:0.2em;margin-bottom:20px;}
        .pf-exp-ach{display:flex;gap:16px;align-items:flex-start;margin-bottom:12px;}
        .pf-exp-ach-n{color:#00ff88;font-family:'IBM Plex Mono',monospace;font-size:0.7rem;flex-shrink:0;margin-top:2px;}
        .pf-exp-ach-t{color:#c8dce8;font-size:0.9rem;line-height:1.6;}

        /* CERTIFICATIONS */
        .pf-cert-filters{display:flex;gap:8px;margin-bottom:48px;flex-wrap:wrap;}
        .pf-filt-btn{padding:8px 18px;background:transparent;border:1px solid #163250;color:#5a7a8a;font-family:'IBM Plex Mono',monospace;font-size:0.65rem;letter-spacing:0.12em;cursor:pointer;transition:all 0.2s;}
        .pf-filt-active{background:rgba(0,255,136,0.1);border-color:rgba(0,255,136,0.4);color:#00ff88;}
        .pf-certs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;}
        .pf-cert-card{padding:24px 20px;background:#060d14;border:1px solid #0d2035;display:flex;gap:16px;align-items:flex-start;transition:all 0.2s;cursor:default;}
        .pf-cert-card:hover{border-color:rgba(0,255,136,0.2);background:rgba(0,255,136,0.02);}
        .pf-cert-icon{font-size:1.4rem;flex-shrink:0;}
        .pf-cert-name{color:#c8dce8;font-size:0.85rem;font-weight:500;line-height:1.4;margin-bottom:6px;}
        .pf-cert-cat{font-family:'IBM Plex Mono',monospace;font-size:0.6rem;color:#00cc6a;letter-spacing:0.1em;padding:2px 8px;border:1px solid rgba(0,255,136,0.15);background:rgba(0,255,136,0.04);}

        /* CONTACT */
        .pf-contact{position:relative;overflow:hidden;}
        .pf-contact-wm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(4rem,18vw,16rem);color:rgba(0,255,136,0.02);white-space:nowrap;pointer-events:none;user-select:none;letter-spacing:-0.05em;}
        .pf-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;}
        .pf-contact-p{color:#5a7a8a;font-size:1rem;line-height:1.8;margin-bottom:48px;}
        .pf-contact-rows{display:flex;flex-direction:column;gap:24px;}
        .pf-contact-row{display:flex;gap:24px;align-items:center;}
        .pf-contact-lbl{width:80px;font-family:'IBM Plex Mono',monospace;font-size:0.6rem;color:#5a7a8a;letter-spacing:0.15em;flex-shrink:0;}
        .pf-contact-div{width:1px;height:20px;background:#163250;}
        .pf-contact-val{color:#c8dce8;text-decoration:none;font-size:0.95rem;transition:color 0.2s;}
        .pf-contact-val:hover{color:#00ff88;}

        /* FOOTER */
        .pf-footer{padding:32px 40px;border-top:1px solid #0d2035;display:flex;justify-content:space-between;align-items:center;background:#020408;flex-wrap:wrap;gap:12px;}
        .pf-footer-copy,.pf-footer-domain{font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#5a7a8a;}

        /* ANIMATIONS */
        @keyframes pfFadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @keyframes pfBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pfPulse{0%,100%{opacity:1}50%{opacity:0.5}}

        /* ── MOBILE ── */
        @media(max-width:768px){
          .pf-nav{padding:0 20px;}
          .pf-nav-desktop{display:none;}
          .pf-hamburger{display:flex;}

          .pf-hero-inner{padding:40px 20px;}
          .pf-terminal{display:none;}
          .pf-hero-deco1,.pf-hero-deco2{display:none;}
          .pf-hero-name{font-size:clamp(2rem,11vw,3.5rem)!important;line-height:1!important;}
          .pf-hero-bio{font-size:0.9rem;margin-bottom:32px;}
          .pf-hero-stats{gap:24px;margin-bottom:36px;}
          .pf-hero-ctas{flex-direction:column;}
          .pf-hero-ctas .mag-btn,.pf-hero-ctas .pf-btn-sec{width:100%;justify-content:center;}
          .pf-scroll-ind{display:none;}
          .pf-hero-tagline{flex-wrap:wrap;gap:8px;}

          .pf-section{padding:72px 0;}
          .pf-container{padding:0 20px;}
          .pf-sec-hdr{margin-bottom:36px;}
          .pf-sec-title{font-size:1.8rem;}
          .pf-sec-title-row{gap:16px;}

          .pf-skills-grid{grid-template-columns:1fr;}

          .pf-exp-card{grid-template-columns:1fr;gap:24px;}
          .pf-exp-role-box{margin-top:16px;}
          .pf-exp-co{font-size:1.1rem;}

          .pf-certs-grid{grid-template-columns:1fr;}
          .pf-filt-btn{padding:6px 12px;font-size:0.58rem;}

          .pf-contact-grid{grid-template-columns:1fr;gap:48px;}
          .pf-contact-p{font-size:0.9rem;}

          .pf-footer{padding:24px 20px;flex-direction:column;align-items:flex-start;}
        }

        @media(max-width:480px){
          .pf-hero-name{font-size:2rem!important;}
          .pf-hero-stats{gap:16px;}
          .stat-num{font-size:2rem!important;}
          .pf-tg-sep{display:none;}
          .pf-tg-group{display:block;}
        }
      `}</style>
    </>
  )
}

function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()

      if (res.ok && json.success) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(json.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    background: '#020408', border: '1px solid #163250',
    color: '#c8dce8', fontFamily: 'Outfit, sans-serif',
    fontSize: '0.9rem', outline: 'none', marginBottom: 16,
    transition: 'border-color 0.2s', borderRadius: 0,
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: '40px 32px',
        border: '1px solid rgba(0,255,136,0.2)',
        background: 'rgba(0,255,136,0.03)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 16, textAlign: 'center',
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid #00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>✓</div>
        <div style={{ color: '#00ff88', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.2em' }}>MESSAGE SENT</div>
        <div style={{ color: '#5a7a8a', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Thanks for reaching out! I'll get back to you within 24–48 hours.<br/>
          Check your inbox for a confirmation email.
        </div>
        <button onClick={() => setStatus('idle')} style={{ marginTop: 8, padding: '10px 24px', background: 'transparent', border: '1px solid #163250', color: '#5a7a8a', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', cursor: 'pointer' }}>
          SEND ANOTHER
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#5a7a8a', letterSpacing: '0.15em', marginBottom: 6 }}>NAME</div>
      <input style={inputStyle} placeholder="Your name" value={form.name} required
        onChange={e => setForm({ ...form, name: e.target.value })}
        onFocus={e => (e.target.style.borderColor = 'rgba(0,255,136,0.3)')}
        onBlur={e => (e.target.style.borderColor = '#163250')} />

      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#5a7a8a', letterSpacing: '0.15em', marginBottom: 6 }}>EMAIL</div>
      <input type="email" style={inputStyle} placeholder="your@email.com" value={form.email} required
        onChange={e => setForm({ ...form, email: e.target.value })}
        onFocus={e => (e.target.style.borderColor = 'rgba(0,255,136,0.3)')}
        onBlur={e => (e.target.style.borderColor = '#163250')} />

      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#5a7a8a', letterSpacing: '0.15em', marginBottom: 6 }}>MESSAGE</div>
      <textarea style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }} placeholder="Your message..." value={form.message} required
        onChange={e => setForm({ ...form, message: e.target.value })}
        onFocus={e => (e.target.style.borderColor = 'rgba(0,255,136,0.3)')}
        onBlur={e => (e.target.style.borderColor = '#163250')} />

      {status === 'error' && (
        <div style={{ color: '#ff3355', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>✕</span> {errorMsg}
        </div>
      )}

      <button type="submit" className="mag-btn" disabled={status === 'sending'}
        style={{ width: '100%', justifyContent: 'center', cursor: status === 'sending' ? 'not-allowed' : 'pointer', opacity: status === 'sending' ? 0.7 : 1 }}>
        <span>{status === 'sending' ? 'SENDING...' : 'Send Message'}</span>
        <span>{status === 'sending' ? '⟳' : '→'}</span>
      </button>
    </form>
  )
}
