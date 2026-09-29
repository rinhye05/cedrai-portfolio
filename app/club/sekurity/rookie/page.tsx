'use client'

import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth-context'

type PrivateFile = { name: string; size: number; uploadedAt: string }

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function RookiePage() {
  const { isAdmin, isMember, ready } = useAuth()
  const canAccess = isAdmin || isMember
  const [files, setFiles] = useState<PrivateFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const loadFiles = async () => {
    const res = await fetch('/api/club/sekurity/rookie')
    if (res.ok) setFiles((await res.json()).files ?? [])
    setLoading(false)
  }

  useEffect(() => { if (ready) loadFiles() }, [ready, canAccess])

  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = event.currentTarget.elements.namedItem('file') as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return setMessage('업로드할 파일을 선택해주세요.')
    setUploading(true); setMessage('')
    const body = new FormData(); body.append('file', file)
    const res = await fetch('/api/club/sekurity/rookie', { method: 'POST', body })
    const data = await res.json().catch(() => ({}))
    setUploading(false)
    if (!res.ok) return setMessage(data.error ?? '업로드에 실패했어요.')
    event.currentTarget.reset(); setMessage('파일을 업로드했어요.'); loadFiles()
  }

  return (
    <main>
      <Nav />
      <section className="private-club-page">
        <div className="private-club-page__head">
          <div className="sec-tag sec-tag-red">seKUrity / 25.03—25.08</div>
          <div className="private-club-page__path">CLUB://SEKURITY/ROOKIE</div>
        </div>
        <h1>Rookie Member Archive<span>.</span></h1>
        <p className="private-club-page__intro">신입부원 시기에 진행했던 활동과 파일을 모아둔 공간입니다.</p>

        {!ready || loading ? <div className="private-files__empty">// 파일 목록을 불러오는 중...</div> : (
          <>
            <div className="private-files__toolbar">
              <div><strong>{files.length}</strong> FILES AVAILABLE</div>
              {isAdmin && <form onSubmit={upload} className="private-files__upload">
                <input name="file" type="file" aria-label="업로드할 파일" />
                <button className="btn-primary" disabled={uploading}>{uploading ? 'UPLOADING...' : 'UPLOAD FILE'}</button>
              </form>}
            </div>
            {message && <div className="private-files__message">{message}</div>}
            {!canAccess && <div className="private-files__notice">파일 목록은 공개되어 있지만, 다운로드하려면 로그인해주세요.</div>}
            <div className="private-files__list">
              {files.length === 0 ? <div className="private-files__empty">// 아직 업로드된 파일이 없습니다.</div> : files.map((file) => (
                canAccess ? (
                  <a key={file.name} className="private-file" href={`/api/club/sekurity/rookie/${encodeURIComponent(file.name)}`}>
                    <span className="private-file__icon">↘</span>
                    <span className="private-file__name">{file.name}</span>
                    <span className="private-file__meta">{formatSize(file.size)} · {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}</span>
                  </a>
                ) : (
                  <div key={file.name} className="private-file private-file--locked">
                    <span className="private-file__icon">⌁</span>
                    <span className="private-file__name">{file.name}</span>
                    <span className="private-file__meta">LOGIN REQUIRED · {formatSize(file.size)}</span>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </main>
  )
}
