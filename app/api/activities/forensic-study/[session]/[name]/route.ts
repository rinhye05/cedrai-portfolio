import { readFile, unlink } from 'fs/promises'
import path from 'path'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'
import { blobStorageEnabled, deletePrivateFile, getPrivateFile } from '@/lib/blob-storage'
import { safeFileName } from '@/lib/file-name'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const baseDir = path.join(process.cwd(), '.private_uploads', 'forensic-study')

export async function GET(request: NextRequest, context: { params: Promise<{ session: string; name: string }> }) {
  if (!process.env.ADMIN_SESSION_SECRET || !readToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  const { session, name } = await context.params
  const kind = new URL(request.url).searchParams.get('kind')
  if (!/^session-(0[1-9]|10)$/.test(session) || (kind !== 'reports' && kind !== 'practice')) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  const safeName = safeFileName(decodeURIComponent(name))
  if (blobStorageEnabled()) {
    const result = await getPrivateFile(`forensic-study/${session}/${kind}/${safeName}`)
    if (!result || result.statusCode !== 200) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
    return new NextResponse(result.stream, { headers: { 'Content-Type': result.blob.contentType || 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(safeName)}`, 'Cache-Control': 'private, no-store' } })
  }
  try {
    const data = await readFile(path.join(baseDir, session, kind, safeName))
    return new NextResponse(data, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(safeName)}`, 'Cache-Control': 'private, no-store' } })
  } catch {
    return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ session: string; name: string }> }) {
  if (!process.env.ADMIN_SESSION_SECRET || readToken(request.cookies.get(SESSION_COOKIE)?.value) !== process.env.ADMIN_ID) return NextResponse.json({ error: '관리자만 파일을 삭제할 수 있습니다.' }, { status: 403 })
  const { session, name } = await context.params
  const kind = new URL(request.url).searchParams.get('kind')
  if (!/^session-(0[1-9]|10)$/.test(session) || (kind !== 'reports' && kind !== 'practice')) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  const safeName = safeFileName(decodeURIComponent(name))
  try {
    if (blobStorageEnabled()) await deletePrivateFile(`forensic-study/${session}/${kind}/${safeName}`)
    else await unlink(path.join(baseDir, session, kind, safeName))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  }
}
