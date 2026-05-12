import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cédrai_',
  description: 'Computer Engineering · CTF · Forensics · Web Hacking · Security · Python',
  keywords: ['CTF', 'Forensics', 'Security', 'Python', 'Portfolio'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css" />
      </head>
      <body style={{ fontFamily: "'Hack', 'Courier New', monospace" }}>{children}</body>
    </html>
  )
}