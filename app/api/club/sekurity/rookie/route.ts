import { mkdir, readdir, stat, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const uploadDir = path.join(process.cwd(), '.private_uploads', 'sekurity-rookie')

function sessionId(request: NextRequest) {
  if (!process.env.ADMIN_SESSION_SECRET) return false
  return readToken(request.cookies.get(SESSION_COOKIE)?.value)
}

export async function GET(request: NextRequest) {
  await mkdir(uploadDir, { recursive: true })
  const names = await readdir(uploadDir)
  const files = await Promise.all(names.map(async (name) => {
    const info = await stat(path.join(uploadDir, name))
    return { name, size: info.size, uploadedAt: info.mtime.toISOString() }
  }))
  return NextResponse.json({ files: files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)) })
}

export async function POST(request: NextRequest) {
  if (sessionId(request) !== process.env.ADMIN_ID) return NextResponse.json({ error: '관리자만 파일을 업로드할 수 있습니다.' }, { status: 403 })
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File) || !file.name) return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 })
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: '파일은 25MB 이하만 업로드할 수 있어요.' }, { status: 413 })

  const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._ -]/g, '_').replace(/\.\./g, '_').trim()
  if (!safeName) return NextResponse.json({ error: '사용할 수 없는 파일명입니다.' }, { status: 400 })
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, safeName), Buffer.from(await file.arrayBuffer()), { flag: 'wx' }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'EEXIST') throw new Error('같은 이름의 파일이 이미 있습니다.')
    throw error
  })
  return NextResponse.json({ ok: true, name: safeName })
}
