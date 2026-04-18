'use client'

import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

const steps = [
  { number: '01', title: 'Create your account', description: 'Sign up in 2 minutes. Email, password, done. No branch visits, no paperwork, no hassle. Available worldwide.', icon: '👤', color: 'border-blue-500/20 bg-blue-500/5' },
  { number: '02', title: 'Verify your identity', description: 'Quick KYC verification accepted globally. Upload your ID, take a selfie. Approved in minutes by our AI system.', icon: '✓', color: 'border-gold/20 bg-gold/5' },
  { number: '03', title: 'Add money', description: 'Fund your account via bank transfer, card or mobile money from anywhere in the world. Instant deposits, zero delays.', icon: '💰', color: 'border-green-500/20 bg-green-500/5' },
  { number: '04', title: 'Send anywhere globally', description: 'Choose your recipient, enter the amount, confirm. Your money arrives anywhere in the world in seconds. Not days.', icon: '⚡', color: 'border-purple-500/20 bg-purple-500/5' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-6">
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm text-gold">⚡ Super simple</span>
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="text-center mb-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-aegis-white">Up and running </span>
            <span className="gradient-text">in minutes.</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2} className="text-center mb-20">
          <p className="text-lg text-aegis-gray max-w-xl mx-auto">
            Getting started with Aegis is simple. Four steps and you are moving money anywhere in the world.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 0 40px rgba(198, 168, 75, 0.1)' }}
                className="relative p-8 rounded-3xl glass-card h-full transition-all duration-300"
              >
                <span className="absolute top-4 right-6 text-6xl font-black text-aegis-border select-none">{step.number}</span>
                <div className={`w-14 h-14 rounded-2xl border ${step.color} flex items-center justify-center text-2xl mb-6`}>{step.icon}</div>
                <h3 className="text-aegis-white font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-aegis-gray text-sm leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-gold/30 text-xl z-10">→</div>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
