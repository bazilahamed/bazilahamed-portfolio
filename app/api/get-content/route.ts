import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'data.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Could not load content' }, { status: 500 })
  }
}
