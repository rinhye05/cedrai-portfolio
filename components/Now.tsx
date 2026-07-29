'use client'

import { NOW_POSTS } from '@/lib/data'

const posts = [...NOW_POSTS].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
)

export default function Now() {
  return (
    <section style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="sec-tag">NOW</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://NOW</div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--tx2)', marginBottom: '1.5rem', fontFamily: 'sans-serif', lineHeight: 1.7 }}>
        요즘 뭐하고 있는지 기록하는 공간이에요.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {posts.length === 0 && (
          <div style={{ fontSize: '13px', color: 'var(--tx2)', letterSpacing: '.1em' }}>// 아직 기록이 없어요.</div>
        )}
        {posts.map((p) => (
          <div key={p.id} className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderLeft: '2px solid var(--acc)', padding: '1.2rem' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--tx2)', letterSpacing: '.1em' }}>
                {new Date(p.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                {p.updated_at !== p.created_at && <span style={{ color: 'var(--acc3)', marginLeft: '8px' }}>수정됨</span>}
              </span>
            </div>
            <div style={{ fontSize: '15px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{p.content}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
