import { NextRequest, NextResponse } from 'next/server'
const attempts: Record<string,{count:number;lockedUntil:number;lastAttempt:number}> = {}
const MAX=3,LOCK=15*60*1000,WIN=60*1000
function getIP(req:NextRequest){return req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'}
export async function POST(req:NextRequest){
  try{
    const id=getIP(req),now=Date.now()
    if(!attempts[id]) attempts[id]={count:0,lockedUntil:0,lastAttempt:0}
    const r=attempts[id]
    if(r.lockedUntil>now){const m=Math.ceil((r.lockedUntil-now)/60000);return NextResponse.json({error:`LOCKED — Try again in ${m} min(s).`},{status:429})}
    if(now-r.lastAttempt>WIN) r.count=0
    const {password}=await req.json()
    if(!process.env.ADMIN_PASSWORD) return NextResponse.json({error:'Not configured'},{status:500})
    if(password===process.env.ADMIN_PASSWORD){attempts[id]={count:0,lockedUntil:0,lastAttempt:0};return NextResponse.json({success:true})}
    r.count++;r.lastAttempt=now
    if(r.count>=MAX){r.lockedUntil=now+LOCK;r.count=0;return NextResponse.json({error:`ACCESS DENIED — Locked for 15 mins.`},{status:429})}
    return NextResponse.json({error:`ACCESS DENIED — ${MAX-r.count} attempt(s) remaining.`},{status:401})
  }catch{return NextResponse.json({error:'Server error'},{status:500})}
}
