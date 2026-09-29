import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getTistoryPost } from '@/lib/tistory'
import { getNotionPost } from '@/lib/notion'

const COMPETITIONS: Record<string, { title: string; year: string; status: string; intro: string; writeups?: { category: string; title: string; href: string; notionId?: string }[] }> = {
  'msg-ctf': {
    title: 'MSG CTF', year: '2025', status: 'STAFF / PROBLEM SETTER',
    intro: '문제를 직접 출제하는 운영진으로 참여했습니다.',
  },
  'ku-ctf': {
    title: 'KU CTF', year: '2025', status: 'PARTICIPANT',
    intro: '2025 KU CTF 참여 기록을 정리하는 공간입니다.',
  },
  hacktheon: {
    title: '핵테온', year: '2026', status: 'PARTICIPANT',
    intro: '2026 핵테온 참여 기록을 정리하는 공간입니다.',
  },
  'chungcheong-cyber': {
    title: '충청권 사이버보안 경진대회', year: '2026', status: '',
    intro: '대회 관련 기록을 정리하는 공간입니다.',
  },
  'club-union-ctf': {
    title: 'K.knock · D-Alpha · CAUtion 동아리 연합 CTF', year: '', status: '',
    intro: '동아리 연합 CTF 참여 기록을 정리하는 공간입니다.',
    writeups: [
      { category: 'AI', title: '환불해드립니다', href: 'https://shining-radium-c31.notion.site/3ea5f675ec7b80c5a172e741b9b519e2?source=copy_link', notionId: '3ea5f675-ec7b-80c5-a172-e741b9b519e2' },
      { category: 'CRYPTO', title: 'Déjà Vu', href: 'https://shining-radium-c31.notion.site/De-ja-Vu-3ea5f675ec7b800296a3ccb5c50767e3?source=copy_link', notionId: '3ea5f675-ec7b-8002-96a3-ccb5c50767e3' },
    ],
  },
}

export default async function CompetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const competition = COMPETITIONS[slug]
  if (!competition) return <main><Nav /><section className="study-page"><h1>Activity not found<span>.</span></h1></section><Footer /></main>
  const tistoryPosts = slug === 'hacktheon' ? [await getTistoryPost('19')].filter((post): post is NonNullable<typeof post> => Boolean(post)) : []
  const notionPosts = slug === 'club-union-ctf' && competition.writeups ? await Promise.all(competition.writeups.map((writeup) => writeup.notionId ? getNotionPost(writeup.notionId) : null)) : []

  return (
    <main>
      <Nav />
      <section className="study-page competition-page">
        <div className="study-page__head"><div className="sec-tag">COMPETITION{competition.year ? ` / ${competition.year}` : ''}</div><div className="study-page__path">ACTIVITY://{slug.toUpperCase()}</div></div>
        <h1>{competition.title}<span>.</span></h1>
        {competition.status && <div className="competition-page__status">{competition.status}</div>}
        <p className="study-page__intro">{competition.intro}</p>
        {slug === 'msg-ctf' && (
          <div className="competition-details">
            <div><span>TEAM</span><strong>2명 공동 제작</strong></div>
            <div><span>CATEGORY</span><strong>웹 해킹</strong></div>
            <div><span>THEME</span><strong>Pokémon</strong></div>
          </div>
        )}
        {competition.writeups && <div className="writeup-grid competition-writeups">
          {competition.writeups.map((writeup, index) => <details key={writeup.title} className="competition-writeup">
            <summary><i>{String(index + 1).padStart(2, '0')}</i><strong>{writeup.title}</strong><span>{writeup.category}</span><b>＋</b></summary>
            <div className="competition-writeup__body">
              {notionPosts[index] ? <div className="notion-post__content" dangerouslySetInnerHTML={{ __html: notionPosts[index]!.contentHtml }} /> : <a href={writeup.href} target="_blank" rel="noopener noreferrer">원문 열기 ↗</a>}
            </div>
          </details>)}
        </div>}
        {tistoryPosts.length > 0 && (
          <div className="writeup-grid">
            {tistoryPosts.map((post, index) => (
              <details key={post.href} className="competition-writeup">
                <summary><i>{String(index + 1).padStart(2, '0')}</i><strong>{post.title.replace(/^\[2026 헥테온\]\s*/, '')}</strong><span>WEB HACKING</span><b>＋</b></summary>
                <div className="competition-writeup__body">
                  <article className="tistory-post">
                    <div className="tistory-post__source"><span>WRITE-UP FROM TISTORY</span><a href={post.href} target="_blank" rel="noopener noreferrer">원문 보기 ↗</a></div>
                    <div className="tistory-post__content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                  </article>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
