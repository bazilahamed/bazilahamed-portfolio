import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ahamed Bazil — Cybersecurity Team Leader',
  description: 'Senior Cybersecurity & Networking Professional based in Bahrain. Cloud Security, Network Defense, Infrastructure Protection.',
  keywords: ['cybersecurity','network security','cloud security','Bahrain','Azure','AWS','FortiGate','CISSP','CCNP'],
  openGraph: {
    title: 'Ahamed Bazil — Cybersecurity Team Leader',
    description: 'Senior Cybersecurity Professional | Bahrain',
    url: 'https://ahamedbazil.com',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
