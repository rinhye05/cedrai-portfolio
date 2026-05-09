'use client'

import { useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <main style={{ opacity: loaded ? 1 : 0, transition: 'opacity .4s ease' }}>
        <Nav />
        <Hero />
        <Skills />
        <Projects />
        <Blog />
        <Contact />
        <Footer />
      </main>
    </>
  )
}