const SKILLS = [
  { name: 'CTF',                pct: 82, red: true  },
  { name: 'FORENSICS',          pct: 88, red: true  },
  { name: 'WEB HACKING',        pct: 74, red: true  },
  { name: 'REVERSING',          pct: 65, red: true  },
  { name: 'PYTHON',             pct: 90, red: false },
  { name: 'SECURITY',           pct: 80, red: false },
  { name: 'COMPUTER ENG.',      pct: 75, red: false },
  { name: 'AI / LLM',           pct: 70, red: false },
]

export default function Skills() {
  return (
    <section id="skills" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      {/* 섹션 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
        <div className="sec-tag">DATA SCAN</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://TECH_STACK</div>
      </div>

      {/* 스킬 그리드 */}
      <div
        className="skill-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '7px' }}
      >
        {SKILLS.map((sk) => (
          <div
            key={sk.name}
            className={`hud-corner ${sk.red ? 'hud-corner-red' : ''}`}
            style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '.65rem .9rem' }}
          >
            <div style={{ fontSize: '13px', color: 'var(--txw)', letterSpacing: '.06em', marginBottom: '7px' }}>
              {sk.name}
            </div>
            <div style={{ height: '3px', background: 'var(--bd)', borderRadius: '2px' }}>
              <div
                style={{
                  height: '3px',
                  width: `${sk.pct}%`,
                  background: sk.red ? 'var(--acc2)' : 'var(--acc)',
                  boxShadow: sk.red ? '0 0 6px var(--acc2)' : '0 0 6px var(--acc)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
