'use client'

import type { Notice as NoticeType } from '@/lib/use-editable'

/** 관리자 저장 결과 안내 배너 */
export default function Notice({ notice }: { notice: NoticeType | null }) {
  if (!notice) return null
  return (
    <div style={{
      fontSize: '12px', marginBottom: '1rem', padding: '8px 12px',
      border: '1px solid var(--bd)', background: 'var(--bg2)',
      color: notice.kind === 'ok' ? 'var(--acc2)' : 'var(--acc4)',
      overflowWrap: 'anywhere',
    }}>
      {notice.text}
      {notice.href && (
        <a href={notice.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)', marginLeft: '8px' }}>커밋 보기 →</a>
      )}
    </div>
  )
}
