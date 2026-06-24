'use client'
import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

function getResponse(q: string): string {
  const t = q.toLowerCase()

  // Greetings
  if (/^(hi|hello|hey|howdy|sup|what'?s up|good\s*(morning|evening|afternoon))/.test(t))
    return "Hi there! 👋 I'm Ahamed Bazil's AI assistant. I can tell you about his **cybersecurity skills**, **work experience**, **certifications**, **projects**, or how to **contact/hire him**. What would you like to know?"

  // Who are you / about
  if (/who (are|is) (you|ahamed|he|this)|about (you|ahamed|him)|tell me about/.test(t))
    return "I'm the AI assistant for **Ahamed Bazil MN** — an IT Operations & Cybersecurity Team Leader based in **Bahrain** 🇧🇭. He has **3+ years** of experience defending enterprise infrastructure across cloud, network, and endpoint security. He currently leads cybersecurity at **FIT Solutions / Veuz Concepts**, managing platforms across the GCC and Africa."

  // Skills
  if (/skill|expert|good at|speciali|proficien|know|tech|stack/.test(t))
    return "Ahamed's core expertise spans:\n\n🛡️ **Security**: SIEM (Microsoft Sentinel), EDR/XDR (Sophos, Kaspersky, Symantec), DLP, Vulnerability Assessment\n\n☁️ **Cloud**: Microsoft Azure, AWS, Oracle Cloud, Azure AD/Entra ID, Microsoft Intune\n\n🔥 **Firewalls**: FortiGate NGFW, Sophos XGS, Zscaler, IPSec VPN, SD-WAN\n\n🌐 **Network**: CCNP-level routing & switching, VLANs, load balancers\n\n💻 **DevOps**: Django/Python, GitHub Actions, Docker, AWS EC2, Nginx"

  // Certifications
  if (/cert|qualif|credential|aws|ccnp|cissp|ibm|redhat|red hat|ethical hack/.test(t))
    return "Ahamed holds **11 professional certifications** 🏆:\n\n• **AWS** Certified Solutions Architect\n• **IBM** Cybersecurity Analyst Professional\n• **CCNP SCOR** (Security Core)\n• **CISSP**: Security & Risk Management\n• **CISSP**: Network Security\n• **CISSP**: Security Architecture & Engineering\n• **Red Hat** Enterprise Linux\n• Introduction to **Ethical Hacking**\n• AWS Cloud 101\n• Cybersecurity Tools & Attacks\n• Online Technology in Cyber Security"

  // Experience / work
  if (/experience|work|job|career|employ|role|position|company|veuz|fit solution/.test(t))
    return "Ahamed is currently the **Team Leader — IT Operations & Cybersecurity** at FIT Solutions Co. W.L.L / Veuz Concepts (Dec 2022 – Present) in Bahrain.\n\nKey responsibilities:\n• Leading cloud security across Azure & AWS environments\n• Managing FortiGate & Sophos NGFWs with IPSec VPN\n• Deploying SIEM, NDR, EDR/XDR solutions\n• Administering Azure AD, Intune & Microsoft 365\n• Performing Vulnerability Assessment & risk mitigation\n• Managing event platforms across GCC & Africa"

  // Projects
  if (/project|eventxpro|probesec|matchpro|gitex|portfolio|platform|saas|build|develop/.test(t))
    return "Ahamed's key projects include:\n\n🎯 **EventXPro** — Event management SaaS deployed for GITEX Nigeria, GITEX Africa, Gulfood & Aramco across GCC & Africa\n\n🔐 **ProbeSec** — Cybersecurity SaaS (in development) targeting GCC enterprises with penetration testing as the core service\n\n🤝 **MatchPro** — AI-powered event matchmaking app with 105K+ attendee profiles & 5.4M+ match records\n\n🌐 **ahamedbazil.com** — This portfolio! Built with Next.js, featuring a cyberpunk theme and admin CMS"

  // Location
  if (/where|location|based|bahrain|india|kerala|country|live|from/.test(t))
    return "Ahamed is based in **Bahrain** 🇧🇭 with ties to **Kerala, India**. He is actively exploring opportunities in the **UAE**, **Saudi Arabia**, and international markets including Australia (registered for Work & Holiday Visa Subclass 462)."

  // Contact
  if (/contact|email|phone|reach|call|message|get in touch|connect/.test(t))
    return "You can reach Ahamed through:\n\n📧 **Email**: ahamedbazil70@gmail.com\n📞 **Phone**: +973 3451 0369\n💼 **LinkedIn**: linkedin.com/in/ahamed-bazil-mn\n🌐 **Website**: ahamedbazil.com\n\nHe typically responds within **24-48 hours**."

  // Hire / available
  if (/hire|availab|opportun|freelan|consult|work with|recruit|salary|open to/.test(t))
    return "Yes, Ahamed is **open to new opportunities**! 🎯\n\nHe's actively looking for:\n• Cybersecurity roles in **UAE government & enterprise**\n• GCC-based security leadership positions\n• International cybersecurity opportunities\n• Freelance: Microsoft 365 admin, cybersecurity audits, cloud consulting\n\nBest way to reach him: **ahamedbazil70@gmail.com** or LinkedIn: **linkedin.com/in/ahamed-bazil-mn**"

  // Azure / Microsoft
  if (/azure|microsoft|intune|entra|365|conditional access|m365/.test(t))
    return "Ahamed has deep expertise in the **Microsoft ecosystem**:\n\n• **Azure Entra ID** (Azure AD) — identity & access management\n• **Microsoft Intune** — device management & MDM\n• **Conditional Access** — zero-trust policy enforcement\n• **Microsoft Sentinel** — cloud-native SIEM\n• **Microsoft 365** — full enterprise administration\n• **Microsoft Defender** — endpoint protection"

  // FortiGate / Firewall
  if (/forti|firewall|sophos|vpn|zscaler|ngfw|sd-wan/.test(t))
    return "Ahamed is an expert in **Next-Gen Firewalls** 🔥:\n\n• **FortiGate NGFW** — policy management, IPSec VPN, SD-WAN\n• **Sophos XGS** — advanced threat protection, web filtering\n• **Zscaler** — cloud-based zero-trust network access\n• **IPSec & SSL VPN** — secure remote access configurations\n• Experience with DMZ architecture & network segmentation"

  // AWS / Cloud
  if (/aws|amazon|cloud|ec2|s3|oracle|oci/.test(t))
    return "Ahamed is an **AWS Certified Solutions Architect** with hands-on cloud experience:\n\n☁️ **AWS**: EC2, S3, RDS, IAM, VPC, GitHub Actions CI/CD, production deployments (af-south-1 for GITEX Nigeria)\n\n☁️ **Azure**: Full Microsoft cloud stack including Azure AD, Intune, Sentinel\n\n☁️ **Oracle Cloud**: OCI Johannesburg for staging environments\n\nHe manages multi-cloud infrastructure for enterprise event platforms serving thousands of users."

  // SIEM / SOC / EDR
  if (/siem|soc|edr|xdr|ndr|kaspersky|symantec|threat|detect|monitor/.test(t))
    return "Ahamed specializes in **threat detection & security operations**:\n\n🔍 **SIEM**: Microsoft Sentinel — log ingestion, KQL queries, alert rules\n🛡️ **EDR/XDR**: Sophos Intercept X, Kaspersky EDR, Symantec\n📡 **NDR**: Network Detection & Response deployment\n🔐 **DLP**: Data Loss Prevention policy management\n⚡ **Incident Response**: Full DRP & BCP planning and execution"

  // Python / Django / DevOps
  if (/python|django|docker|nginx|gunicorn|github|devops|code|program/.test(t))
    return "Beyond security, Ahamed has strong **DevOps & development skills**:\n\n🐍 **Python/Django** — managing 6+ production Django event platforms\n🐳 **Docker** — containerized deployments\n⚙️ **GitHub Actions** — CI/CD pipelines with OIDC authentication\n🖥️ **Nginx/Gunicorn** — web server configuration\n☁️ **AWS EC2** — cloud infrastructure management\n📊 **Odoo ERP** — enterprise resource planning administration"

  // LinkedIn / social
  if (/linkedin|instagram|social|brand|content/.test(t))
    return "Connect with Ahamed on social media:\n\n💼 **LinkedIn**: linkedin.com/in/ahamed-bazil-mn\n📸 **Instagram (Personal Brand)**: @tech.vaultpro\n🏢 **Company**: @fitsolutions.bh\n\nHe posts content on cybersecurity, cloud, EventXPro, and ERP across multiple pillars."

  // Salary / rate
  if (/salary|rate|pay|compensation|cost|charge|fee/.test(t))
    return "For salary or rate inquiries, please reach out directly:\n\n📧 **ahamedbazil70@gmail.com**\n📞 **+973 3451 0369**\n\nAhamed is open to discussing compensation based on the role, responsibilities, and location. He's actively exploring GCC and international opportunities."

  // Thanks
  if (/thank|thanks|great|awesome|perfect|nice|good|helpful|cool/.test(t))
    return "You're welcome! 😊 Feel free to ask anything else about Ahamed — his skills, projects, certifications, or how to get in touch. He's always open to great opportunities!"

  // Default
  return "Great question! Here's a quick overview of what I can tell you about **Ahamed Bazil**:\n\n🛡️ **Skills** — Cloud security, firewalls, SIEM, EDR/XDR\n🏆 **Certifications** — 11 including AWS, CCNP, CISSP, IBM\n💼 **Experience** — Cybersecurity Team Leader at FIT Solutions, Bahrain\n🚀 **Projects** — EventXPro, ProbeSec, MatchPro\n📬 **Contact** — ahamedbazil70@gmail.com\n\nJust ask about any of these topics!"
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse] = useState(true)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [msgs, loading])

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 100); setPulse(false) }
  }, [open])

  const send = (text?: string) => {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')
    const userMsg: Msg = { role: 'user', content: q }
    const newMsgs = [...msgs, userMsg]
    setMsgs(newMsgs)
    setLoading(true)
    setTimeout(() => {
      const reply = getResponse(q)
      setMsgs([...newMsgs, { role: 'assistant', content: reply }])
      setLoading(false)
    }, 600 + Math.random() * 400)
  }

  const formatMsg = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d4ff">$1</strong>')
      .replace(/\n/g, '<br>')

  const QUICK = ['What are your skills?', 'Tell me about projects', 'How can I hire you?', 'What certifications do you have?']

  return (
    <>
      {/* Floating Button */}
      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999 }}>
        {pulse && !open && (
          <div style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: '#00d4ff', animation: 'chatPulse 2s infinite', zIndex: 1 }} />
        )}
        <button onClick={() => setOpen(o => !o)}
          style={{ width: 60, height: 60, borderRadius: '50%', background: open ? '#041020' : 'linear-gradient(135deg,#0066ff,#00d4ff)', border: open ? '2px solid #0066ff' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,102,255,.4)', transition: 'all .3s' }}>
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1" fill="#fff"/><circle cx="12" cy="10" r="1" fill="#fff"/><circle cx="15" cy="10" r="1" fill="#fff"/></svg>
          }
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div style={{ position: 'fixed', bottom: 100, right: 28, width: 360, maxHeight: 520, background: '#041020', border: '1px solid #0a1e38', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,.6)', zIndex: 9998, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'chatSlideUp .25s ease' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #0a1e38', background: 'rgba(2,11,24,.8)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#0066ff,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.8rem', color: '#fff', flexShrink: 0 }}>AB</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>Ahamed's AI</div>
              <div style={{ fontSize: '.65rem', color: '#00d4ff', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Online · Ask me anything
              </div>
            </div>
            {msgs.length > 0 && (
              <button onClick={() => setMsgs([])} style={{ background: 'none', border: 'none', color: '#3a5070', cursor: 'pointer', fontSize: '.65rem', fontFamily: 'monospace' }}>CLEAR</button>
            )}
          </div>

          {/* Messages */}
          <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300 }}>
            {msgs.length === 0 && (
              <div>
                <div style={{ background: 'rgba(0,102,255,.08)', border: '1px solid rgba(0,102,255,.15)', borderRadius: '12px 12px 12px 0', padding: '12px 14px', fontSize: '.82rem', color: '#c8d8f0', lineHeight: 1.6, marginBottom: 12 }}>
                  Hi! I'm Ahamed Bazil's AI assistant. Ask me anything about his skills, experience, certifications, projects, or how to contact him! 👋
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {QUICK.map(q => (
                    <button key={q} onClick={() => send(q)}
                      style={{ background: 'rgba(0,102,255,.06)', border: '1px solid rgba(0,102,255,.2)', borderRadius: 8, padding: '8px 12px', color: '#00d4ff', fontSize: '.72rem', cursor: 'pointer', textAlign: 'left', transition: '.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,102,255,.15)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,102,255,.06)')}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: m.role === 'assistant' ? 'linear-gradient(135deg,#0066ff,#00d4ff)' : 'rgba(0,212,255,.15)', border: m.role === 'user' ? '1px solid rgba(0,212,255,.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', fontWeight: 700, color: m.role === 'assistant' ? '#fff' : '#00d4ff', flexShrink: 0 }}>
                  {m.role === 'assistant' ? 'AB' : 'U'}
                </div>
                <div style={{ maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'assistant' ? '12px 12px 12px 0' : '12px 12px 0 12px', background: m.role === 'assistant' ? 'rgba(4,16,32,.9)' : 'rgba(0,102,255,.15)', border: `1px solid ${m.role === 'assistant' ? '#0a1e38' : 'rgba(0,102,255,.3)'}`, fontSize: '.8rem', color: m.role === 'assistant' ? '#c8d8f0' : '#f0f6ff', lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#0066ff,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', fontWeight: 700, color: '#fff' }}>AB</div>
                <div style={{ padding: '12px 16px', background: 'rgba(4,16,32,.9)', border: '1px solid #0a1e38', borderRadius: '12px 12px 12px 0', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, .2, .4].map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', animation: `chatDot 1.2s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #0a1e38', display: 'flex', gap: 8, alignItems: 'flex-end', background: 'rgba(2,11,24,.6)' }}>
            <textarea ref={inputRef} value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = '36px'; e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px' }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask about skills, projects, contact..."
              style={{ flex: 1, background: 'rgba(4,16,32,.8)', border: '1px solid #0a1e38', borderRadius: 10, padding: '9px 12px', color: '#f0f6ff', fontSize: '.78rem', resize: 'none', height: 36, maxHeight: 90, outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }} />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() && !loading ? 'linear-gradient(135deg,#0066ff,#0052cc)' : 'rgba(0,102,255,.2)', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: '.2s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }
        @keyframes chatSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes chatDot { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
    </>
  )
}
