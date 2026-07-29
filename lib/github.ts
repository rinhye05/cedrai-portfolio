// 서버 전용 — GitHub Contents API로 data/projects.json 을 읽고 커밋합니다.

const API = 'https://api.github.com'

function config() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO           // 'owner/repo'
  if (!token || !repo) return null
  return {
    token,
    repo,
    branch: process.env.GITHUB_BRANCH || 'main',
    path: process.env.GITHUB_FILE_PATH || 'data/projects.json',
  }
}

export const isGithubConfigured = () => config() !== null

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'cedrai-portfolio',
  }
}

export type FileState = { content: string; sha: string }

/** 파일의 현재 내용과 sha를 가져옵니다. 없으면 sha가 빈 문자열. */
export async function readFile(): Promise<FileState> {
  const c = config()
  if (!c) throw new Error('GitHub 환경변수가 설정되지 않았습니다.')

  const url = `${API}/repos/${c.repo}/contents/${encodeURI(c.path)}?ref=${encodeURIComponent(c.branch)}`
  const res = await fetch(url, { headers: headers(c.token), cache: 'no-store' })

  if (res.status === 404) return { content: '', sha: '' }
  if (!res.ok) throw new Error(`GitHub 읽기 실패 (${res.status}): ${await res.text()}`)

  const data = await res.json()
  return {
    content: Buffer.from(data.content ?? '', 'base64').toString('utf8'),
    sha: data.sha ?? '',
  }
}

/**
 * 파일을 커밋합니다. sha가 현재 파일과 다르면 GitHub이 409를 돌려주므로
 * 다른 곳에서 먼저 수정한 내용을 덮어쓰는 사고를 막아줍니다.
 */
export async function writeFile(content: string, sha: string, message: string) {
  const c = config()
  if (!c) throw new Error('GitHub 환경변수가 설정되지 않았습니다.')

  const url = `${API}/repos/${c.repo}/contents/${encodeURI(c.path)}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(c.token), 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch: c.branch,
      ...(sha ? { sha } : {}),
    }),
  })

  if (res.status === 409 || res.status === 422) {
    throw Object.assign(new Error('파일이 그 사이에 바뀌었어요. 새로고침 후 다시 저장해주세요.'), { status: 409 })
  }
  if (!res.ok) throw new Error(`GitHub 커밋 실패 (${res.status}): ${await res.text()}`)

  const data = await res.json()
  return { sha: data.content?.sha as string, commit: data.commit?.html_url as string }
}
