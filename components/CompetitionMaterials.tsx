'use client'

import { useEffect, useState } from 'react'
import { upload as uploadBlob } from '@vercel/blob/client'
import { useAuth } from '@/lib/auth-context'
import { safeFileName } from '@/lib/file-name'

type FileItem = { name: string; size: number; uploadedAt: string }

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function CompetitionMaterials({ problem }: { problem: 'directory' | 'xss' }) {
  const { isAdmin, isMember, ready } = useAuth()
  const [files, setFiles] = useState<FileItem[]>([])
  const [storage, setStorage] = useState<'blob' | 'local'>('local')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const load = async () => {
    const res = await fetch(`/api/activities/competitions/ku-ctf/${problem}`)
    if (res.ok) { const data = await res.json(); setFiles(data.files ?? []); setStorage(data.storage ?? 'local') }
  }
  useEffect(() => { load() }, [problem])
  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = event.currentTarget.elements.namedItem('file') as HTMLInputElement
    const selected = Array.from(input.files ?? [])
    if (!selected.length) { setMessage('업로드할 파일을 선택해주세요.'); return }
    setUploading(true); setMessage('')
    let data: { uploaded?: string[]; skipped?: string[]; error?: string } = {}
    if (storage === 'blob') {
      try {
        const uploaded: string[] = []
        for (const file of selected) { const name = safeFileName(file.name); await uploadBlob(`ku-ctf/${problem}/${name}`, file, { access: 'private', handleUploadUrl: '/api/uploads/client' }); uploaded.push(name) }
        data = { uploaded }
      } catch (error) { data = { error: error instanceof Error ? error.message : '업로드에 실패했어요.' } }
    } else {
      const body = new FormData(); selected.forEach((file) => body.append('file', file))
      const res = await fetch(`/api/activities/competitions/ku-ctf/${problem}`, { method: 'POST', body })
      data = await res.json().catch(() => ({}))
      if (!res.ok) data.error ??= '업로드에 실패했어요.'
    }
    setUploading(false)
    if (data.error) { setMessage(data.error); return }
    input.form?.reset()
    setMessage(`${data.uploaded?.length ?? 0}개 파일을 업로드했어요.`)
    load()
  }
  const remove = async (name: string) => {
    if (!window.confirm(`'${name}' 파일을 삭제할까요?`)) return
    const res = await fetch(`/api/activities/competitions/ku-ctf/${problem}/${encodeURIComponent(name)}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    setMessage(res.ok ? `${name} 파일을 삭제했어요.` : (data.error ?? '삭제에 실패했어요.'))
    if (res.ok) load()
  }
  const canDownload = isAdmin || isMember
  return <div className="competition-materials">
    <div className="competition-materials__head"><span>PROBLEM MATERIALS</span><small>ZIP / FILES</small></div>
    {isAdmin && <form onSubmit={upload} className="competition-materials__upload"><input name="file" type="file" multiple aria-label={`${problem} 문제 자료 업로드`} /><button className="btn-secondary" disabled={uploading}>{uploading ? 'UPLOADING...' : 'UPLOAD FILES'}</button></form>}
    {message && <div className="competition-materials__message">{message}</div>}
    {!ready || files.length === 0 ? <div className="competition-materials__empty">// 등록된 문제 자료 없음</div> : <div className="competition-materials__list">{files.map((file) => canDownload ? <div key={file.name} className="competition-material-row"><a href={`/api/activities/competitions/ku-ctf/${problem}/${encodeURIComponent(file.name)}`} className="competition-material">↘ {file.name}<small>{formatSize(file.size)}</small></a>{isAdmin && <button className="file-delete" onClick={() => remove(file.name)} aria-label={`${file.name} 삭제`}>×</button>}</div> : <div key={file.name} className="competition-material competition-material--locked">⌁ {file.name}<small>LOGIN REQUIRED</small></div>)}</div>}
  </div>
}
