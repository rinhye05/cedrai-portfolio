# Cédrai Portfolio

HUD 사이버펑크 스타일 개인 포트폴리오 — Next.js 15 + Tailwind CSS

## 빠른 시작

```bash
# 1. 새 Next.js 프로젝트 생성
npx create-next-app@latest cedrai-portfolio \
  --typescript --tailwind --app --src-dir=false \
  --import-alias="@/*"

cd cedrai-portfolio

# 2. 이 레포의 파일들로 덮어쓰기
#    app/ components/ 폴더를 복사해서 붙여넣기

# 3. 구글 폰트 (JetBrains Mono) — layout.tsx에 이미 설정됨

# 4. 개발 서버 실행
npm run dev
```

## Vercel 배포 (C 단계)

```bash
# Vercel CLI 설치
npm i -g vercel

# GitHub에 push 후 vercel.com에서 import
# 또는 CLI로 바로 배포
vercel
```

## 파일 구조

```
cedrai-portfolio/
├── app/
│   ├── globals.css   ← HUD 디자인 시스템 (CSS 변수, 글리치, 코너 브라켓)
│   ├── layout.tsx    ← JetBrains Mono 폰트, 메타데이터
│   └── page.tsx      ← 컴포넌트 조합
└── components/
    ├── Nav.tsx        ← 상단 네비게이션 (sticky)
    ├── Hero.tsx       ← 글리치 이름 + 타이핑 + 스캐너
    ├── Skills.tsx     ← 기술 스택 + 스킬 바
    ← Projects.tsx     ← 클립 카드 프로젝트
    ├── Blog.tsx       ← writeup 포스트 목록
    ├── Contact.tsx    ← GitHub / Blog / Email
    └── Footer.tsx     ← 하단 푸터
```

## 커스터마이징

### 색상 변경
`app/globals.css` 상단 `:root` 블록에서 수정:
```css
:root {
  --acc:  #00e5ff;  /* 메인 사이언 */
  --acc2: #ff2d55;  /* 레드/경고 */
}
```

### 프로젝트 추가
`components/Projects.tsx`의 `PROJECTS` 배열에 항목 추가:
```ts
{
  type: '[ WEB / TOOL ]',
  red: false,
  title: '프로젝트 이름',
  desc: '설명',
  tags: ['TAG1', 'TAG2'],
  link: 'https://github.com/...',
}
```

### 블로그 포스트 추가
`components/Blog.tsx`의 `POSTS` 배열에 항목 추가.

### 스탯 수정
`components/Hero.tsx`의 `STATS` 배열 수정.
