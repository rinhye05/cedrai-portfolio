'use client'

const PROJECTS = [
  {
    type: '[ IN PROGRESS ]',
    red: false,
    status: 'ACTIVE',
    progress: 80,
    title: 'seKUrity 서버',
    desc: '보안 소모임 seKUrity 웹사이트. 순수 HTML/CSS/JS로 제작 중.',
    tags: ['HTML', 'CSS', 'JS', 'VERCEL'],
    link: 'https://se-k-urity.vercel.app/',
  },
]

export default function Projects() {
  return (
    <section id="projects" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
        <div className="sec-tag sec-tag-red">PROJECTS</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc2)' }} />
        </div>
        <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://SELECTED_WORKS</div>
      </div>

      <div className="proj-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
        {PROJECTS.map((p) => (
          <a key={p.title} href={p.link} style={{ textDecoration: 'none' }}>
            <div
              className={`clip-card hud-corner ${p.red ? 'hud-corner-red' : ''}`}
              style={{ background: 'var(--bg2)', padding: '1.2rem', cursor: 'pointer', transition: 'outline .2s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.outline = '1px solid rgba(0,229,255,.3)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.outline = 'none')}
            >
              {/* 상단 타입 + 상태 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                <div style={{ fontSize: '8px', letterSpacing: '.16em', color: p.red ? 'var(--acc2)' : 'var(--acc)' }}>{p.type}</div>
                <div style={{ fontSize: '7px', color: '#00ff88', border: '1px solid #00ff88', padding: '1px 6px', letterSpacing: '.12em', animation: 'pulse-dot 2s ease-in-out infinite' }}>
                  ● {p.status}
                </div>
              </div>

              {/* 제목 */}
              <div style={{ fontSize: '13px', color: 'var(--txw)', fontWeight: 700, fontFamily: 'sans-serif', marginBottom: '.5rem', lineHeight: 1.35 }}>{p.title}</div>

              {/* 설명 */}
              <div style={{ fontSize: '10px', color: 'var(--tx2)', lineHeight: 1.7, fontFamily: 'sans-serif', marginBottom: '1rem' }}>{p.desc}</div>

              {/* 진행률 */}
              <div style={{ marginBottom: '.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>PROGRESS</span>
                  <span style={{ fontSize: '8px', color: 'var(--acc)' }}>{p.progress}%</span>
                </div>
                <div style={{ height: '1px', background: 'var(--bd)' }}>
                  <div style={{ height: '1px', width: `${p.progress}%`, background: 'var(--acc)', boxShadow: '0 0 6px var(--acc)' }} />
                </div>
                {/* 세그먼트 */}
                <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ flex: 1, height: '2px', background: i < Math.floor(p.progress / 10) ? 'var(--acc)' : 'var(--bd)' }} />
                  ))}
                </div>
              </div>

              {/* 링크 */}
              <div style={{ marginBottom: '.7rem' }}>
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', color: 'var(--tx2)', letterSpacing: '.08em', textDecoration: 'none' }}>
                  <span style={{ color: 'var(--acc)', marginRight: '4px' }}>//</span>
                  {p.link}
                </a>
              </div>

              {/* 링크 */}
              <div style={{ marginBottom: '.7rem' }}>
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', color: 'var(--tx2)', letterSpacing: '.08em', textDecoration: 'none' }}>
                  <span style={{ color: 'var(--acc)', marginRight: '4px' }}>//</span>
                  {p.link}
                </a>
              </div>

              {/* 태그 */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontSize: '8px', border: '1px solid var(--bd)', color: 'var(--tx2)', padding: '1px 6px' }}>{t}</span>
                ))}
              </div>
            </div>
          </a>
        ))}

        {/* 추가 예정 */}
        <div className="clip-card" style={{ background: 'var(--bg2)', padding: '1.2rem', border: '1px dashed var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: 'var(--tx2)', marginBottom: '4px' }}>+</div>
            <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.12em' }}>MORE COMING SOON</div>
          </div>
        </div>
      </div>
    </section>
  )
}