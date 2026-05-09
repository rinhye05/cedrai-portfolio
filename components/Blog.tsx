'use client'

import { useEffect, useState } from 'react'

type Post = { cat: string; title: string; date: string; href: string }

const FALLBACK: Post[] = [
  { cat: 'FORENSICS', title: '[DH] study_checker writeup',   date: '2026.05', href: 'https://rinhye05.tistory.com/23' },
  { cat: 'FORENSICS', title: '[DH] flask-forensics writeup', date: '2026.05', href: 'https://rinhye05.tistory.com/25' },
  { cat: 'WEB',       title: '[Hacktheon] simple-sqli',      date: '2026.05', href: 'https://rinhye05.tistory.com/19' },
]

function mapCategory(raw: string): string {
  const c = raw.toLowerCase()
  if (c.includes('forensic'))  return 'FORENSICS'
  if (c.includes('dreamhack')) return 'DREAMHACK'
  if (c.includes('web'))       return 'WEB'
  if (c.includes('ctf'))       return 'CTF'
  if (c.includes('btlo'))      return 'BTLO'
  if (c.includes('seku'))      return 'SEKURITY'
  if (c.includes('reversing')) return 'REVERSING'
  if (c.includes('study'))     return 'STUDY'
  return raw.toUpperCase() || 'MISC'
}

const CAT_COLOR: Record<string, string> = {
  FORENSICS:  'var(--acc2)',
  DREAMHACK:  'var(--acc2)',
  WEB:        'var(--acc2)',
  CTF:        'var(--acc2)',
  BTLO:       '#ff9500',
  SEKURITY:   '#a855f7',
  REVERSING:  'var(--acc2)',
  STUDY:      'var(--acc)',
  MISC:       'var(--tx2)',
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK)

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data: { title: string; href: string; date: string; category: string }[]) => {
        if (!data?.length) return
        setPosts(data.map((p) => ({
          title: p.title,
          href:  p.href,
          date:  p.date,
          cat:   mapCategory(p.category),
        })))
      })
      .catch(() => {})
  }, [])

  return (
    <section id="blog" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
        <div className="sec-tag">INTEL LOG</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://RECENT_POSTS</div>
      </div>

      <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '7px' }}>
        {posts.map((p) => (
          <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div
              className="blog-card-border"
              style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '.8rem 1rem', transition: 'border-color .2s', height: '100%' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = CAT_COLOR[p.cat] ?? 'var(--acc2)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--bd)')}
            >
              <div style={{ fontSize: '8px', color: CAT_COLOR[p.cat] ?? 'var(--acc2)', letterSpacing: '.14em', marginBottom: '5px' }}>{p.cat}</div>
              <div style={{ fontSize: '10px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.45, marginBottom: '8px' }}>{p.title}</div>
              <div style={{ fontSize: '8px', color: 'var(--tx2)' }}>{p.date}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}