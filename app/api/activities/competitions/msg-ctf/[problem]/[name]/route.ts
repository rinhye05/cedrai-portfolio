import { readFile, unlink } from 'fs/promises'
import path from 'path'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'
import { blobStorageEnabled, deletePrivateFile, getPrivateFile } from '@/lib/blob-storage'
import { safeFileName } from '@/lib/file-name'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const baseDir = path.join(process.cwd(), '.private_uploads', 'msg-ctf')
const validProblem = (value: string) => value === 'pokemon-web-challenge'
const isLoggedIn = (request: NextRequest) => Boolean(process.env.ADMIN_SESSION_SECRET && readToken(request.cookies.get(SESSION_COOKIE)?.value))
const isAdmin = (request: NextRequest) => Boolean(process.env.ADMIN_SESSION_SECRET && readToken(request.cookies.get(SESSION_COOKIE)?.value) === process.env.ADMIN_ID)

export async function GET(request: NextRequest, context: { params: Promise<{ problem: string; name: string }> }) {
  if (!isLoggedIn(request)) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  const { problem, name } = await context.params; if (!validProblem(problem)) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  const safe = safeFileName(decodeURIComponent(name)); if (!safe) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  try {
    if (blobStorageEnabled()) { const result = await getPrivateFile(`msg-ctf/${problem}/${safe}`); if (!result || result.statusCode !== 200) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 }); return new NextResponse(result.stream, { headers: { 'Content-Type': result.blob.contentType || 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`, 'Cache-Control': 'private, no-store' } }) }
    const data = await readFile(path.join(baseDir, problem, safe)); return new NextResponse(data, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`, 'Cache-Control': 'private, no-store' } })
  } catch { return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 }) }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ problem: string; name: string }> }) {
  if (!isAdmin(request)) return NextResponse.json({ error: '관리자만 파일을 삭제할 수 있습니다.' }, { status: 403 })
  const { problem, name } = await context.params; if (!validProblem(problem)) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  const safe = safeFileName(decodeURIComponent(name)); if (!safe) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  try { if (blobStorageEnabled()) await deletePrivateFile(`msg-ctf/${problem}/${safe}`); else await unlink(path.join(baseDir, problem, safe)); return NextResponse.json({ ok: true }) } catch { return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 }) }
}
