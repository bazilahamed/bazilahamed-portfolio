import fs from 'fs'
import path from 'path'
import Portfolio from '@/components/Portfolio'

export const dynamic = 'force-static'
export const revalidate = 0

export default function Home() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'data.json'), 'utf-8')
  return <Portfolio data={JSON.parse(raw)} />
}
