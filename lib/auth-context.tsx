'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type AuthCtx = {
  /** 로그인한 관리자 아이디. 비로그인이면 null */
  adminId: string | null
  isAdmin: boolean
  ready: boolean
  login: (id: string, password: string) => Promise<string>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx>({
  adminId: null, isAdmin: false, ready: false,
  login: async () => '', logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [adminId, setAdminId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then((d: { id: string | null }) => setAdminId(d.id ?? null))
      .catch(() => setAdminId(null))
      .finally(() => setReady(true))
  }, [])

  const login = async (id: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return data.error ?? '로그인에 실패했어요.'
      setAdminId(data.id)
      return ''
    } catch {
      return '서버에 연결할 수 없어요.'
    }
  }

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {})
    setAdminId(null)
  }

  return (
    <AuthContext.Provider value={{ adminId, isAdmin: adminId !== null, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
