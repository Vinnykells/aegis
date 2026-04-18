'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '$4.8B+', label: 'Transferred safely', icon: '🛡️' },
  { value: '180+', label: 'Countries supported', icon: '🌍' },
  { value: '2.4M+', label: 'Active users', icon: '👥' },
  { value: '3 sec', label: 'Average transfer time', icon: '⚡' },
]

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ y: -4, boxShadow: '0 0 40px rgba(198, 168, 75, 0.12)', borderColor: 'rgba(198, 168, 75, 0.3)' }}
              className="glass-card rounded-3xl p-6 text-center cursor-default transition-all duration-300"
            >
              <p className="text-3xl mb-3">{stat.icon}</p>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-aegis-gray text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
