import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found',
  robots: 'noindex, nofollow, noarchive, nosnippet, noodp',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
