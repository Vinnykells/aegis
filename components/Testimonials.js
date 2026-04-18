'use client'

import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

const testimonials = [
  {
    name: 'James Mitchell', role: 'Startup Founder, New York', avatar: 'JM', country: '🇺🇸',
    text: 'We pay contractors in 12 different countries every month. Before Aegis this was a nightmare of wire transfers, delays and ridiculous fees. Now it takes 5 minutes and everyone gets paid instantly at real rates.',
    highlight: 'Saves $3,200/month in transfer fees',
  },
  {
    name: 'Sophie Beaumont', role: 'Digital Nomad, London', avatar: 'SB', country: '🇬🇧',
    text: 'I work remotely and live across 6 countries a year. Aegis is the only app that genuinely works everywhere I go. The card works, the rates are real and transfers land in seconds. Nothing else comes close.',
    highlight: 'Used in 6 countries across 3 continents',
  },
  {
    name: 'Hiroshi Tanaka', role: 'E-commerce Owner, Tokyo', avatar: 'HT', country: '🇯🇵',
    text: 'Paying international suppliers used to cost us 4-6% in fees every time. Aegis cut that to essentially zero. The savings go straight back into the business. The security features also give me complete peace of mind.',
    highlight: 'Reduced supplier payment costs by 94%',
  },
  {
    name: 'Priya Sharma', role: 'Freelance Designer, Toronto', avatar: 'PS', country: '🇨🇦',
    text: 'Getting paid by US and UK clients and converting to CAD used to be so painful. Aegis gives me the real exchange rate every single time and my money lands instantly. I recommended it to every freelancer I know.',
    highlight: 'Receives $8,000+ from clients monthly',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-6">
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm text-gold">💬 Real stories</span>
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="text-center mb-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-aegis-white">Trusted </span>
            <span className="gradient-text">worldwide.</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2} className="text-center mb-16">
          <p className="text-lg text-aegis-gray max-w-xl mx-auto">
            2.4 million people across 180+ countries trust Aegis with their money every single day.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                whileHover={{ y: -4, boxShadow: '0 0 50px rgba(198, 168, 75, 0.1)', borderColor: 'rgba(198, 168, 75, 0.25)' }}
                className="glass-card rounded-3xl p-8 transition-all duration-300 cursor-default"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-gold text-sm">★</span>)}
                </div>
                <p className="text-aegis-white leading-relaxed mb-6 text-sm">{testimonial.text}</p>
                <div className="glass-card rounded-xl px-4 py-2 mb-6 inline-block">
                  <p className="text-gold text-xs font-medium">✦ {testimonial.highlight}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/20 flex items-center justify-center text-gold text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-aegis-white text-sm font-semibold">{testimonial.country} {testimonial.name}</p>
                    <p className="text-aegis-gray text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
