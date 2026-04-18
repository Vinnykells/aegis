'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

const faqs = [
  {
    question: 'Which countries does Aegis support?',
    answer: 'Aegis currently supports 180+ countries worldwide including the US, UK, all EU countries, Canada, Australia, Japan, Singapore, UAE and many more. We are continuously expanding our coverage. Check our coverage page for the full list.',
  },
  {
    question: 'How fast are international transfers?',
    answer: 'Most transfers arrive within 3-10 seconds regardless of destination. For first-time transfers to a new recipient, our security system may take up to 2 minutes to verify. After that, all subsequent transfers to the same recipient are instant.',
  },
  {
    question: 'What exchange rates does Aegis use?',
    answer: 'We use the real mid-market exchange rate — the same rate you see on Google. No markup, no inflated rates, no hidden spread. Starter users pay a small fixed fee per transfer. Pro and Elite users get free unlimited transfers at the real rate.',
  },
  {
    question: 'Is Aegis regulated and safe?',
    answer: 'Yes. Aegis is licensed and regulated in every jurisdiction we operate in. Your funds are held in segregated accounts at tier-1 partner banks worldwide. We use 256-bit encryption and our security infrastructure is independently audited quarterly.',
  },
  {
    question: 'Can I use Aegis for my business?',
    answer: 'Absolutely. Our Pro plan includes business lite features and our Elite plan gives you the full business suite including bulk international payments, team access, accounting integrations, API access and a dedicated account manager.',
  },
  {
    question: 'How do I get the Aegis card?',
    answer: 'Virtual cards are available immediately upon signup at no cost. Physical cards are available on Pro and Elite plans. We deliver worldwide within 5-10 business days depending on your location.',
  },
  {
    question: 'What currencies does Aegis support?',
    answer: 'Aegis supports 50+ currencies including USD, GBP, EUR, JPY, CAD, AUD, CHF, SGD, AED, NGN, KES, GHS, ZAR and many more. You can hold multiple currency balances simultaneously and convert between them at real rates anytime.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-6">
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm text-gold">❓ Got questions</span>
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="text-center mb-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-aegis-white">We have </span>
            <span className="gradient-text">answers.</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2} className="text-center mb-16">
          <p className="text-lg text-aegis-gray">Everything you need to know about Aegis. Still have questions? Talk to our team 24/7.</p>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <AnimatedSection key={faq.question} delay={index * 0.08}>
              <motion.div
                whileHover={{ borderColor: 'rgba(198, 168, 75, 0.2)' }}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <span className="text-aegis-white font-medium pr-4 group-hover:text-gold transition-colors duration-200">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold text-sm"
                  >
                    +
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-aegis-gray leading-relaxed text-sm border-t border-gold/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
