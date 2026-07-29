// 사이트 콘텐츠 — 여기를 고치고 git push 하면 배포에 반영됩니다.
// PROJECTS만 예외로 data/projects.json 에 있습니다 (관리자 화면에서 편집 가능).

import projectsJson from '@/data/projects.json'
import nowJson from '@/data/now.json'

export type TimelineItem = { step: string; label: string; description: string }

export type Project = {
  id: string
  type: string
  status: string
  progress: number
  title: string
  description: string
  tags: string[]
  link: string
  timeline: TimelineItem[]
}

export type ScheduleEvent = {
  id: string
  title: string
  date: string        // 'YYYY-MM-DD'
  description: string
  color: string       // COLORS 중 하나
}

export type Todo = {
  id: string
  date: string        // 'YYYY-MM-DD'
  content: string
  done: boolean
}

export type NowPost = {
  id: string
  content: string
  created_at: string  // ISO 문자열
  updated_at: string  // 수정 안 했으면 created_at과 같은 값
}

export const EVENT_COLORS = ['#b7aefe', '#00f5d4', '#ffd166', '#ff6b6b', '#22c55e', '#a855f7']

/** 배포 시점에 번들된 프로젝트 목록. 관리자가 저장하면 GitHub에 커밋되고 재배포되면서 갱신됩니다. */
export const PROJECTS: Project[] = projectsJson as Project[]

// 예시:
// { id: 'ctf-2026', title: 'CTF 본선', date: '2026-08-15',
//   description: '오프라인 참가', color: EVENT_COLORS[0] },
export const SCHEDULE_EVENTS: ScheduleEvent[] = []

// 예시:
// { id: 't1', date: '2026-08-14', content: '워게임 문제 복습', done: false },
export const TODOS: Todo[] = []

/** 배포 시점에 번들된 NOW 기록. 관리자가 저장하면 GitHub에 커밋되고 재배포되면서 갱신됩니다. */
export const NOW_POSTS: NowPost[] = nowJson as NowPost[]
