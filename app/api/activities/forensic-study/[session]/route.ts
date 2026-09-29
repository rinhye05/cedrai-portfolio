import { mkdir, readdir, stat, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const baseDir = path.join(process.cwd(), '.private_uploads', 'forensic-study')

function sessionId(request: NextRequest) {
  if (!process.env.ADMIN_SESSION_SECRET) return null
  return readToken(request.cookies.get(SESSION_COOKIE)?.value)
}
function validSession(session: string) { return /^session-(0[1-9]|10)$/.test(session) }
function validKind(kind: string): kind is 'reports' | 'practice' { return kind === 'reports' || kind === 'practice' }
function dirFor(session: string, kind: 'reports' | 'practice') { return path.join(baseDir, session, kind) }

export async function GET(_request: NextRequest, context: { params: Promise<{ session: string }> }) {
  const { session } = await context.params
  if (!validSession(session)) return NextResponse.json({ error: '차시를 찾을 수 없습니다.' }, { status: 404 })
  const result: Record<string, unknown[]> = { reports: [], practice: [] }
  for (const kind of ['reports', 'practice'] as const) {
    const dir = dirFor(session, kind)
    await mkdir(dir, { recursive: true })
    const names = await readdir(dir)
    result[kind] = await Promise.all(names.map(async (name) => {
      const info = await stat(path.join(dir, name))
      return { name, size: info.size, uploadedAt: info.mtime.toISOString() }
    }))
  }
  return NextResponse.json(result)
}

export async function POST(request: NextRequest, context: { params: Promise<{ session: string }> }) {
  const { session } = await context.params
  if (!validSession(session)) return NextResponse.json({ error: '차시를 찾을 수 없습니다.' }, { status: 404 })
  if (sessionId(request) !== process.env.ADMIN_ID) return NextResponse.json({ error: '관리자만 파일을 업로드할 수 있습니다.' }, { status: 403 })
  const form = await request.formData()
  const file = form.get('file')
  const kind = String(form.get('kind') ?? '')
  if (!validKind(kind)) return NextResponse.json({ error: '자료 종류가 올바르지 않습니다.' }, { status: 400 })
  if (!(file instanceof File) || !file.name) return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 })
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: '파일은 25MB 이하만 업로드할 수 있어요.' }, { status: 413 })
  const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._ -]/g, '_').replace(/\.\./g, '_').trim()
  if (!safeName) return NextResponse.json({ error: '사용할 수 없는 파일명입니다.' }, { status: 400 })
  const dir = dirFor(session, kind)
  await mkdir(dir, { recursive: true })
  try {
    await writeFile(path.join(dir, safeName), Buffer.from(await file.arrayBuffer()), { flag: 'wx' })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') return NextResponse.json({ error: '같은 이름의 파일이 이미 있습니다.' }, { status: 409 })
    throw error
  }
  return NextResponse.json({ ok: true, name: safeName })
}
