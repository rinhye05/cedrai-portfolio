'use client'

import { useState } from 'react'

const PROJECTS = [
  {
    type: '[ COMPLETED ]',
    red: false,
    status: 'LIVE',
    progress: 100,
    title: 'seKUrity 소모임 공식 웹사이트',
    desc: '보안 소모임 seKUrity 공식 웹사이트. 사이버펑크 HUD 테마 기반 UI, 회원 관리 시스템, Supabase 백엔드 연동.',
    tags: ['HTML', 'CSS', 'JS', 'SUPABASE', 'VERCEL'],
    link: 'https://se-k-urity.vercel.app/',
    timeline: [
      { step: '01', label: '기획 & 디자인', desc: '사이버펑크 HUD 테마 UI 설계. 스캔라인, 글리치, 커스텀 커서 구현' },
      { step: '02', label: '프론트엔드 개발', desc: '로딩 인트로 / Hero·About·Activities·Achievements·Members·Contact 섹션 / 반응형 / 스크롤 애니메이션' },
      { step: '03', label: '배포 환경 구축', desc: 'GitHub 연동 · Vercel 자동 배포 파이프라인 (push → 자동 반영)' },
      { step: '04', label: '콘텐츠 작성', desc: '활동 분야 7개 · 수상 경력 13건 · 부원 13명 카드 구성' },
      { step: '05', label: '부원 소개 페이지', desc: 'members.html 별도 제작. 직책별 카드, 관심분야 태그, 블로그 링크 연동' },
      { step: '06', label: 'Supabase 연동', desc: 'PostgreSQL DB 설계 · Row Level Security · 회원가입/로그인/로그아웃' },
      { step: '07', label: '권한 시스템', desc: '관리자 계정 분리 · Admin 페이지 멤버 관리 · 일반 유저 본인 카드만 수정' },
    ],
  },
]

export default function Projects() {
  const [openTimeline, setOpenTimeline] = useState<string | null>(null)

  return (
    <section id="projects" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
        <div className="sec-tag sec-tag-red">PROJECTS</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc2)' }} />
        </div>
        <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://SELECTED_WORKS</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {PROJECTS.map((p) => (
          <div key={p.title}>
            <div
              className={`clip-card hud-corner ${p.red ? 'hud-corner-red' : ''}`}
              style={{ background: 'var(--bg2)', padding: '1.2rem' }}
            >
              {/* 상단 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                <div style={{ fontSize: '8px', letterSpacing: '.16em', color: 'var(--acc)' }}>{p.type}</div>
                <div style={{ fontSize: '7px', color: '#00ff88', border: '1px solid #00ff88', padding: '1px 6px', letterSpacing: '.12em' }}>
                  ● {p.status}
                </div>
              </div>

              {/* 제목 */}
              <div style={{ fontSize: '13px', color: 'var(--txw)', fontWeight: 700, fontFamily: 'sans-serif', marginBottom: '.5rem' }}>{p.title}</div>

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
                <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ flex: 1, height: '2px', background: 'var(--acc)' }} />
                  ))}
                </div>
              </div>

              {/* 링크 + 타임라인 토글 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.7rem' }}>
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', color: 'var(--tx2)', letterSpacing: '.08em', textDecoration: 'none' }}>
                  <span style={{ color: 'var(--acc)', marginRight: '4px' }}>//</span>
                  {p.link}
                </a>
                <button
                  onClick={() => setOpenTimeline(openTimeline === p.title ? null : p.title)}
                  style={{ fontSize: '8px', color: 'var(--acc)', background: 'transparent', border: '1px solid var(--acc)', padding: '2px 8px', cursor: 'pointer', letterSpacing: '.1em' }}
                >
                  {openTimeline === p.title ? 'CLOSE' : 'TIMELINE ▾'}
                </button>
              </div>

              {/* 태그 */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontSize: '8px', border: '1px solid var(--bd)', color: 'var(--tx2)', padding: '1px 6px' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* 타임라인 */}
            {openTimeline === p.title && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', borderTop: 'none', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {p.timeline.map((t, i) => (
                  <div key={t.step} style={{ display: 'flex', gap: '1rem', paddingBottom: i < p.timeline.length - 1 ? '1rem' : '0', position: 'relative' }}>
                    {/* 세로선 */}
                    {i < p.timeline.length - 1 && (
                      <div style={{ position: 'absolute', left: '15px', top: '24px', width: '1px', height: 'calc(100% - 8px)', background: 'var(--bd)' }} />
                    )}
                    {/* 스텝 번호 */}
                    <div style={{ flexShrink: 0, width: '30px', height: '30px', border: '1px solid var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'var(--acc)', letterSpacing: '.06em', background: 'var(--bg2)', zIndex: 1 }}>
                      {t.step}
                    </div>
                    {/* 내용 */}
                    <div style={{ paddingTop: '4px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--txw)', fontWeight: 700, marginBottom: '3px', letterSpacing: '.06em' }}>{t.label}</div>
                      <div style={{ fontSize: '9px', color: 'var(--tx2)', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 추가 예정 */}
        <div className="clip-card" style={{ background: 'var(--bg2)', padding: '1.2rem', border: '1px dashed var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: 'var(--tx2)', marginBottom: '4px' }}>+</div>
            <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.12em' }}>MORE COMING SOON</div>
          </div>
        </div>
      </div>
    </section>
  )
}