'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

type FileItem = { name: string; size: number; uploadedAt: string }

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function CompetitionMaterials({ problem }: { problem: 'directory' | 'xss' }) {
  const { isAdmin, isMember, ready } = useAuth()
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const load = async () => {
    const res = await fetch(`/api/activities/competitions/ku-ctf/${problem}`)
    if (res.ok) setFiles((await res.json()).files ?? [])
  }
  useEffect(() => { load() }, [problem])
  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = event.currentTarget.elements.namedItem('file') as HTMLInputElement
    const selected = Array.from(input.files ?? [])
    if (!selected.length) { setMessage('업로드할 파일을 선택해주세요.'); return }
    setUploading(true); setMessage('')
    const body = new FormData(); selected.forEach((file) => body.append('file', file))
    const res = await fetch(`/api/activities/competitions/ku-ctf/${problem}`, { method: 'POST', body })
    const data = await res.json().catch(() => ({}))
    setUploading(false)
    if (!res.ok) { setMessage(data.error ?? '업로드에 실패했어요.'); return }
    input.form?.reset()
    setMessage(`${data.uploaded?.length ?? 0}개 파일을 업로드했어요.`)
    load()
  }
  const canDownload = isAdmin || isMember
  return <div className="competition-materials">
    <div className="competition-materials__head"><span>PROBLEM MATERIALS</span><small>ZIP / FILES</small></div>
    {isAdmin && <form onSubmit={upload} className="competition-materials__upload"><input name="file" type="file" multiple aria-label={`${problem} 문제 자료 업로드`} /><button className="btn-secondary" disabled={uploading}>{uploading ? 'UPLOADING...' : 'UPLOAD FILES'}</button></form>}
    {message && <div className="competition-materials__message">{message}</div>}
    {!ready || files.length === 0 ? <div className="competition-materials__empty">// 등록된 문제 자료 없음</div> : <div className="competition-materials__list">{files.map((file) => canDownload ? <a key={file.name} href={`/api/activities/competitions/ku-ctf/${problem}/${encodeURIComponent(file.name)}`} className="competition-material">↘ {file.name}<small>{formatSize(file.size)}</small></a> : <div key={file.name} className="competition-material competition-material--locked">⌁ {file.name}<small>LOGIN REQUIRED</small></div>)}</div>}
  </div>
}
