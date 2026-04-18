'use client'

import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🌍', title: 'Global Transfers',
    description: 'Send money to 180+ countries in seconds. Real exchange rates, zero hidden fees, and instant delivery guaranteed worldwide.',
    gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/10',
    points: ['Real mid-market rates', 'No hidden charges', 'Instant worldwide delivery'],
  },
  {
    icon: '🛡️', title: 'Shield Protection',
    description: 'Your money is shielded by 256-bit encryption, biometric authentication and our AI-powered fraud detection system.',
    gradient: 'from-gold/10 to-gold/5', border: 'border-gold/20', iconBg: 'bg-gold/10',
    points: ['Military grade encryption', 'Biometric authentication', 'AI fraud detection'],
  },
  {
    icon: '💰', title: 'Smart Savings',
    description: 'Save in multiple currencies. Earn up to 8.5% APY on your deposits. Set goals and automate your savings journey.',
    gradient: 'from-green-500/10 to-green-600/5', border: 'border-green-500/20', iconBg: 'bg-green-500/10',
    points: ['Up to 8.5% APY', 'Multi-currency vaults', 'Automated savings'],
  },
  {
    icon: '💳', title: 'Aegis Card',
    description: 'Spend in any currency worldwide. Virtual card available instantly. Physical card delivered anywhere in the world.',
    gradient: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20', iconBg: 'bg-purple-500/10',
    points: ['No forex fees', 'Virtual + physical card', 'Apple & Google Pay'],
  },
  {
    icon: '📊', title: 'Financial Insights',
    description: 'Beautiful analytics that show exactly where your money goes. Get personalized tips to improve your financial health.',
    gradient: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20', iconBg: 'bg-cyan-500/10',
    points: ['Spending analytics', 'Custom budgets', 'Monthly reports'],
  },
  {
    icon: '🏢', title: 'Business Payments',
    description: 'Send bulk payments globally. Manage team expenses, pay suppliers and receive from customers anywhere in the world.',
    gradient: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20', iconBg: 'bg-orange-500/10',
    points: ['Bulk payments', 'Team management', 'API access'],
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/3 blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-6">
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm text-gold">🌍 Built for the world</span>
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="text-center mb-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-aegis-white">Everything your </span>
            <span className="gradient-text">money needs.</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2} className="text-center mb-20">
          <p className="text-lg text-aegis-gray max-w-2xl mx-auto">
            One app to send, save and protect your money anywhere on the planet. No bureaucracy. No delays. Just seamless global finance.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 0 50px rgba(198, 168, 75, 0.1)', borderColor: 'rgba(198, 168, 75, 0.25)' }}
                className={`p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} border ${feature.border} h-full transition-all duration-300 cursor-default`}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center text-2xl mb-6`}>{feature.icon}</div>
                <h3 className="text-aegis-white font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-aegis-gray leading-relaxed mb-6 text-sm">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-aegis-gray">
                      <span className="text-gold text-xs">✦</span>{point}
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
