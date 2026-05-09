'use client'

const POSTS = [
  { cat: 'FORENSICS', title: '[DH] study_checker writeup',   date: '2026.05', href: '#' },
  { cat: 'FORENSICS', title: '[DH] flask-forensics writeup', date: '2026.05', href: '#' },
  { cat: 'WEB',       title: '[Hacktheon] simple-sqli',      date: '2026.05', href: '#' },
]

export default function Blog() {
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
        {POSTS.map((p) => (
          <a key={p.title} href={p.href} style={{ textDecoration: 'none' }}>
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