'use client'

import { useState } from 'react'
import { SCHEDULE_EVENTS, TODOS } from '@/lib/data'

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

const events = [...SCHEDULE_EVENTS].sort((a, b) => a.date.localeCompare(b.date))
const eventDates = new Set(events.map(e => e.date))
const todoDates  = new Set(TODOS.map(t => t.date))

export default function Schedule() {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected,  setSelected]  = useState(toDateStr(today.getFullYear(), today.getMonth(), today.getDate()))

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDay(viewYear, viewMonth)
  const cells       = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const selectedEvents = events.filter(e => e.date === selected)
  const selectedTodos  = TODOS.filter(t => t.date === selected)

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) } else setViewMonth(m => m + 1) }

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT']

  return (
    <section id="schedule" style={{ padding: '2rem', borderBottom: '1px solid var(--bd)' }}>
      <div className="sec-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="sec-tag sec-tag-red">SCHEDULE</div>
        <div className="sec-rule" style={{ flex: 1, height: '1px', background: 'var(--bd)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '1px', background: 'var(--acc2)' }} />
        </div>
        <div className="sec-path" style={{ fontSize: '12px', color: 'var(--tx2)', letterSpacing: '.1em' }}>SYS://SCHEDULE</div>
      </div>

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
