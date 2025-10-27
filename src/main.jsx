import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

// Register GSAP ScrollTrigger once at app entry to centralize plugin registration
gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
