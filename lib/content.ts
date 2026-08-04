// 관리자가 화면에서 편집할 수 있는 콘텐츠 정의.
// 레포에 커밋되는 내용이라 저장 전에 모양을 강제로 맞춥니다.

import { EVENT_COLORS, NOW_POSTS, PROJECTS, SCHEDULE_DATA, type NowPost, type Project, type ScheduleData, type ScheduleEvent, type Todo } from '@/lib/data'

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback)

export type ContentKind = 'projects' | 'now' | 'schedule'

type Definition = {
  path: string
  fallback: unknown
  sanitize: (input: unknown) => unknown
  label: string
}

function sanitizeProjects(input: unknown): Project[] {
  if (!Array.isArray(input)) throw new Error('projects는 배열이어야 합니다.')
  if (input.length > 100) throw new Error('프로젝트가 너무 많습니다.')

  return input.map((raw, i) => {
    const p = (raw ?? {}) as Record<string, unknown>
    const title = str(p.title).trim()
    if (!title) throw new Error(`${i + 1}번째 프로젝트에 제목이 없습니다.`)

    const progress = Number(p.progress)
    const timeline = Array.isArray(p.timeline) ? p.timeline : []

    return {
      id: str(p.id).trim() || `project-${Date.now()}-${i}`,
      type: str(p.type, '[ COMPLETED ]'),
      status: str(p.status, 'LIVE'),
      progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 0,
      title,
      description: str(p.description),
      tags: Array.isArray(p.tags) ? p.tags.map((t) => str(t).trim()).filter(Boolean).slice(0, 20) : [],
      link: str(p.link).trim(),
      timeline: timeline.slice(0, 30).map((t) => {
        const item = (t ?? {}) as Record<string, unknown>
        return { step: str(item.step), label: str(item.label), description: str(item.description) }
      }),
    }
  })
}

function sanitizeNow(input: unknown): NowPost[] {
  if (!Array.isArray(input)) throw new Error('now는 배열이어야 합니다.')
  if (input.length > 300) throw new Error('기록이 너무 많습니다.')

  const iso = (v: unknown, fallback: string) => {
    const d = new Date(str(v))
    return isNaN(d.getTime()) ? fallback : d.toISOString()
  }

  return input.map((raw, i) => {
    const p = (raw ?? {}) as Record<string, unknown>
    const content = str(p.content).trim()
    if (!content) throw new Error(`${i + 1}번째 기록이 비어 있습니다.`)
    if (content.length > 5000) throw new Error(`${i + 1}번째 기록이 너무 깁니다.`)

    const now = new Date().toISOString()
    const created = iso(p.created_at, now)
    return {
      id: str(p.id).trim() || `now-${Date.now()}-${i}`,
      content,
      created_at: created,
      updated_at: iso(p.updated_at, created),
    }
  })
}

function sanitizeSchedule(input: unknown): ScheduleData {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new Error('schedule는 객체이어야 합니다.')

  const raw = input as Record<string, unknown>
  const sanitizeEvent = (item: unknown, i: number): ScheduleEvent => {
    const p = (item ?? {}) as Record<string, unknown>
    const title = str(p.title).trim()
    if (!title) throw new Error(`${i + 1}번째 일정에 제목이 없습니다.`)
    const date = str(p.date).trim()
    if (!date) throw new Error(`${i + 1}번째 일정에 날짜가 없습니다.`)
    return {
      id: str(p.id).trim() || `event-${Date.now()}-${i}`,
      title,
      date,
      description: str(p.description),
      color: str(p.color, EVENT_COLORS[i % EVENT_COLORS.length]),
    }
  }

  const sanitizeTodo = (item: unknown, i: number): Todo => {
    const p = (item ?? {}) as Record<string, unknown>
    const content = str(p.content).trim()
    if (!content) throw new Error(`${i + 1}번째 할 일 내용이 비어 있습니다.`)
    const date = str(p.date).trim()
    if (!date) throw new Error(`${i + 1}번째 할 일 날짜가 없습니다.`)
    return {
      id: str(p.id).trim() || `todo-${Date.now()}-${i}`,
      date,
      content,
      done: p.done === true,
    }
  }

  const events = Array.isArray(raw.events) ? raw.events.map((item, i) => sanitizeEvent(item, i)) : []
  const todos = Array.isArray(raw.todos) ? raw.todos.map((item, i) => sanitizeTodo(item, i)) : []

  return { events, todos }
}

export const CONTENT: Record<ContentKind, Definition> = {
  projects: { path: 'data/projects.json', fallback: PROJECTS, sanitize: sanitizeProjects, label: 'projects' },
  now:      { path: 'data/now.json',      fallback: NOW_POSTS, sanitize: sanitizeNow,      label: 'now' },
  schedule: { path: 'data/schedule.json', fallback: SCHEDULE_DATA, sanitize: sanitizeSchedule, label: 'schedule' },
}

export const isContentKind = (v: string): v is ContentKind => v in CONTENT
