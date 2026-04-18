'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedButton from './ProtectedButton'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-aegis-bg/90 backdrop-blur-2xl border-b border-gold/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ opacity: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                <span className="text-black font-black text-sm">A</span>
              </div>
              <div className="absolute inset-0 bg-gold/30 rounded-xl blur-md -z-10" />
            </div>
            <span className="text-aegis-white font-bold text-xl tracking-tight">Aegis</span>
          </motion.div>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <motion.button
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm text-aegis-gray hover:text-aegis-white transition-colors duration-200 relative"
                  whileHover="hover"
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-px bg-gold"
                    variants={{ rest: { width: 0 }, hover: { width: '100%' } }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm text-aegis-gray hover:text-aegis-white transition-colors duration-200">
              Log in
            </button>
            <ProtectedButton variant="primary">Get started free</ProtectedButton>
          </div>

          <button className="md:hidden flex flex-col gap-1.5 z-50" onClick={() => setMenuOpen(!menuOpen)}>
            <motion.span animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-aegis-white origin-center" />
            <motion.span animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }} className="block w-6 h-0.5 bg-aegis-white" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-aegis-white origin-center" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-aegis-bg/95 backdrop-blur-[40px] flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold/5 blur-[80px] pointer-events-none" />
            {navLinks.map((link, index) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleNavClick(link.href)}
                className="text-4xl font-light text-aegis-white hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <ProtectedButton variant="primary">Get started free</ProtectedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
