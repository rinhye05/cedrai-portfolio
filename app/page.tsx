'use client'

import { useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import ScrollReveal from '@/components/ScrollReveal'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [loaded, setLoaded] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('visited') === 'true'
    }
    return false
  })

  const handleDone = () => {
    sessionStorage.setItem('visited', 'true')
    setLoaded(true)
  }

  return (
    <>
      {!loaded && <LoadingScreen onDone={handleDone} />}
      <main style={{ opacity: loaded ? 1 : 0, transition: 'opacity .4s ease' }}>
        <Nav />
        <ScrollReveal><Hero /></ScrollReveal>
        <ScrollReveal delay={50}><Skills /></ScrollReveal>
        <ScrollReveal delay={50}><Contact /></ScrollReveal>
        <Footer />
      </main>
    </>
  )
}