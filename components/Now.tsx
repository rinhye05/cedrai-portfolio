'use client'

import { useState } from 'react'
import { NOW_POSTS, type NowPost } from '@/lib/data'
import { useEditable } from '@/lib/use-editable'
import Notice from '@/components/Notice'

export default function Now() {
  const { isAdmin, items, saving, notice, setNotice, commit } = useEditable<NowPost>('now', NOW_POSTS)

  const [content, setContent] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const posts = [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const save = async () => {
    const text = content.trim()
    if (!text) { setNotice({ kind: 'err', text: '내용을 입력해주세요.' }); return }

    const now = new Date().toISOString()
    const next = editId
      ? items.map(p => (p.id === editId ? { ...p, content: text, updated_at: now } : p))
      : [...items, { id: `now-${Date.now()}`, content: text, created_at: now, updated_at: now }]

    if (await commit(next)) {
      setContent(''); setEditId(null); setShowForm(false)
    }
  }

  const startEdit = (p: NowPost) => {
    setContent(p.content); setEditId(p.id); setShowForm(true); setNotice(null)
  }

  const deletePost = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    await commit(items.filter(p => p.id !== id))
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)',
    fontFamily: 'sans-serif', fontSize: '14px', padding: '10px 14px', outline: 'none', width: '100%',
  }

  return (
    <section style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div className="sec-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="sec-tag">NOW</div>
        <div className="sec-rule" style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div className="sec-path" style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://NOW</div>
        {isAdmin && (
          <button onClick={() => { setContent(''); setEditId(null); setShowForm(!showForm); setNotice(null) }}
            className="btn-primary" style={{ fontSize: '11px', padding: '4px 10px' }}>
            {showForm && !editId ? 'CANCEL' : '+ NEW'}
          </button>
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--tx2)', marginBottom: '1.5rem', fontFamily: 'sans-serif', lineHeight: 1.7 }}>
        요즘 뭐하고 있는지 기록하는 공간이에요.
      </p>

      {isAdmin && <Notice notice={notice} />}

      {showForm && isAdmin && (
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--acc)', letterSpacing: '.14em' }}>[ {editId ? 'EDIT' : 'NEW'} ENTRY ]</div>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="요즘 뭐하고 있나요?" rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="btn-secondary" style={{ fontSize: '12px' }}>CANCEL</button>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ fontSize: '12px' }}>
              {saving ? 'COMMITTING...' : './SAVE'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {posts.length === 0 && (
          <div style={{ fontSize: '13px', color: 'var(--tx2)', letterSpacing: '.1em' }}>// 아직 기록이 없어요.</div>
        )}
        {posts.map((p) => (
          <div key={p.id} className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderLeft: '2px solid var(--acc)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--tx2)', letterSpacing: '.1em' }}>
                {new Date(p.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                {p.updated_at !== p.created_at && <span style={{ color: 'var(--acc3)', marginLeft: '8px' }}>수정됨</span>}
              </span>
              {isAdmin && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => startEdit(p)} style={{ background: 'none', border: '1px solid var(--bd)', color: 'var(--tx2)', cursor: 'pointer', fontSize: '11px', padding: '2px 8px', fontFamily: 'inherit' }}>EDIT</button>
                  <button onClick={() => deletePost(p.id)} disabled={saving} style={{ background: 'none', border: 'none', color: 'var(--acc4)', cursor: 'pointer', fontSize: '13px' }}>✕</button>
                </div>
              )}
            </div>
            <div style={{ fontSize: '15px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.85, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{p.content}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
