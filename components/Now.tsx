'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

type Post = { id: string; content: string; created_at: string; updated_at: string }

export default function Now() {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchPosts = async () => {
    const { data } = await supabase.from('now_posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  useEffect(() => { fetchPosts() }, [])

  const save = async () => {
    if (!content.trim()) return
    if (editId) {
      await supabase.from('now_posts').update({ content, updated_at: new Date().toISOString() }).eq('id', editId)
    } else {
      await supabase.from('now_posts').insert({ content })
    }
    setContent(''); setEditId(null); setShowForm(false); fetchPosts()
  }

  const startEdit = (p: Post) => {
    setContent(p.content); setEditId(p.id); setShowForm(true)
  }

  const deletePost = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    await supabase.from('now_posts').delete().eq('id', id); fetchPosts()
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)',
    fontFamily: 'sans-serif', fontSize: '14px', padding: '10px 14px', outline: 'none', width: '100%',
  }

  return (
    <section style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="sec-tag">NOW</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc)' }} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://NOW</div>
        {isAdmin && (
          <button onClick={() => { setContent(''); setEditId(null); setShowForm(!showForm) }} className="btn-primary" style={{ fontSize: '11px', padding: '4px 10px' }}>
            {showForm && !editId ? 'CANCEL' : '+ NEW'}
          </button>
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--tx2)', marginBottom: '1.5rem', fontFamily: 'sans-serif', lineHeight: 1.7 }}>
        요즘 뭐하고 있는지 기록하는 공간이에요.
      </p>

      {showForm && isAdmin && (
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--acc)', letterSpacing: '.14em' }}>[ {editId ? 'EDIT' : 'NEW'} ENTRY ]</div>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="요즘 뭐하고 있나요?" rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="btn-secondary" style={{ fontSize: '12px' }}>CANCEL</button>
            <button onClick={save} className="btn-primary" style={{ fontSize: '12px' }}>./SAVE</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {posts.length === 0 && (
          <div style={{ fontSize: '13px', color: 'var(--tx2)', letterSpacing: '.1em' }}>// 아직 기록이 없어요.</div>
        )}
        {posts.map((p) => (
          <div key={p.id} className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderLeft: '2px solid var(--acc)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--tx2)', letterSpacing: '.1em' }}>
                {new Date(p.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                {p.updated_at !== p.created_at && <span style={{ color: 'var(--acc3)', marginLeft: '8px' }}>수정됨</span>}
              </span>
              {isAdmin && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => startEdit(p)} style={{ background: 'none', border: '1px solid var(--bd)', color: 'var(--tx2)', cursor: 'pointer', fontSize: '11px', padding: '2px 8px', fontFamily: 'inherit' }}>EDIT</button>
                  <button onClick={() => deletePost(p.id)} style={{ background: 'none', border: 'none', color: 'var(--acc4)', cursor: 'pointer', fontSize: '13px' }}>✕</button>
                </div>
              )}
            </div>
            <div style={{ fontSize: '15px', color: 'var(--tx)', fontFamily: 'sans-serif', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{p.content}</div>
          </div>
        ))}
      </div>
    </section>
  )
}