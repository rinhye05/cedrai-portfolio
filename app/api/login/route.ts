import { NextResponse } from 'next/server'
import { createToken, safeEqual, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'

export async function POST(request: Request) {
  const { id, password } = await request.json().catch(() => ({ id: '', password: '' }))

  const adminId = process.env.ADMIN_ID
  const adminPw = process.env.ADMIN_PASSWORD
  if (!adminId || !adminPw || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: '서버에 관리자 계정이 설정되지 않았어요.' }, { status: 500 })
  }

  if (typeof id !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: '아이디 또는 비밀번호가 틀렸어요.' }, { status: 401 })
  }

  // 둘 다 검사해서 아이디만 맞을 때와 응답 시간이 달라지지 않게 함
  const ok = safeEqual(id, adminId) && safeEqual(password, adminPw)
  if (!ok) {
    return NextResponse.json({ error: '아이디 또는 비밀번호가 틀렸어요.' }, { status: 401 })
  }

  const res = NextResponse.json({ id })
  res.cookies.set(SESSION_COOKIE, createToken(id), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
