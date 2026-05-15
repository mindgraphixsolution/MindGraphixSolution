import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import About from './components/pages/About'
import Services from './components/pages/Services'
import Portfolio from './components/pages/Portfolio'

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <section className="px-6 py-24 max-w-[1440px] mx-auto">
        <div className="glass p-12 md:p-24 rounded-[3rem] border border-[var(--border-color)] text-center relative overflow-hidden group">
          <h2 className="text-4xl md:text-7xl font-black mb-8 relative z-10 uppercase tracking-tighter">
            Bâtissons votre <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)]">Prochaine Vision.</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-12 max-w-2xl mx-auto relative z-10 font-medium">
            Prêt à transformer votre idée en un produit numérique d'exception ? Notre équipe d'architectes est là pour vous accompagner.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button className="btn-architect px-12 py-5 text-lg">
              Démarrer un Devis
            </button>
            <button className="px-12 py-5 rounded-2xl border border-[var(--border-color)] font-bold hover:bg-[var(--bg-accent)] transition-all glass">
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
      <div className="min-h-screen bg-[var(--bg-primary)]">
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
