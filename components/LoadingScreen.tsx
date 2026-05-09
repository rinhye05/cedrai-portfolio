'use client'

import { useEffect, useState } from 'react'

type Phase = 'loading' | 'hello' | 'done'

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const duration = 1800
    const interval = 18
    const steps = duration / interval
    let current = 0

    const timer = setInterval(() => {
      current++
      setProgress(Math.min(Math.round((current / steps) * 100), 100))
      if (current >= steps) {
        clearInterval(timer)
        setPhase('hello')
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(onDone, 500)
        }, 2000)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: '2rem',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity .5s ease',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* 스캔라인 */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(0,229,255,.03) 30px)', pointerEvents: 'none' }} />

      {/* 코너 브라켓 */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', width: '24px', height: '24px', borderTop: '1px solid var(--acc)', borderLeft: '1px solid var(--acc)' }} />
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', width: '24px', height: '24px', borderTop: '1px solid var(--acc)', borderRight: '1px solid var(--acc)' }} />
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', width: '24px', height: '24px', borderBottom: '1px solid var(--acc)', borderLeft: '1px solid var(--acc)' }} />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', width: '24px', height: '24px', borderBottom: '1px solid var(--acc)', borderRight: '1px solid var(--acc)' }} />

      {phase === 'loading' && (
        <>
          <div style={{ fontSize: '9px', color: 'var(--tx2)', letterSpacing: '.2em' }}>SYS://PORTFOLIO.INIT</div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--tx2)', letterSpacing: '.14em', marginBottom: '.5rem' }}>&lt;/</div>
            <div style={{ fontSize: '52px', fontWeight: 700, color: 'var(--txw)', letterSpacing: '.04em', lineHeight: 1 }}>Cédrai</div>
            <div style={{ fontSize: '11px', color: 'var(--tx2)', letterSpacing: '.14em', marginTop: '.5rem' }}>&gt;</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem', width: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '9px', color: 'var(--acc)', letterSpacing: '.16em' }}>LOADING</span>
              <span style={{ fontSize: '9px', color: 'var(--acc)' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '1px', background: 'var(--bd)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '1px', width: `${progress}%`, background: 'var(--acc)', transition: 'width .02s linear', boxShadow: '0 0 8px var(--acc)' }} />
            </div>
            <div style={{ display: 'flex', gap: '3px', width: '100%' }}>
              {[...Array(20)].map((_, i) => (
                <div key={i} style={{ flex: 1, height: '3px', background: i < Math.floor(progress / 5) ? 'var(--acc)' : 'var(--bd)', transition: 'background .1s' }} />
              ))}
            </div>
          </div>

          <div style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.14em' }}>
            {progress < 40 ? 'INITIALIZING...' : progress < 75 ? 'LOADING ASSETS...' : progress < 100 ? 'ALMOST READY...' : 'COMPLETE'}
          </div>
        </>
      )}

      {phase === 'hello' && (
        <div style={{ textAlign: 'center', animation: 'fadeIn .4s ease' }}>
          <div style={{ fontSize: '11px', color: 'var(--tx2)', letterSpacing: '.2em', marginBottom: '1rem' }}>SYS://WELCOME</div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: 'var(--txw)', letterSpacing: '.06em' }}>
            Hello,<br />
            <span style={{ color: 'var(--acc)' }}>World</span>
            <span style={{ color: 'var(--acc2)' }}>.</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  )
}