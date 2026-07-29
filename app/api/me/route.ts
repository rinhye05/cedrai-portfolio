import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ id: null })
  }
  const id = readToken(request.cookies.get(SESSION_COOKIE)?.value)
  return NextResponse.json({ id })
}
