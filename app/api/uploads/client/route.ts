import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'

export const runtime = 'nodejs'

function allowedPath(pathname: string) {
  return /^(?:ku-ctf\/(?:directory|xss)|sekurity-rookie|forensic-study\/session-(?:0[1-9]|10)\/(?:reports|practice))\/[^/\\]+$/.test(pathname)
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const id = readToken(request.cookies.get(SESSION_COOKIE)?.value)
        if (!process.env.ADMIN_ID || id !== process.env.ADMIN_ID) throw new Error('관리자만 파일을 업로드할 수 있습니다.')
        if (!allowedPath(pathname) || pathname.includes('..')) throw new Error('업로드 경로가 올바르지 않습니다.')
        // 파일 형식은 제한하지 않고, 관리자 인증과 허용된 경로만 검사합니다.
        return { addRandomSuffix: false, tokenPayload: JSON.stringify({ adminId: id }) }
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 })
  }
}
