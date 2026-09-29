const BLOG_URL = 'https://rinhye05.tistory.com'

export type TistoryPost = { title: string; date: string; contentHtml: string; href: string }

function stripUnsafe(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
  }

export async function getTistoryPost(id: string): Promise<TistoryPost | null> {
  try {
    const res = await fetch(`${BLOG_URL}/${id}`, { next: { revalidate: 300 }, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; cedrai-portfolio/1.0)' } })
    if (!res.ok) return null
    const html = await res.text()
    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i)?.[1] ?? `[Tistory post ${id}]`
    const date = html.match(/<meta[^>]+property="article:published_time"[^>]+content="([^"]*)"/i)?.[1] ?? ''
    const start = html.indexOf('id="article-description"')
    const contentStart = start >= 0 ? html.indexOf('>', start) + 1 : -1
    const end = contentStart >= 0 ? html.lastIndexOf('<!-- System - START -->') : -1
    if (contentStart < 1 || end < 0) return null
    return { title, date, contentHtml: stripUnsafe(html.slice(contentStart, end)), href: `${BLOG_URL}/${id}` }
  } catch {
    return null
  }
}
