'use client'

import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'Roadmap', 'API'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Regions: ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'],
}

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 px-6 pt-20 pb-12">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="grid md:grid-cols-6 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                    <span className="text-black font-black text-sm">A</span>
                  </div>
                  <div className="absolute inset-0 bg-gold/30 rounded-xl blur-md -z-10" />
                </div>
                <span className="text-aegis-white font-bold text-xl">Aegis</span>
              </div>
              <p className="text-aegis-gray text-sm leading-relaxed mb-2">The shield your money deserves.</p>
              <p className="text-aegis-gray text-sm leading-relaxed mb-6">
                Move money anywhere in the world instantly, safely and at the real exchange rate.
              </p>
              <div className="flex gap-3">
                {[{ icon: '𝕏', label: 'Twitter' }, { icon: 'in', label: 'LinkedIn' }, { icon: 'f', label: 'Facebook' }, { icon: '📸', label: 'Instagram' }].map((social) => (
                  <motion.button
                    key={social.label}
                    whileHover={{ scale: 1.1, borderColor: 'rgba(198, 168, 75, 0.4)', color: '#C6A84B' }}
                    className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-aegis-gray text-xs transition-all duration-200"
                  >
                    {social.icon}
                  </motion.button>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-aegis-white font-semibold text-sm mb-5">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 3, color: '#C6A84B' }}
                        className="text-aegis-gray text-sm hover:text-aegis-white transition-colors duration-200 inline-block"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-aegis-gray text-sm">© {new Date().getFullYear()} Aegis Financial Technologies Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-aegis-gray text-sm">All systems operational</span>
              </div>
              <span className="text-aegis-gray text-sm">🛡️ Protected by Aegis Security</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  )
}
