const NOTION_API = 'https://www.notion.so/api/v3/loadCachedPageChunk'

type Block = { id: string; type: string; properties?: Record<string, unknown>; content?: string[]; file_ids?: string[]; format?: { display_source?: string } }
export type NotionPost = { title: string; contentHtml: string }

function textValue(value: unknown) {
  if (!Array.isArray(value)) return ''
  return value.flat(Infinity).filter((part): part is string => typeof part === 'string').join('')
}
function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
function prop(block: Block) { return textValue(block.properties?.title) || textValue(block.properties?.text) }

export async function getNotionPost(id: string): Promise<NotionPost | null> {
  try {
    const pageId = id.replace(/-/g, '')
    const res = await fetch(NOTION_API, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; cedrai-portfolio/1.0)' },
      body: JSON.stringify({ pageId: `${pageId.slice(0, 8)}-${pageId.slice(8, 12)}-${pageId.slice(12, 16)}-${pageId.slice(16, 20)}-${pageId.slice(20)}`, limit: 100, cursor: { stack: [] }, chunkNumber: 0, verticalColumns: false }),
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const data = await res.json()
    const entries = Object.values(data.recordMap?.block ?? {}) as { value?: { value?: Block } }[]
    const blocks = entries.map((entry) => entry.value?.value).filter((block): block is Block => Boolean(block))
    const root = blocks.find((block) => block.type === 'page')
    if (!root) return null
    const byId = new Map(blocks.map((block) => [block.id, block]))
    const ordered = (root.content ?? []).map((blockId) => byId.get(blockId)).filter((block): block is Block => Boolean(block))
    const html = ordered.map((block) => {
      const text = prop(block)
      if (block.type === 'code') return `<pre><code>${escapeHtml(text)}</code></pre>`
      if (block.type === 'sub_header' || block.type === 'sub_sub_header' || block.type === 'header') return `<h3>${escapeHtml(text)}</h3>`
      if (block.type === 'bulleted_list') return `<ul><li>${escapeHtml(text)}</li></ul>`
      if (block.type === 'numbered_list') return `<ol><li>${escapeHtml(text)}</li></ol>`
      if (block.type === 'divider') return '<hr />'
      if (block.type === 'image' && block.file_ids?.[0]) {
        const fileId = block.file_ids[0]
        const src = `https://www.notion.so/image/attachment%3A${fileId}%3Aimage.png?table=block&id=${block.id}&cache=v2`
        return `<img src="${src}" alt="${escapeHtml(text || '라업 이미지')}" />`
      }
      return text ? `<p>${escapeHtml(text).replace(/\n/g, '<br />')}</p>` : ''
    }).join('')
    return { title: prop(root), contentHtml: html }
  } catch {
    return null
  }
}
