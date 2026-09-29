import { NextResponse, type NextRequest } from 'next/server'
import { readToken, SESSION_COOKIE } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ id: null })
  }
  const id = readToken(request.cookies.get(SESSION_COOKIE)?.value)
  const role = id && id === process.env.CLUB_ID ? 'club-member' : id ? 'admin' : null
  return NextResponse.json({ id, role })
}
