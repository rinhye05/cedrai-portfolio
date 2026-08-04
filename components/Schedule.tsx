'use client'

import { useEffect, useState } from 'react'
import { EVENT_COLORS, SCHEDULE_DATA, type ScheduleData } from '@/lib/data'
import { useEditable } from '@/lib/use-editable'
import Notice from '@/components/Notice'

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
  const { isAdmin, items: scheduleData, saving, notice, setNotice, commit } = useEditable<ScheduleData>('schedule', SCHEDULE_DATA)

  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected,  setSelected]  = useState(toDateStr(today.getFullYear(), today.getMonth(), today.getDate()))
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [eventForm, setEventForm] = useState({ date: selected, title: '', description: '', color: EVENT_COLORS[0] })
  const [todoForm, setTodoForm] = useState({ date: selected, content: '', done: false })

  useEffect(() => {
    setEventForm(prev => ({ ...prev, date: selected }))
    setTodoForm(prev => ({ ...prev, date: selected }))
  }, [selected])

  const events = [...scheduleData.events].sort((a, b) => a.date.localeCompare(b.date))
  const todos = [...scheduleData.todos].sort((a, b) => a.date.localeCompare(b.date))
  const eventDates = new Set(events.map(e => e.date))
  const todoDates  = new Set(todos.map(t => t.date))

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDay(viewYear, viewMonth)
  const cells       = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const selectedEvents = events.filter(e => e.date === selected)
  const selectedTodos  = todos.filter(t => t.date === selected)

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) } else setViewMonth(m => m + 1) }

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT']

  const addEvent = async () => {
    const title = eventForm.title.trim()
    if (!title) {
      setNotice({ kind: 'err', text: '일정 제목을 입력해주세요.' })
      return
    }

    const next: ScheduleData = {
      ...scheduleData,
      events: [
        ...scheduleData.events,
        {
          id: `event-${Date.now()}`,
          title,
          date: eventForm.date,
          description: eventForm.description.trim(),
          color: eventForm.color,
        },
      ],
    }

    if (await commit(next)) {
      setEventForm({ date: selected, title: '', description: '', color: EVENT_COLORS[0] })
      setShowEventForm(false)
    }
  }

  const addTodo = async () => {
    const content = todoForm.content.trim()
    if (!content) {
      setNotice({ kind: 'err', text: '할 일 내용을 입력해주세요.' })
      return
    }

    const next: ScheduleData = {
      ...scheduleData,
      todos: [
        ...scheduleData.todos,
        {
          id: `todo-${Date.now()}`,
          date: todoForm.date,
          content,
          done: todoForm.done,
        },
      ],
    }

    if (await commit(next)) {
      setTodoForm({ date: selected, content: '', done: false })
      setShowTodoForm(false)
    }
  }

  return (
    <section id="schedule" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div className="sec-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="sec-tag sec-tag-red">SCHEDULE</div>
        <div className="sec-rule" style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc2)' }} />
        </div>
        <div className="sec-path" style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://SCHEDULE</div>
      </div>

      {isAdmin && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button onClick={() => { setShowEventForm(v => !v); setShowTodoForm(false) }} className="btn-primary" style={{ fontSize: '11px', padding: '4px 10px' }}>
            {showEventForm ? 'CANCEL EVENT' : '+ ADD EVENT'}
          </button>
          <button onClick={() => { setShowTodoForm(v => !v); setShowEventForm(false) }} className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>
            {showTodoForm ? 'CANCEL TODO' : '+ ADD TODO'}
          </button>
        </div>
      )}

      {isAdmin && <Notice notice={notice} />}

      {isAdmin && showEventForm && (
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--acc)', letterSpacing: '.14em' }}>[ NEW EVENT ]</div>
          <input type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '8px 10px' }} />
          <input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="제목" style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '8px 10px' }} />
          <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="설명" rows={3} style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '8px 10px', resize: 'vertical' }} />
          <select value={eventForm.color} onChange={e => setEventForm({ ...eventForm, color: e.target.value })} style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '8px 10px' }}>
            {EVENT_COLORS.map(color => <option key={color} value={color} style={{ color: 'var(--bg)' }}>{color}</option>)}
          </select>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => setShowEventForm(false)} className="btn-secondary" style={{ fontSize: '12px' }}>CANCEL</button>
            <button onClick={addEvent} disabled={saving} className="btn-primary" style={{ fontSize: '12px' }}>{saving ? 'COMMITTING...' : './SAVE'}</button>
          </div>
        </div>
      )}

      {isAdmin && showTodoForm && (
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--acc3)', letterSpacing: '.14em' }}>[ NEW TODO ]</div>
          <input type="date" value={todoForm.date} onChange={e => setTodoForm({ ...todoForm, date: e.target.value })} style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '8px 10px' }} />
          <input value={todoForm.content} onChange={e => setTodoForm({ ...todoForm, content: e.target.value })} placeholder="할 일" style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '8px 10px' }} />
          <label style={{ fontSize: '13px', color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={todoForm.done} onChange={e => setTodoForm({ ...todoForm, done: e.target.checked })} />
            완료됨
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => setShowTodoForm(false)} className="btn-secondary" style={{ fontSize: '12px' }}>CANCEL</button>
            <button onClick={addTodo} disabled={saving} className="btn-primary" style={{ fontSize: '12px' }}>{saving ? 'COMMITTING...' : './SAVE'}</button>
          </div>
        </div>
      )}

      <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* 왼쪽: 캘린더 */}
        <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontSize: '20px' }}>‹</button>
            <span style={{ fontSize: '15px', color: 'var(--txw)', fontWeight: 700, letterSpacing: '.1em' }}>
              {viewYear} {MONTHS[viewMonth]}
            </span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontSize: '20px' }}>›</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: i === 0 ? '#ff6b6b' : i === 6 ? '#b7aefe' : 'var(--tx2)', padding: '4px 0', letterSpacing: '.04em' }}>{d}</div>
            ))}
          </div>

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
                <div key={day} onClick={() => setSelected(dateStr)}
                  style={{
                    textAlign: 'center', padding: '7px 2px', cursor: 'pointer', position: 'relative',
                    background: isSel ? 'var(--acc)' : isToday ? 'rgba(183,174,254,0.15)' : 'transparent',
                    border: isSel ? '1px solid var(--acc)' : '1px solid transparent',
                    borderRadius: '2px',
                    color: isSel ? 'var(--bg)' : col === 0 ? '#ff6b6b' : col === 6 ? '#b7aefe' : 'var(--tx)',
                    fontSize: '13px', fontWeight: isToday ? 700 : 400,
                    transition: 'background .15s',
                  }}
                >
                  {day}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '2px', minHeight: '5px' }}>
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

          <div style={{ fontSize: '14px', color: 'var(--acc)', letterSpacing: '.12em', fontWeight: 700 }}>
            {selected} {DAYS[new Date(selected + 'T00:00:00').getDay()]}
          </div>

          {/* 이벤트 */}
          <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--acc2)', letterSpacing: '.14em', marginBottom: '.8rem' }}>[ EVENTS ]</div>

            {selectedEvents.length === 0 && (
              <div style={{ fontSize: '13px', color: 'var(--tx2)' }}>// 이벤트 없음</div>
            )}
            {selectedEvents.map(e => (
              <div key={e.id} style={{ borderLeft: `2px solid ${e.color}`, paddingLeft: '10px', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', color: 'var(--txw)', fontWeight: 700 }}>{e.title}</div>
                {e.description && <div style={{ fontSize: '12px', color: 'var(--tx2)', marginTop: '2px' }}>{e.description}</div>}
              </div>
            ))}
          </div>

          {/* 투두 */}
          <div className="hud-corner" style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--acc3)', letterSpacing: '.14em', marginBottom: '.8rem' }}>[ TODO ]</div>

            {selectedTodos.length === 0 && (
              <div style={{ fontSize: '13px', color: 'var(--tx2)' }}>// 투두 없음</div>
            )}
            {selectedTodos.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '18px', height: '18px', border: `1px solid ${t.done ? 'var(--acc2)' : 'var(--bd)'}`, background: t.done ? 'var(--acc2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {t.done && <span style={{ fontSize: '11px', color: 'var(--bg)', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: '14px', color: t.done ? 'var(--tx2)' : 'var(--tx)', textDecoration: t.done ? 'line-through' : 'none', flex: 1, fontFamily: 'sans-serif' }}>{t.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
