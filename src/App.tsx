import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import About from './components/pages/About'
import Services from './components/pages/Services'
import Portfolio from './components/pages/Portfolio'
import { CustomCursor } from './components/CustomCursor'

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <section className="px-6 py-32 max-w-[1440px] mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-accent)] opacity-20 pointer-events-none" />
        <div className="p-12 md:p-32 rounded-[2rem] border border-[var(--border-subtle)] text-center relative overflow-hidden group bg-[#0a0a0a]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1/2 bg-[var(--accent-glow)] blur-[100px] pointer-events-none" />
          
          <h2 className="text-5xl md:text-8xl font-black mb-8 relative z-10 uppercase tracking-tighter font-display leading-[0.9]">
            Bâtissons <br /> <span className="text-gradient">L'Avenir.</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10 font-light">
            Prêt à transformer votre idée en un produit numérique d'exception ? Notre équipe d'architectes est là pour vous accompagner.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button className="btn-architect text-lg">
              Démarrer un Projet
            </button>
            <button className="px-10 py-4 rounded-full border border-[var(--border-subtle)] font-medium hover:bg-white/5 transition-all text-[var(--text-main)] uppercase tracking-wider text-sm">
              Nous Contacter
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] selection:bg-[var(--accent-color)] selection:text-white">
        <CustomCursor />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
