'use client'

import Link from 'next/link'

const links = [
  { label: 'ABOUT',    href: '/about'    },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'BLOG',     href: '#blog'     },
  { label: 'CONTACT',  href: '#contact'  },
]

export default function Nav() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: '48px',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--bd)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* 로고 */}
      <Link href="/" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--txw)' }}>
        <span style={{ color: 'var(--acc)' }}>❮</span>
        Cédrai
        <span style={{ color: 'var(--acc)' }}>/❯</span>
      </Link>

      {/* 링크 */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            style={{
              color: 'var(--tx2)',
              fontSize: '9px',
              textDecoration: 'none',
              letterSpacing: '.14em',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--acc)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--tx2)')}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* 상태 표시 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>
        <div className="scanner-pulse" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--acc)' }} />
        SYS ONLINE
      </div>
    </nav>
  )
}
