import { mkdir, readdir, stat, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'
import { blobStorageEnabled, listPrivateFiles, uploadPrivateFile } from '@/lib/blob-storage'
import { safeFileName } from '@/lib/file-name'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const uploadDir = path.join(process.cwd(), '.private_uploads', 'sekurity-rookie')

function sessionId(request: NextRequest) {
  if (!process.env.ADMIN_SESSION_SECRET) return false
  return readToken(request.cookies.get(SESSION_COOKIE)?.value)
}

export async function GET(request: NextRequest) {
  if (blobStorageEnabled()) return NextResponse.json({ files: (await listPrivateFiles('sekurity-rookie/')).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)) })
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
  const files = form.getAll('file').filter((entry): entry is File => entry instanceof File && Boolean(entry.name))
  if (files.length === 0) return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 })
  if (files.some((file) => file.size > 25 * 1024 * 1024)) return NextResponse.json({ error: '파일 하나당 25MB 이하만 업로드할 수 있어요.' }, { status: 413 })
  if (files.reduce((total, file) => total + file.size, 0) > 100 * 1024 * 1024) return NextResponse.json({ error: '한 번에 최대 100MB까지 업로드할 수 있어요.' }, { status: 413 })
  if (blobStorageEnabled()) {
    const prefix = 'sekurity-rookie/'
    const existing = new Set((await listPrivateFiles(prefix)).map((item) => item.name))
    const uploaded: string[] = []
    const skipped: string[] = []
    for (const file of files) {
      const name = safeFileName(file.name)
      if (!name || existing.has(name)) { skipped.push(name || file.name); continue }
      try { await uploadPrivateFile(`${prefix}${name}`, file); uploaded.push(name) }
      catch { return NextResponse.json({ error: `${name} 업로드 중 서버 오류가 발생했어요.` }, { status: 500 }) }
    }
    return NextResponse.json({ ok: uploaded.length > 0, uploaded, skipped })
  }
  await mkdir(uploadDir, { recursive: true })
  const uploaded: string[] = []
  const skipped: string[] = []
  for (const file of files) {
    const safeName = safeFileName(file.name)
    if (!safeName) {
      skipped.push(file.name)
      continue
    }
    try {
      await writeFile(path.join(uploadDir, safeName), Buffer.from(await file.arrayBuffer()), { flag: 'wx' })
      uploaded.push(safeName)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') skipped.push(safeName)
      else return NextResponse.json({ error: `${safeName} 업로드 중 서버 오류가 발생했어요.` }, { status: 500 })
    }
  }
  return NextResponse.json({ ok: uploaded.length > 0, uploaded, skipped })
}
