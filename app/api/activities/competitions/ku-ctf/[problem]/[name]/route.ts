import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'
import { blobStorageEnabled, getPrivateFile } from '@/lib/blob-storage'
import { safeFileName } from '@/lib/file-name'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const baseDir = path.join(process.cwd(), '.private_uploads', 'ku-ctf')

export async function GET(request: NextRequest, context: { params: Promise<{ problem: string; name: string }> }) {
  if (!process.env.ADMIN_SESSION_SECRET || !readToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  const { problem, name } = await context.params
  if (problem !== 'directory' && problem !== 'xss') return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  const safe = safeFileName(decodeURIComponent(name))
  if (!safe) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  if (blobStorageEnabled()) {
    const result = await getPrivateFile(`ku-ctf/${problem}/${safe}`)
    if (!result || result.statusCode !== 200) return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
    return new NextResponse(result.stream, { headers: { 'Content-Type': result.blob.contentType || 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`, 'Cache-Control': 'private, no-store' } })
  }
  try {
    const data = await readFile(path.join(baseDir, problem, safe))
    return new NextResponse(data, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`, 'Cache-Control': 'private, no-store' } })
  } catch {
    return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
  }
}
