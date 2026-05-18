'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

type TimelineItem = { step: string; label: string; description: string }
type Project = {
  id: string; type: string; status: string; progress: number
  title: string; description: string; tags: string[]; link: string
  timeline: TimelineItem[]
}

const EMPTY_FORM = {
  type: '[ COMPLETED ]', status: 'LIVE', progress: 100,
  title: '', description: '', tags: '', link: '', timeline: '[]'
}

export default function Projects() {
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [openTimeline, setOpenTimeline] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at')
    if (data) setProjects(data)
  }

  useEffect(() => { fetchProjects() }, [])

  const saveProject = async () => {
    if (!form.title) return
    const payload = {
      ...form,
      progress: Number(form.progress),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      timeline: JSON.parse(form.timeline || '[]'),
    }
    if (editId) {
      await supabase.from('projects').update(payload).eq('id', editId)
    } else {
      await supabase.from('projects').insert(payload)
    }
    setForm(EMPTY_FORM); setShowForm(false); setEditId(null); fetchProjects()
  }

  const deleteProject = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    await supabase.from('projects').delete().eq('id', id); fetchProjects()
  }

  const startEdit = (p: Project) => {
    setForm({
      type: p.type, status: p.status, progress: p.progress,
      title: p.title, description: p.description,
      tags: p.tags.join(', '), link: p.link,
      timeline: JSON.stringify(p.timeline, null, 2),
    })
    setEditId(p.id); setShowForm(true)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)',
    fontFamily: 'inherit', fontSize: '13px', padding: '8px 12px', outline: 'none', width: '100%',
  }

  return (
    <section id="projects" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
        <div className="sec-tag sec-tag-red">PROJECTS</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc2)' }} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://SELECTED_WORKS</div>
        {isAdmin && (
          <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(!showForm) }}
            className="btn-primary" style={{ fontSize: '11px', padding: '4px 10px' }}>
            {showForm && !editId ? 'CANCEL' : '+ ADD'}
          </button>
        )}
      </div>

      {/* 추가/수정 폼 */}
      {showForm && isAdmin && (
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--acc)', letterSpacing: '.14em' }}>[ {editId ? 'EDIT' : 'NEW'} PROJECT ]</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="TITLE *" style={inputStyle} />
            <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="LINK (https://...)" style={inputStyle} />
            <input value={form.type} onChange={e => setForm({...form, type: e.target.value})} placeholder="TYPE ([ COMPLETED ])" style={inputStyle} />
            <input value={form.status} onChange={e => setForm({...form, status: e.target.value})} placeholder="STATUS (LIVE)" style={inputStyle} />
            <input value={form.progress} onChange={e => setForm({...form, progress: Number(e.target.value)})} placeholder="PROGRESS (0-100)" type="number" min={0} max={100} style={inputStyle} />
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="TAGS (쉼표로 구분: HTML, CSS, JS)" style={inputStyle} />
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="DESCRIPTION" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx2)', marginBottom: '4px' }}>TIMELINE (JSON 형식)</div>
            <textarea value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})}
              placeholder={`[\n  {"step":"01","label":"기획","description":"설명"}\n]`}
              rows={6} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '11px' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="btn-secondary" style={{ fontSize: '12px' }}>CANCEL</button>
            <button onClick={saveProject} className="btn-primary" style={{ fontSize: '12px' }}>./SAVE</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {projects.map((p) => (
          <div key={p.id}>
            <div className="clip-card hud-corner" style={{ background: 'var(--bg2)', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                <div style={{ fontSize: '12px', letterSpacing: '.16em', color: 'var(--acc)' }}>{p.type}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#00ff88', border: '1px solid #00ff88', padding: '2px 8px', letterSpacing: '.12em' }}>● {p.status}</div>
                  {isAdmin && (
                    <>
                      <button onClick={() => startEdit(p)} style={{ background: 'none', border: '1px solid var(--bd)', color: 'var(--tx2)', cursor: 'pointer', fontSize: '11px', padding: '2px 8px', fontFamily: 'inherit' }}>EDIT</button>
                      <button onClick={() => deleteProject(p.id)} style={{ background: 'none', border: 'none', color: 'var(--acc4)', cursor: 'pointer', fontSize: '13px' }}>✕</button>
                    </>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '16px', color: 'var(--txw)', fontWeight: 700, fontFamily: 'sans-serif', marginBottom: '.5rem' }}>{p.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--tx2)', lineHeight: 1.7, fontFamily: 'sans-serif', marginBottom: '1rem' }}>{p.description}</div>

              <div style={{ marginBottom: '.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>PROGRESS</span>
                  <span style={{ fontSize: '12px', color: 'var(--acc)' }}>{p.progress}%</span>
                </div>
                <div style={{ height: '3px', background: 'var(--bd)', borderRadius: '2px' }}>
                  <div style={{ height: '3px', width: `${p.progress}%`, background: 'var(--acc)', boxShadow: '0 0 6px var(--acc)', borderRadius: '2px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.7rem' }}>
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--tx2)', textDecoration: 'none' }}>
                  <span style={{ color: 'var(--acc)', marginRight: '4px' }}>//</span>{p.link}
                </a>
                {p.timeline?.length > 0 && (
                  <button onClick={() => setOpenTimeline(openTimeline === p.id ? null : p.id)}
                    style={{ fontSize: '12px', color: 'var(--acc)', background: 'transparent', border: '1px solid var(--acc)', padding: '2px 8px', cursor: 'pointer', letterSpacing: '.1em' }}>
                    {openTimeline === p.id ? 'CLOSE' : 'TIMELINE ▾'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {p.tags?.map((t) => (
                  <span key={t} style={{ fontSize: '12px', border: '1px solid var(--bd)', color: 'var(--acc3)', padding: '2px 8px' }}>{t}</span>
                ))}
              </div>
            </div>

            {openTimeline === p.id && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', borderTop: 'none', padding: '1.2rem', display: 'flex', flexDirection: 'column' }}>
                {p.timeline?.map((t, i) => (
                  <div key={t.step} style={{ display: 'flex', gap: '1rem', paddingBottom: i < p.timeline.length - 1 ? '1rem' : '0', position: 'relative' }}>
                    {i < p.timeline.length - 1 && (
                      <div style={{ position: 'absolute', left: '15px', top: '24px', width: '1px', height: 'calc(100% - 8px)', background: 'var(--bd)' }} />
                    )}
                    <div style={{ flexShrink: 0, width: '30px', height: '30px', border: '1px solid var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--acc)', background: 'var(--bg2)', zIndex: 1 }}>{t.step}</div>
                    <div style={{ paddingTop: '4px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--txw)', fontWeight: 700, marginBottom: '3px' }}>{t.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{t.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="clip-card" style={{ background: 'var(--bg2)', padding: '1.2rem', border: '1px dashed var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: 'var(--tx2)', marginBottom: '4px' }}>+</div>
            <div style={{ fontSize: '13px', color: 'var(--tx2)', letterSpacing: '.12em' }}>MORE COMING SOON</div>
          </div>
        </div>
      </div>
    </section>
  )
}