import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Cédrai — Portfolio',
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
      <body className={jetbrains.variable}>{children}</body>
    </html>
  )
}
