import './index.css'
import Hero from './components/Hero'
import About from './components/About'
import Navbar from './components/Navbar';
import Features from './components/Features';
import Story from './components/Story';
import Contact from './components/Contact';
import Footer from './components/Footer';
import useSmoothScroll from './hooks/useSmoothScroll';
const App = () => {
  // Initialize smooth scrolling for the entire app
  useSmoothScroll();

  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <main id="main-content" role="main" className='relative min-h-screen w-screen overflow-x-hidden smooth-scroll-container no-scroll-jank'>
        <Navbar />
        <section className="scroll-section">
          <Hero />
        </section>
        <section id="about" className="scroll-section">
          <About />
        </section>
        <section id="features" className="scroll-section">
          <Features />
        </section>
        <section id="story" className="scroll-section">
          <Story />
        </section>
        <section id="contact" className="scroll-section">
          <Contact />
        </section>
        <Footer />
      </main>
    </>
  )
}

export default App
