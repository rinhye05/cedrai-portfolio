// 관리자가 화면에서 편집할 수 있는 콘텐츠 정의.
// 레포에 커밋되는 내용이라 저장 전에 모양을 강제로 맞춥니다.

import { NOW_POSTS, PROJECTS, type NowPost, type Project } from '@/lib/data'

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback)

export type ContentKind = 'projects' | 'now'

type Definition = {
  path: string
  fallback: unknown[]
  sanitize: (input: unknown) => unknown[]
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

export const CONTENT: Record<ContentKind, Definition> = {
  projects: { path: 'data/projects.json', fallback: PROJECTS, sanitize: sanitizeProjects, label: 'projects' },
  now:      { path: 'data/now.json',      fallback: NOW_POSTS, sanitize: sanitizeNow,      label: 'now' },
}

export const isContentKind = (v: string): v is ContentKind => v in CONTENT
