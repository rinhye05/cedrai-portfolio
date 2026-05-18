'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const links = [
  { label: 'ABOUT',     href: '/about'     },
  { label: 'PROJECTS',  href: '/projects'  },
  { label: 'BLOG',      href: '/blog'      },
  { label: 'GUESTBOOK', href: '/guestbook' },
  { label: 'SCHEDULE',  href: '/schedule'  },
]

function ContactLink() {
  const router = useRouter()
  const handleClick = () => {
    if (window.location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/')
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }
  return (
    <button
      onClick={handleClick}
      style={{
        color: 'var(--tx2)', fontSize: '13px', textDecoration: 'none',
        letterSpacing: '.10em', transition: 'color .2s', cursor: 'pointer',
        background: 'none', border: 'none', fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--acc)')}
      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--tx2)')}
    >
      CONTACT
    </button>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.2rem', height: '48px', background: 'var(--bg2)',
        borderBottom: '1px solid var(--bd)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* 로고 */}
        <Link href="/" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--txw)' }}>
          <span style={{ color: 'var(--acc)' }}>❮</span>Cédrai<span style={{ color: 'var(--acc)' }}>/❯</span>
        </Link>

        {/* 데스크탑 링크 */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {links.map((l) => (
            <Link key={l.label} href={l.href} style={{ color: 'var(--tx2)', fontSize: '13px', textDecoration: 'none', letterSpacing: '.10em', transition: 'color .2s' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--acc)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--tx2)')}
            >{l.label}</Link>
          ))}
          <ContactLink />
        </div>

        {/* 모바일 오른쪽 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* SYS ONLINE - 데스크탑만 */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--acc2)', letterSpacing: '.1em' }}>
            <div className="scanner-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--acc2)' }} />
            SYS ONLINE
          </div>
          {/* 햄버거 버튼 - 모바일만 */}
          <button
            className="nav-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="nav-mobile" style={{
          position: 'fixed', top: '48px', left: 0, right: 0, zIndex: 99,
          background: 'var(--bg2)', borderBottom: '1px solid var(--bd)',
          display: 'flex', flexDirection: 'column',
        }}>
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ padding: '14px 1.2rem', color: 'var(--tx2)', fontSize: '13px', textDecoration: 'none', letterSpacing: '.10em', borderBottom: '1px solid var(--bd)' }}
            >{l.label}</Link>
          ))}
          <button
            onClick={() => { setMenuOpen(false) }}
            style={{ padding: '14px 1.2rem', color: 'var(--tx2)', fontSize: '13px', letterSpacing: '.10em', borderBottom: '1px solid var(--bd)', background: 'none', border: 'none', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer' }}
          >
            CONTACT
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 641px) { .nav-mobile { display: none !important; } }
        @media (max-width: 640px) { .nav-desktop { display: none !important; } }
      `}</style>
    </>
  )
}