import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BLOG = (process.env.BLOG_URL || 'https://rinhye05.tistory.com').replace(/\/$/, '')
// 티스토리를 매 방문마다 긁지 않도록 짧게 캐시합니다. 0이면 항상 새로 가져옵니다.
const REVALIDATE = Number(process.env.BLOG_REVALIDATE ?? 60)
// 대분류마다 가져올 최신 글 수 (목록 1페이지 = 10개)
const PER_CATEGORY = 10

export type BlogPost = {
  id: string
  title: string
  href: string
  date: string      // 'YYYY.MM'
  locked: boolean   // 보호글 여부
}

export type BlogCategory = {
  name: string
  path: string
  count: number
  posts: BlogPost[]
}

const fetchOpts = REVALIDATE > 0
  ? { next: { revalidate: REVALIDATE } as const }
  : { cache: 'no-store' as const }

async function getHtml(path: string) {
  const res = await fetch(`${BLOG}${path}`, {
    ...fetchOpts,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; cedrai-portfolio/1.0)' },
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.text()
}

function decode(s: string) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .trim()
}

function toYearMonth(raw: string) {
  const d = new Date(raw.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** 사이드바에서 대분류 목록을 읽습니다. 티스토리에서 카테고리를 바꾸면 여기 바로 반영됩니다. */
function parseCategoryTree(html: string) {
  const found = new Map<string, { name: string; path: string; count: number }>()

  const re = /href="(\/category\/[^"?#]*)"[^>]*>([\s\S]{0,300}?)<\/a>/g
  for (const m of html.matchAll(re)) {
    const path = decodeURIComponent(m[1])
    // 대분류만: /category/X 형태 (하위 분류는 /category/X/Y)
    const rest = path.slice('/category/'.length)
    if (!rest || rest.includes('/')) continue

    const text = decode(m[2])
    const hit = text.match(/^(.*?)\s*\((\d+)\)\s*$/)
    if (!hit) continue

    const name = hit[1].trim()
    const count = Number(hit[2])
    if (!name || found.has(path)) continue
    found.set(path, { name, path, count })
  }

  return [...found.values()]
}

/** 목록 페이지에서 글을 읽습니다. 보호글도 제목까지는 노출되므로 같이 잡힙니다. */
function parsePosts(html: string): BlogPost[] {
  const anchors = [...html.matchAll(/href="\/(\d+)"/g)]
  const posts: BlogPost[] = []
  const seen = new Set<string>()

  for (let i = 0; i < anchors.length; i++) {
    const id = anchors[i][1]
    const start = anchors[i].index ?? 0
    const end = anchors[i + 1]?.index ?? html.length
    const block = html.slice(start, end)

    const title = block.match(/data-title="article-title"[^>]*>([\s\S]*?)<\/div>/)
    if (!title || seen.has(id)) continue

    const name = decode(title[1])
    if (!name) continue
    seen.add(id)

    const dt = block.match(/thisDatetime\s*=\s*["']([^"']+)/)
    posts.push({
      id,
      title: name,
      href: `${BLOG}/${id}`,
      date: dt ? toYearMonth(dt[1]) : '',
      locked: block.includes('lock-keyhole') || block.includes('보호글'),
    })
  }

  return posts
}

/** 목록 스크레이핑이 실패했을 때를 위한 예비 경로. 보호글은 RSS에 안 나옵니다. */
async function fromRss(): Promise<BlogCategory[]> {
  const xml = await getHtml('/rss')
  const groups = new Map<string, BlogPost[]>()

  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1]
    const pick = (tag: string) =>
      block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`))?.[1]
      ?? block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]
      ?? ''

    const title = decode(pick('title'))
    const link = pick('link').trim() || pick('guid').trim()
    // 첫 번째 <category>가 분류 경로, 나머지는 태그
    const category = decode(pick('category'))
    if (!title || !link || !category) continue

    const top = category.split('/')[0].trim()
    const id = link.match(/\/(\d+)$/)?.[1] ?? link

    const list = groups.get(top) ?? []
    list.push({ id, title, href: link, date: toYearMonth(pick('pubDate')), locked: false })
    groups.set(top, list)
  }

  return [...groups.entries()].map(([name, posts]) => ({
    name, path: `/category/${name}`, count: posts.length, posts,
  }))
}

export async function GET() {
  let categories: BlogCategory[] = []
  let source = 'category'

  try {
    const tree = parseCategoryTree(await getHtml('/category'))
    if (!tree.length) throw new Error('카테고리를 찾지 못했습니다.')

    const results = await Promise.all(
      tree
        .filter((c) => c.count > 0)
        .map(async (c) => {
          try {
            const html = await getHtml(`/category/${encodeURIComponent(c.name)}`)
            return { ...c, posts: parsePosts(html).slice(0, PER_CATEGORY) }
          } catch {
            return { ...c, posts: [] as BlogPost[] }
          }
        })
    )

    categories = results.filter((c) => c.posts.length > 0)
    if (!categories.length) throw new Error('글을 찾지 못했습니다.')
  } catch {
    try {
      categories = await fromRss()
      source = 'rss'
    } catch {
      categories = []
      source = 'none'
    }
  }

  return NextResponse.json(
    { source, categories },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
