'use client'

import { useEffect, useState } from 'react'

type Post = { cat: string; title: string; date: string; href: string }

const FALLBACK: Post[] = [
  { cat: 'forensic',  title: '[DH] study_checker writeup',   date: '2026.05', href: 'https://rinhye05.tistory.com/23' },
  { cat: 'dreamhack', title: '[DH] flask-forensics writeup', date: '2026.05', href: 'https://rinhye05.tistory.com/25' },
  { cat: 'ctf',       title: '[Hacktheon] simple-sqli',      date: '2026.05', href: 'https://rinhye05.tistory.com/19' },
]

const CAT_MAP: { key: string; label: string; color: string }[] = [
  { key: 'forensic',  label: 'Forensic',  color: 'var(--acc2)' },
  { key: 'dreamhack', label: 'DreamHack', color: '#ff6b35'     },
  { key: 'ctf',       label: 'CTF',       color: '#ff9500'     },
  { key: 'btlo',      label: 'BTLO',      color: '#22c55e'     },
  { key: 'sekurity',  label: 'seKUrity',  color: '#a855f7'     },
]

// 제목 기반으로 카테고리 분류
function matchCat(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('btlo'))                          return 'btlo'
  if (t.includes('헥테온') || t.includes('hacktheon') || t.includes('hacktheon')) return 'ctf'
  if (t.includes('[dreamhack]') || t.includes('dreamhack')) return 'dreamhack'
  if (t.includes('seku') || t.includes('sekurity')) return 'sekurity'
  // 블로그 소개 등 공지 제외
  if (t === '블로그 소개' || t.includes('공지'))    return 'skip'
  return 'forensic'
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK)

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data: { title: string; href: string; date: string }[]) => {
        if (!data?.length) return
        const mapped: Post[] = data
          .map((p) => ({ ...p, cat: matchCat(p.title) }))
          .filter((p) => p.cat !== 'skip')
        if (mapped.length) setPosts(mapped)
      })
      .catch(() => {})
  }, [])

  const grouped = CAT_MAP.map((c) => ({
    ...c,
    posts: posts.filter((p) => p.cat === c.key).slice(0, 3),
  })).filter((g) => g.posts.length > 0)

  return (
    <section id="blog" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
        <div className="sec-tag">INTEL LOG</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://RECENT_POSTS</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {grouped.map((g) => (
          <div key={g.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '3px', height: '16px', background: g.color, flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: g.color, fontWeight: 700, letterSpacing: '.14em' }}>
                {g.label.toUpperCase()}
              </span>
              <span style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>
                {g.posts.length} POSTS
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--bd)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '7px' }}>
              {g.posts.map((p) => (
                <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--bg2)',
                      border: '1px solid var(--bd)',
                      borderLeft: `2px solid ${g.color}`,
                      padding: '.8rem 1rem',
                      transition: 'background .2s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg3)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg2)')}
                  >
                    <div style={{ fontSize: '10px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.45, marginBottom: '8px' }}>{p.title}</div>
                    <div style={{ fontSize: '8px', color: 'var(--tx2)' }}>{p.date}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}