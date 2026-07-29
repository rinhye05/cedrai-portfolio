import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'
import { isGithubConfigured, readFile, writeFile } from '@/lib/github'
import { PROJECTS, type Project } from '@/lib/data'

export const dynamic = 'force-dynamic'

function requireAdmin(request: NextRequest) {
  if (!process.env.ADMIN_SESSION_SECRET) return null
  return readToken(request.cookies.get(SESSION_COOKIE)?.value)
}

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback)

/** 레포에 커밋되는 내용이므로 모양을 강제로 맞춰서 저장합니다. */
function sanitize(input: unknown): Project[] {
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

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })
  }
  if (!isGithubConfigured()) {
    return NextResponse.json({ error: 'GITHUB_TOKEN / GITHUB_REPO 환경변수가 설정되지 않았어요.' }, { status: 503 })
  }

  try {
    const { content, sha } = await readFile()
    // 레포에 파일이 아직 없으면 번들된 목록을 보여줍니다. 그래야 첫 저장 때
    // 기존 프로젝트가 빈 배열로 덮어써지지 않아요.
    const projects = content ? JSON.parse(content) : PROJECTS
    return NextResponse.json({ projects, sha })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 })
  }
}

export async function PUT(request: NextRequest) {
  const adminId = requireAdmin(request)
  if (!adminId) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })
  }
  if (!isGithubConfigured()) {
    return NextResponse.json({ error: 'GITHUB_TOKEN / GITHUB_REPO 환경변수가 설정되지 않았어요.' }, { status: 503 })
  }

  let projects: Project[]
  let sha: string
  try {
    const body = await request.json()
    projects = sanitize(body?.projects)
    sha = str(body?.sha)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }

  try {
    const json = JSON.stringify(projects, null, 2) + '\n'
    const result = await writeFile(json, sha, `chore: update projects (by ${adminId})`)
    return NextResponse.json({ projects, sha: result.sha, commit: result.commit })
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502
    return NextResponse.json({ error: (e as Error).message }, { status })
  }
}
