'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Event = { id: string; title: string; date: string; description: string; color: string }
type Todo  = { id: string; date: string; content: string; done: boolean }

const COLORS = ['#b7aefe', '#00f5d4', '#ffd166', '#ff6b6b', '#22c55e', '#a855f7']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function pad(n: number) { return String(n).padStart(2, '0') }
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export default function Schedule() {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected,  setSelected]  = useState(toDateStr(today.getFullYear(), today.getMonth(), today.getDate()))

  const [events,    setEvents]    = useState<Event[]>([])
  const [todos,     setTodos]     = useState<Todo[]>([])
  const [user,      setUser]      = useState<User | null>(null)

  const [showLogin,  setShowLogin]  = useState(false)
  const [showEForm,  setShowEForm]  = useState(false)
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [loginError, setLoginError] = useState('')

  const [eForm, setEForm] = useState({ title: '', date: selected, description: '', color: '#b7aefe' })
  const [todoInput, setTodoInput] = useState('')

  // fetch
  const fetchEvents = async () => {
    const { data } = await supabase.from('schedule').select('*').order('date')
    if (data) setEvents(data)
  }
  const fetchTodos = async () => {
    const { data } = await supabase.from('todos').select('*').order('created_at')
    if (data) setTodos(data)
  }

  useEffect(() => {
    fetchEvents(); fetchTodos()
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: l } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => l.subscription.unsubscribe()
  }, [])

  // auth
  const login = async () => {
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setLoginError('이메일 또는 비밀번호가 틀렸어요.'); return }
    setShowLogin(false); setEmail(''); setPassword('')
  }
  const logout = async () => { await supabase.auth.signOut() }

  // events
  const addEvent = async () => {
    if (!eForm.title || !eForm.date) return
    await supabase.from('schedule').insert(eForm)
    setEForm({ title: '', date: selected, description: '', color: '#b7aefe' })
    setShowEForm(false); fetchEvents()
  }
  const deleteEvent = async (id: string) => {
    await supabase.from('schedule').delete().eq('id', id); fetchEvents()
  }

  // todos
  const addTodo = async () => {
    if (!todoInput.trim()) return
    await supabase.from('todos').insert({ date: selected, content: todoInput.trim(), done: false })
    setTodoInput(''); fetchTodos()
  }
  const toggleTodo = async (t: Todo) => {
    await supabase.from('todos').update({ done: !t.done }).eq('id', t.id); fetchTodos()
  }
  const deleteTodo = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id); fetchTodos()
  }

  // 달력 계산
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDay(viewYear, viewMonth)
  const cells       = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const eventDates  = new Set(events.map(e => e.date))
  const todoDates   = new Set(todos.map(t => t.date))

  const selectedEvents = events.filter(e => e.date === selected)
  const selectedTodos  = todos.filter(t => t.date === selected)

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) } else setViewMonth(m => m + 1) }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)',
    fontFamily: 'inherit', fontSize: '13px', padding: '8px 12px', outline: 'none', width: '100%',
  }

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT']

  return (
    <section id="schedule" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)', maxWidth: '900px', margin: '0 auto' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="sec-tag sec-tag-red">SCHEDULE</div>
        <div style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc2)' }} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://SCHEDULE</div>
        {user ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--acc2)' }}>ADMIN</span>
            <button onClick={logout} className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>LOGOUT</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(!showLogin)} className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>LOGIN</button>
        )}
      </div>

      {/* 로그인 폼 */}
      {showLogin && !user && (
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
          <div style={{ fontSize: '12px', color: 'var(--acc2)', letterSpacing: '.14em' }}>[ ADMIN LOGIN ]</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="EMAIL" type="email" style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="PASSWORD" type="password" style={inputStyle} />
          {loginError && <div style={{ fontSize: '12px', color: 'var(--acc4)' }}>{loginError}</div>}
          <button onClick={login} className="btn-primary" style={{ alignSelf: 'flex-end' }}>./LOGIN</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* 왼쪽: 캘린더 */}
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem' }}>
          {/* 월 네비 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontSize: '16px' }}>‹</button>
            <span style={{ fontSize: '14px', color: 'var(--txw)', fontWeight: 700, letterSpacing: '.1em' }}>
              {viewYear} {MONTHS[viewMonth]}
            </span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontSize: '16px' }}>›</button>
          </div>

          {/* 요일 헤더 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{ textAlign: 'center', fontSize: '10px', color: i === 0 ? '#ff6b6b' : i === 6 ? '#b7aefe' : 'var(--tx2)', padding: '4px 0', letterSpacing: '.06em' }}>{d}</div>
            ))}
          </div>

          {/* 날짜 셀 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = toDateStr(viewYear, viewMonth, day)
              const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
              const isSel   = dateStr === selected
              const hasEv   = eventDates.has(dateStr)
              const hasTodo = todoDates.has(dateStr)
              const col     = i % 7

              return (
                <div
                  key={day}
                  onClick={() => { setSelected(dateStr); setEForm(f => ({ ...f, date: dateStr })) }}
                  style={{
                    textAlign: 'center', padding: '6px 2px', cursor: 'pointer', position: 'relative',
                    background: isSel ? 'var(--acc)' : isToday ? 'rgba(183,174,254,0.12)' : 'transparent',
                    border: isSel ? '1px solid var(--acc)' : '1px solid transparent',
                    borderRadius: '2px',
                    color: isSel ? 'var(--bg)' : col === 0 ? '#ff6b6b' : col === 6 ? '#b7aefe' : 'var(--tx)',
                    fontSize: '12px', fontWeight: isToday ? 700 : 400,
                    transition: 'background .15s',
                  }}
                >
                  {day}
                  {/* 이벤트/투두 도트 */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '2px', minHeight: '4px' }}>
                    {hasEv  && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSel ? 'var(--bg)' : 'var(--acc2)' }} />}
                    {hasTodo && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSel ? 'var(--bg)' : 'var(--acc3)' }} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 오른쪽: 선택된 날 상세 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* 날짜 표시 */}
          <div style={{ fontSize: '13px', color: 'var(--acc)', letterSpacing: '.12em', fontWeight: 700 }}>
            {selected} {['SUN','MON','TUE','WED','THU','FRI','SAT'][new Date(selected + 'T00:00:00').getDay()]}
          </div>

          {/* 이벤트 목록 */}
          <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--acc2)', letterSpacing: '.14em' }}>[ EVENTS ]</div>
              {user && (
                <button onClick={() => setShowEForm(!showEForm)} style={{ fontSize: '11px', color: 'var(--acc)', background: 'none', border: '1px solid var(--acc)', padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {showEForm ? 'CANCEL' : '+ ADD'}
                </button>
              )}
            </div>

            {/* 이벤트 추가 폼 */}
            {showEForm && user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', padding: '10px', background: 'var(--bg3)', border: '1px solid var(--bd)' }}>
                <input value={eForm.title} onChange={e => setEForm({ ...eForm, title: e.target.value })} placeholder="TITLE" style={inputStyle} />
                <textarea value={eForm.description} onChange={e => setEForm({ ...eForm, description: e.target.value })} placeholder="DESCRIPTION (선택)" rows={2} style={{ ...inputStyle, resize: 'none' }} />
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--tx2)' }}>COLOR:</span>
                  {COLORS.map(c => (
                    <div key={c} onClick={() => setEForm({ ...eForm, color: c })} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, cursor: 'pointer', border: eForm.color === c ? '2px solid white' : '2px solid transparent' }} />
                  ))}
                </div>
                <button onClick={addEvent} className="btn-primary" style={{ alignSelf: 'flex-end', fontSize: '11px' }}>./SAVE</button>
              </div>
            )}

            {selectedEvents.length === 0 && !showEForm && (
              <div style={{ fontSize: '12px', color: 'var(--tx2)' }}>// 이벤트 없음</div>
            )}
            {selectedEvents.map(e => (
              <div key={e.id} style={{ borderLeft: `2px solid ${e.color}`, paddingLeft: '10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--txw)', fontWeight: 700 }}>{e.title}</div>
                  {e.description && <div style={{ fontSize: '11px', color: 'var(--tx2)', marginTop: '2px' }}>{e.description}</div>}
                </div>
                {user && <button onClick={() => deleteEvent(e.id)} style={{ background: 'none', border: 'none', color: 'var(--acc4)', cursor: 'pointer', fontSize: '13px' }}>✕</button>}
              </div>
            ))}
          </div>

          {/* 투두 목록 */}
          <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1rem', flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--acc3)', letterSpacing: '.14em', marginBottom: '.8rem' }}>[ TODO ]</div>

            {user && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <input
                  value={todoInput}
                  onChange={e => setTodoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTodo()}
                  placeholder="할 일 입력 후 Enter"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={addTodo} className="btn-primary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>ADD</button>
              </div>
            )}

            {selectedTodos.length === 0 && (
              <div style={{ fontSize: '12px', color: 'var(--tx2)' }}>// 투두 없음</div>
            )}
            {selectedTodos.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div
                  onClick={() => user && toggleTodo(t)}
                  style={{
                    width: '16px', height: '16px', border: `1px solid ${t.done ? 'var(--acc2)' : 'var(--bd)'}`,
                    background: t.done ? 'var(--acc2)' : 'transparent', cursor: user ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  {t.done && <span style={{ fontSize: '10px', color: 'var(--bg)', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: '13px', color: t.done ? 'var(--tx2)' : 'var(--tx)', textDecoration: t.done ? 'line-through' : 'none', flex: 1, fontFamily: 'sans-serif' }}>{t.content}</span>
                {user && <button onClick={() => deleteTodo(t.id)} style={{ background: 'none', border: 'none', color: 'var(--acc4)', cursor: 'pointer', fontSize: '12px' }}>✕</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}