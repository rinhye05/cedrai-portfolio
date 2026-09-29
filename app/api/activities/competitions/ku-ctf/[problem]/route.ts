import { mkdir, readdir, stat, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const baseDir = path.join(process.cwd(), '.private_uploads', 'ku-ctf')
const validProblem = (value: string) => value === 'directory' || value === 'xss'
const safeName = (value: string) => value.replace(/[^a-zA-Z0-9가-힣._ -]/g, '_').replace(/\.\./g, '_').trim()
const isAdmin = (request: NextRequest) => Boolean(process.env.ADMIN_SESSION_SECRET && readToken(request.cookies.get(SESSION_COOKIE)?.value) === process.env.ADMIN_ID)

export async function GET(_request: NextRequest, context: { params: Promise<{ problem: string }> }) {
  const { problem } = await context.params
  if (!validProblem(problem)) return NextResponse.json({ error: '문제를 찾을 수 없습니다.' }, { status: 404 })
  const dir = path.join(baseDir, problem)
  await mkdir(dir, { recursive: true })
  const names = await readdir(dir)
  const files = await Promise.all(names.map(async (name) => {
    const info = await stat(path.join(dir, name))
    return { name, size: info.size, uploadedAt: info.mtime.toISOString() }
  }))
  return NextResponse.json({ files: files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)) })
}

export async function POST(request: NextRequest, context: { params: Promise<{ problem: string }> }) {
  const { problem } = await context.params
  if (!validProblem(problem)) return NextResponse.json({ error: '문제를 찾을 수 없습니다.' }, { status: 404 })
  if (!isAdmin(request)) return NextResponse.json({ error: '관리자만 문제 자료를 업로드할 수 있습니다.' }, { status: 403 })
  const form = await request.formData()
  const files = form.getAll('file').filter((entry): entry is File => entry instanceof File && Boolean(entry.name))
  if (files.length === 0) return NextResponse.json({ error: '업로드할 파일을 선택해주세요.' }, { status: 400 })
  if (files.some((file) => file.size > 50 * 1024 * 1024)) return NextResponse.json({ error: '파일 하나당 50MB 이하만 업로드할 수 있어요.' }, { status: 413 })
  if (files.reduce((total, file) => total + file.size, 0) > 150 * 1024 * 1024) return NextResponse.json({ error: '한 번에 최대 150MB까지 업로드할 수 있어요.' }, { status: 413 })
  const dir = path.join(baseDir, problem)
  await mkdir(dir, { recursive: true })
  const uploaded: string[] = []
  const skipped: string[] = []
  for (const file of files) {
    const name = safeName(file.name)
    if (!name) { skipped.push(file.name); continue }
    try {
      await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()), { flag: 'wx' })
      uploaded.push(name)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') skipped.push(name)
      else return NextResponse.json({ error: `${name} 업로드 중 서버 오류가 발생했어요.` }, { status: 500 })
    }
  }
  return NextResponse.json({ ok: uploaded.length > 0, uploaded, skipped })
}
