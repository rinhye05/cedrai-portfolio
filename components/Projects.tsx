'use client'

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

      <div
        className="clip-card"
        style={{
          background: 'var(--bg2)',
          padding: '3rem 2rem',
          border: '1px dashed var(--bd)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          minHeight: '200px',
        }}
      >
        <div style={{ fontSize: '9px', color: 'var(--acc)', letterSpacing: '.2em' }}>[ CLASSIFIED ]</div>
        <div style={{ fontSize: '22px', color: 'var(--txw)', fontWeight: 700, letterSpacing: '.08em' }}>COMING SOON</div>
        <div style={{ fontSize: '9px', color: 'var(--tx2)', letterSpacing: '.12em', textAlign: 'center', lineHeight: 2 }}>
          프로젝트 준비 중입니다.<br />
          결과물이 공개되면 업데이트됩니다.
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '.5rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: '18px', height: '2px', background: i < 2 ? 'var(--acc)' : 'var(--bd)' }} />
          ))}
        </div>
      </div>
    </section>
  )
}