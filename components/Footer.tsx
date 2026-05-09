export default function Footer() {
  return (
    <footer
      style={{
        padding: '.8rem 2rem',
        background: 'var(--bg2)',
        borderTop: '1px solid var(--bd)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.08em' }}>
        © 2026 <span style={{ color: 'var(--acc)' }}>Cédrai</span> — NEXT.JS + VERCEL
      </span>
      <span style={{ fontSize: '8px', color: 'var(--tx2)', letterSpacing: '.08em' }}>
        BREAK → UNDERSTAND → BUILD
      </span>
    </footer>
  )
}
