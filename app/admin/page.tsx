export default function AdminDecoy() {
  return (
    <div style={{ minHeight:'100vh', background:'#020b18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:'6rem', color:'rgba(255,255,255,.05)', fontWeight:900 }}>404</div>
      <div style={{ color:'rgba(255,255,255,.2)', fontSize:'1rem' }}>Page not found</div>
      <a href="/" style={{ color:'rgba(0,102,255,.5)', fontSize:'.85rem', textDecoration:'none', marginTop:8 }}>← Go home</a>
    </div>
  )
}
