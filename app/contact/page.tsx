import Contact from '@/components/Contact'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <main className="page-main">
      <Nav />
      <Contact fullPage />
      <Footer />
    </main>
  )
}
