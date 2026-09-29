import Link from 'next/link'

const ACTIVITIES = [
  {
    title: 'COMPETITIONS & ACTIVITIES',
    accent: 'var(--acc)',
    items: [
      { label: 'CTF' },
      { label: '2025 MSG CTF', href: '/activities/competitions/msg-ctf', nested: true },
      { label: '2025 KU CTF', href: '/activities/competitions/ku-ctf', nested: true },
      { label: 'K.knock · D-Alpha · CAUtion 동아리 연합 CTF', href: '/activities/competitions/club-union-ctf', nested: true },
      { label: '2026 핵테온', href: '/activities/competitions/hacktheon', nested: true },
      { label: 'COMPETITIONS' },
      { label: '2026 충청권 사이버보안 경진대회', href: '/activities/competitions/chungcheong-cyber', nested: true },
    ],
  },
  {
    title: 'CLUB ACTIVITIES',
    accent: 'var(--acc2)',
    items: [
      { label: 'seKUrity · 25.03 – 25.08' },
      { label: '신입부원', href: '/club/sekurity/rookie', nested: true },
      { label: 'seKUrity · 25.09 – PRESENT' },
      { label: 'FORENSIC STUDY', href: '/activities/forensic-study', nested: true },
    ],
  },
]

export default function Activities() {
  return (
    <section id="activities" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
        <div className="sec-tag">ACTIVITIES</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div className="sec-path" style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>PROFILE://ACTIVITIES</div>
      </div>
      <div className="activities-grid">
        {ACTIVITIES.map((group) => (
          <div key={group.title} className="activities-card hud-corner" style={{ borderTopColor: group.accent }}>
            <div className="activities-card__title" style={{ color: group.accent }}>{group.title}</div>
            <div className="activities-card__items">
              {group.items.map((item) => (
                <div key={item.label} className="activities-item">
                  {item.href ? (
                    <Link className={`activities-item__label activities-item__link${'nested' in item && item.nested ? ' activities-item__link--nested' : ''}`} href={item.href}>{item.label}<span>↗</span></Link>
                  ) : (
                    <div className="activities-item__label">{item.label}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
