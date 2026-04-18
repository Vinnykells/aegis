'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import ProtectedButton from './ProtectedButton'

const plans = [
  {
    name: 'Starter', price: { monthly: 0, yearly: 0 }, description: 'Perfect for getting started.',
    border: 'border-gold/10', badge: null,
    features: ['Send up to $500/month', '2 free transfers/month', 'Standard exchange rates', 'Basic savings account', 'Virtual Aegis card', 'Email support'],
    locked: ['Premium rates', 'Priority support', 'Physical card'],
  },
  {
    name: 'Pro', price: { monthly: 9.99, yearly: 7.99 }, description: 'For those serious about cross-border finance.',
    border: 'border-gold/40', badge: 'Most Popular', glow: true,
    features: ['Send up to $10,000/month', 'Unlimited free transfers', 'Real mid-market rates', 'High yield savings (8.5% APY)', 'Virtual + Physical Aegis card', 'Priority support', 'Business lite features'],
    locked: ['Dedicated manager'],
  },
  {
    name: 'Elite', price: { monthly: 24.99, yearly: 19.99 }, description: 'The full Aegis experience.',
    border: 'border-gold/10', badge: null,
    features: ['Unlimited transfers', 'Best rates in market', 'Premium savings (10% APY)', 'Premium metal card', 'Dedicated account manager', '24/7 phone support', 'Full business suite', 'API access'],
    locked: [],
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-6">
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm text-gold">💳 Simple pricing</span>
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="text-center mb-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-aegis-white">Honest, </span>
            <span className="gradient-text">transparent pricing.</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2} className="text-center mb-10">
          <p className="text-lg text-aegis-gray max-w-xl mx-auto">
            No hidden fees. No fine print. What you see is exactly what you pay.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3} className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm ${!yearly ? 'text-aegis-white' : 'text-aegis-gray'}`}>Monthly</span>
          <motion.button
            onClick={() => setYearly(!yearly)}
            className={`w-14 h-7 rounded-full transition-colors duration-300 relative ${yearly ? 'bg-gold' : 'bg-aegis-border'}`}
          >
            <motion.div
              animate={{ x: yearly ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full bg-white absolute top-1 shadow-md"
            />
          </motion.button>
          <span className={`text-sm ${yearly ? 'text-aegis-white' : 'text-aegis-gray'}`}>
            Yearly
            <span className="ml-2 text-xs text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">Save 20%</span>
          </span>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <AnimatedSection key={plan.name} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: plan.glow ? -8 : -4, boxShadow: plan.glow ? '0 0 60px rgba(198, 168, 75, 0.2)' : '0 0 30px rgba(198, 168, 75, 0.08)' }}
                className={`relative p-8 rounded-3xl glass-card border ${plan.border} h-full flex flex-col transition-all duration-300`}
                style={plan.glow ? { boxShadow: '0 0 40px rgba(198, 168, 75, 0.12)' } : {}}
              >
                {plan.glow && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-gold-light text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-aegis-white font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-aegis-gray text-sm mb-6">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-aegis-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
                    <div className="mb-2">
                      {plan.price.monthly > 0
                        ? <span className="text-aegis-gray text-sm">/mo</span>
                        : <span className="text-aegis-gray text-sm">forever</span>
                      }
                    </div>
                  </div>
                  {yearly && plan.price.monthly > 0 && (
                    <p className="text-gold text-xs mt-1">Billed ${(plan.price.yearly * 12).toFixed(0)}/year</p>
                  )}
                </div>

                <div className="mb-8">
                  <ProtectedButton variant={plan.glow ? 'primary' : 'secondary'} className="w-full justify-center">
                    Get {plan.name}
                  </ProtectedButton>
                </div>

                <ul className="space-y-3 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-aegis-white">
                      <span className="text-gold mt-0.5 flex-shrink-0">✦</span>{feature}
                    </li>
                  ))}
                  {plan.locked.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-aegis-gray/40 line-through">
                      <span className="mt-0.5 flex-shrink-0">✦</span>{feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
