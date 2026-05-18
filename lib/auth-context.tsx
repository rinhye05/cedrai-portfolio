'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const ADMIN_ID = 'eed9606a-b42c-4197-8d58-7a6592ae91d8'

type AuthCtx = {
  user: User | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<string>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx>({
  user: null, isAdmin: false,
  login: async () => '', logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: l } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => l.subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return '이메일 또는 비밀번호가 틀렸어요.'
    return ''
  }

  const logout = async () => { await supabase.auth.signOut() }

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.id === ADMIN_ID, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)