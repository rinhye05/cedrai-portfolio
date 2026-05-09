import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://rinhye05.tistory.com/rss', {
      cache: 'no-store',
    })
    const xml = await res.text()

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    const posts = items.map((m) => {
      const block = m[1]

      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        ?? block.match(/<title>(.*?)<\/title>/)?.[1] ?? ''

      const link = block.match(/<link>(.*?)<\/link>/)?.[1]
        ?? block.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1] ?? '#'

      const date = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? ''

      const category = block.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/)?.[1]
        ?? block.match(/<category>(.*?)<\/category>/)?.[1] ?? ''

      const d = new Date(date)
      const formatted = isNaN(d.getTime())
        ? ''
        : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`

      return {
        title: title.trim(),
        href: link.trim(),
        date: formatted,
        category: category.trim(),
      }
    }).filter((p) => p.title && p.href !== '#')

    return NextResponse.json(posts)
  } catch {
    return NextResponse.json([])
  }
}