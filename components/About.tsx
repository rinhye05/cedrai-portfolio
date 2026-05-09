'use client'

const ABOUT = {
  intro: [
    '건국대학교 GLOCAL캠퍼스 컴퓨터공학과에 재학 중입니다.',
    '보안에 관심을 가지고 CTF, 포렌식, 웹해킹, 리버싱을 공부하고 있습니다.',
    '소모임 seKUrity에서 활동중입니다.',
  ],
  education: [
    { label: 'UNIVERSITY', value: 'KONKUK UNIV. GLOCAT' },
    { label: 'MAJOR',      value: 'Computer Engineering' },
    { label: 'STATUS',     value: 'Enrolled' },
    { label: 'LOCATION',   value: 'Chungju, Korea' },
  ],
  certs: [
    // 자격증 생기면 여기에 추가
    // { name: '정보처리기사', date: '2025.00', status: 'ACQUIRED' },
  ] as { name: string; date: string; status: string }[],
  activities: [
    { label: 'CTF PLATFORM', value: 'Dreamhack' },
    { label: 'BLOG',         value: 'rinhye05.tistory.com' },
    { label: 'GITHUB',       value: 'github.com/rinhye05' },
  ],
}

export default function About() {
  return (
    <section id="about-detail" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.8rem' }}>
        <div className="sec-tag">ABOUT</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://PROFILE</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>

        {/* 자기소개 */}
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem' }}>
          <div style={{ fontSize: '8px', color: 'var(--acc)', letterSpacing: '.18em', marginBottom: '.9rem' }}>[ INTRODUCTION ]</div>
          {ABOUT.intro.map((line, i) => (
            <p key={i} style={{ fontSize: '10px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.85, marginBottom: '.3rem' }}>{line}</p>
          ))}
        </div>

        {/* 학교/전공 */}
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem' }}>
          <div style={{ fontSize: '8px', color: 'var(--acc)', letterSpacing: '.18em', marginBottom: '.9rem' }}>[ EDUCATION ]</div>
          {ABOUT.education.map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.55rem', paddingBottom: '.55rem', borderBottom: '1px solid var(--bd)' }}>
              <span style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.12em' }}>{item.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--txw)', fontFamily: 'sans-serif' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* 자격증 */}
        <div className="hud-corner hud-corner-red" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem' }}>
          <div style={{ fontSize: '8px', color: 'var(--acc2)', letterSpacing: '.18em', marginBottom: '.9rem' }}>[ CERTIFICATIONS ]</div>
          {ABOUT.certs.length === 0 ? (
            <div style={{ fontSize: '9px', color: 'var(--tx2)', letterSpacing: '.1em' }}>// 준비 중</div>
          ) : (
            ABOUT.certs.map((c) => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.6rem' }}>
                <span style={{ fontSize: '10px', color: 'var(--tx)', fontFamily: 'sans-serif' }}>{c.name}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '8px', color: 'var(--tx2)' }}>{c.date}</span>
                  <span style={{ fontSize: '7px', color: 'var(--acc)', border: '1px solid var(--acc)', padding: '1px 5px', letterSpacing: '.08em' }}>{c.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 활동 */}
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem' }}>
          <div style={{ fontSize: '8px', color: 'var(--acc)', letterSpacing: '.18em', marginBottom: '.9rem' }}>[ ACTIVITY ]</div>
          {ABOUT.activities.map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.55rem', paddingBottom: '.55rem', borderBottom: '1px solid var(--bd)' }}>
              <span style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.12em' }}>{item.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--txw)', fontFamily: 'sans-serif' }}>{item.value}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}