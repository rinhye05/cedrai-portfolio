'use client'

import { useEffect, useState } from 'react'

type Post = { cat: string; title: string; date: string; href: string }

const FALLBACK: Post[] = [
  { cat: 'FORENSICS', title: '[DH] study_checker writeup',   date: '2026.05', href: 'https://rinhye05.tistory.com/23' },
  { cat: 'FORENSICS', title: '[DH] flask-forensics writeup', date: '2026.05', href: 'https://rinhye05.tistory.com/25' },
  { cat: 'WEB',       title: '[Hacktheon] simple-sqli',      date: '2026.05', href: 'https://rinhye05.tistory.com/19' },
]

function guessCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('forensic') || t.includes('포렌식') || t.includes('prefetch') || t.includes('memory')) return 'FORENSICS'
  if (t.includes('web') || t.includes('sqli') || t.includes('xss') || t.includes('웹')) return 'WEB'
  if (t.includes('crypto') || t.includes('암호') || t.includes('aes') || t.includes('rsa')) return 'CRYPTO'
  if (t.includes('reversing') || t.includes('리버싱') || t.includes('pwn')) return 'REVERSING'
  return 'CTF'
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK)

  useEffect(() => {
    const RSS = 'https://rinhye05.tistory.com/rss'
    const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS)}&count=6`

    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (data.status !== 'ok' || !data.items?.length) return
        const parsed: Post[] = data.items.map((item: { title: string; pubDate: string; link: string }) => ({
          cat: guessCategory(item.title),
          title: item.title,
          date: item.pubDate?.slice(0, 7).replace('-', '.') ?? '',
          href: item.link,
        }))
        setPosts(parsed)
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
          <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div
              className="blog-card-border"
              style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '.8rem 1rem', transition: 'border-color .2s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--acc2)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--bd)')}
            >
              <div style={{ fontSize: '8px', color: 'var(--acc2)', letterSpacing: '.14em', marginBottom: '5px' }}>{p.cat}</div>
              <div style={{ fontSize: '10px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.45, marginBottom: '8px' }}>{p.title}</div>
              <div style={{ fontSize: '8px', color: 'var(--tx2)' }}>{p.date}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}