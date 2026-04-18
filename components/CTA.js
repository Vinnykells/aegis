'use client'

import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import ProtectedButton from './ProtectedButton'

export default function CTA() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="relative rounded-3xl overflow-hidden glass-card border border-gold/15 p-12 md:p-20 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="relative inline-block mb-8">
                {[1, 2].map((ring) => (
                  <div
                    key={ring}
                    className="absolute rounded-full border border-gold/10 animate-shield-pulse"
                    style={{
                      width: `${ring * 80}px`, height: `${ring * 80}px`,
                      top: `${-ring * 40 + 32}px`, left: `${-ring * 40 + 32}px`,
                      animationDelay: `${ring * 0.5}s`,
                    }}
                  />
                ))}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center z-10"
                  style={{ boxShadow: '0 0 40px rgba(198, 168, 75, 0.4)' }}
                >
                  <span className="text-3xl">🛡️</span>
                </motion.div>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="text-aegis-white">Ready to protect </span>
                <span className="gradient-text block">your money?</span>
              </h2>

              <p className="text-aegis-gray text-lg max-w-xl mx-auto mb-10">
                Join 2.4 million people across 180+ countries who move money faster, cheaper and safer with Aegis. Start free. No credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <ProtectedButton variant="primary">🛡️ Create free account</ProtectedButton>
                <ProtectedButton variant="secondary">Talk to us →</ProtectedButton>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-gold/10">
                {['🔒 256-bit encrypted', '✓ Regulated & licensed', '⭐ 4.9/5 rated', '🌍 180+ countries', '⚡ 3 second transfers'].map((badge) => (
                  <span key={badge} className="text-aegis-gray text-sm">{badge}</span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
