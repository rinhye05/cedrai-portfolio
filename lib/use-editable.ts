'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import type { ContentKind } from '@/lib/content'

export type Notice = { kind: 'ok' | 'err'; text: string; href?: string }

/**
 * 관리자 편집이 가능한 목록을 다룹니다.
 * 평소에는 배포에 번들된 initial을 그대로 보여주고, 로그인하면 GitHub의
 * 최신 내용으로 교체합니다(재배포 전에 저장한 내용까지 반영되도록).
 */
export function useEditable<T>(kind: ContentKind, initial: T) {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState<T>(initial)
  const [sha, setSha] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const url = `/api/content/${kind}`

  const load = useCallback(async () => {
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) { setNotice({ kind: 'err', text: data.error ?? '불러오기 실패' }); return }
      setItems(data.items as T)
      setSha(data.sha)
    } catch {
      setNotice({ kind: 'err', text: '서버에 연결할 수 없어요.' })
    }
  }, [url])

  useEffect(() => {
    load()
  }, [load])

  const commit = useCallback(async (next: T) => {
    if (!isAdmin) {
      setNotice({ kind: 'err', text: '로그인이 필요해요.' })
      return false
    }

    setSaving(true)
    setNotice(null)
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: next, sha }),
      })
      const data = await res.json()
      if (!res.ok) { setNotice({ kind: 'err', text: data.error ?? '저장 실패' }); return false }
      setItems(data.items as T)
      setSha(data.sha)
      setNotice({ kind: 'ok', text: 'GitHub에 커밋했어요. 재배포되면 사이트에 반영됩니다.', href: data.commit })
      return true
    } catch {
      setNotice({ kind: 'err', text: '서버에 연결할 수 없어요.' })
      return false
    } finally {
      setSaving(false)
    }
  }, [isAdmin, url, sha])

  return { isAdmin, items, saving, notice, setNotice, commit }
}
