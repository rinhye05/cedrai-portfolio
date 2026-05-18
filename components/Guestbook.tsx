'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Entry = { id: string; name: string; message: string; created_at: string }

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  const fetch = async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setEntries(data)
  }

  useEffect(() => {
    fetch()
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: l } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => l.subscription.unsubscribe()
  }, [])

  const deleteEntry = async (id: string) => {
    await supabase.from('guestbook').delete().eq('id', id)
    fetch()
  }

  const submit = async () => {
    if (!name.trim() || !message.trim()) { setError('이름과 메시지를 입력해주세요.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.from('guestbook').insert({ name: name.trim(), message: message.trim() })
    if (err) { setError('오류가 발생했어요.'); setLoading(false); return }
    setName(''); setMessage('')
    await fetch()
    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--bg3)',
    border: '1px solid var(--bd)',
    color: 'var(--tx)',
    fontFamily: 'inherit',
    fontSize: '13px',
    padding: '8px 12px',
    outline: 'none',
    width: '100%',
  }

  return (
    <section id="guestbook" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="sec-tag">GUESTBOOK</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://GUESTBOOK</div>
      </div>

      {/* 입력 폼 */}
      <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '12px', color: 'var(--acc)', letterSpacing: '.14em', marginBottom: '.4rem' }}>[ NEW ENTRY ]</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NAME"
          style={inputStyle}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="MESSAGE"
          rows={3}
          style={{ ...inputStyle, resize: 'none' }}
        />
        {error && <div style={{ fontSize: '12px', color: 'var(--acc4)' }}>{error}</div>}
        <button
          onClick={submit}
          disabled={loading}
          className="btn-primary"
          style={{ alignSelf: 'flex-end' }}
        >
          {loading ? 'SENDING...' : './SUBMIT'}
        </button>
      </div>

      {/* 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.length === 0 && (
          <div style={{ fontSize: '13px', color: 'var(--tx2)', letterSpacing: '.1em' }}>// 아직 방명록이 없어요.</div>
        )}
        {entries.map((e) => (
          <div key={e.id} className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderLeft: '2px solid var(--acc)', padding: '.9rem 1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--acc)', fontWeight: 700 }}>{e.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--tx2)' }}>{new Date(e.created_at).toLocaleDateString('ko-KR')}</span>
                {user?.id === 'eed9606a-b42c-4197-8d58-7a6592ae91d8' && (
                  <button onClick={() => deleteEntry(e.id)} style={{ background: 'none', border: 'none', color: 'var(--acc4)', cursor: 'pointer', fontSize: '13px' }}>✕</button>
                )}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.7 }}>{e.message}</div>
          </div>
        ))}
      </div>
    </section>
  )
}