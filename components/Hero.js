'use client'

import { motion } from 'framer-motion'
import ProtectedButton from './ProtectedButton'

const shieldLock = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  visible: (i) => ({
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 400, damping: 25, delay: i * 0.1 },
  }),
}

const fromLeft = {
  hidden: { x: -80, opacity: 0, filter: 'blur(8px)' },
  visible: { x: 0, opacity: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 300, damping: 25, delay: 0.8 } },
}

const fromRight = {
  hidden: { x: 80, opacity: 0, filter: 'blur(8px)' },
  visible: { x: 0, opacity: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 300, damping: 25, delay: 1 } },
}

const transactions = [
  { flag: '🇺🇸', name: 'New York → London', amount: '+£2,400', time: 'Just now', color: 'text-green-400' },
  { flag: '🇦🇪', name: 'Dubai → Toronto', amount: '+CA$3,100', time: '2 min ago', color: 'text-green-400' },
  { flag: '🇸🇬', name: 'Singapore → Paris', amount: '+€1,850', time: '4 min ago', color: 'text-green-400' },
  { flag: '🇳🇬', name: 'Lagos → New York', amount: '+$1,200', time: '6 min ago', color: 'text-green-400' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-amber-900/10 blur-[100px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#C6A84B 1px, transparent 1px), linear-gradient(90deg, #C6A84B 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div custom={0} variants={shieldLock} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-aegis-gray">
                Now live in <span className="text-gold">180+ countries worldwide</span>
              </span>
            </motion.div>

            <motion.h1 custom={1} variants={shieldLock} initial="hidden" animate="visible"
              className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
              <span className="text-aegis-white block mb-2">Move money</span>
              <span className="text-aegis-white block mb-2">anywhere in</span>
              <span className="gradient-text block">the world. 🛡️</span>
            </motion.h1>

            <motion.p custom={2} variants={shieldLock} initial="hidden" animate="visible"
              className="text-lg text-aegis-gray leading-relaxed max-w-lg mb-10">
              No hidden fees. No delays. No excuses.
              Aegis moves your money from New York to Nairobi,
              London to Lagos in seconds — with bank-grade protection
              in every single country we operate.
            </motion.p>

            <motion.div custom={3} variants={shieldLock} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-4 mb-12">
              <ProtectedButton variant="primary">🛡️ Create free account</ProtectedButton>
              <ProtectedButton variant="secondary">See how it works →</ProtectedButton>
            </motion.div>

            <motion.div custom={4} variants={shieldLock} initial="hidden" animate="visible"
              className="flex flex-wrap items-center gap-6">
              {[
                { icon: '🔒', text: '256-bit encrypted' },
                { icon: '⚡', text: 'Instant transfers' },
                { icon: '🌍', text: '180+ countries' },
                { icon: '⭐', text: '4.9/5 rated' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs text-aegis-gray">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              {[1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className="absolute rounded-full border border-gold/10 animate-shield-pulse"
                  style={{
                    width: `${ring * 120}px`, height: `${ring * 120}px`,
                    top: `${-ring * 60}px`, left: `${-ring * 60}px`,
                    animationDelay: `${ring * 0.6}s`,
                  }}
                />
              ))}
            </div>

            <motion.div custom={0} variants={shieldLock} initial="hidden" animate="visible"
              className="glass-card rounded-3xl p-6 relative"
              style={{ boxShadow: '0 0 60px rgba(198, 168, 75, 0.08), 0 0 120px rgba(198, 168, 75, 0.04)' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-aegis-gray text-xs uppercase tracking-widest mb-1">Total Balance</p>
                  <p className="text-aegis-white text-3xl font-bold">$48,291.00</p>
                </div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div className="absolute inset-0 bg-gold/30 rounded-2xl blur-md -z-10" />
                </div>
              </div>

              <div className="h-1 bg-aegis-border rounded-full mb-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: '↑', label: 'Send', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
                  { icon: '↓', label: 'Receive', color: 'from-green-500/20 to-green-600/10 border-green-500/20' },
                  { icon: '🔄', label: 'Convert', color: 'from-gold/20 to-gold/10 border-gold/20' },
                ].map((action) => (
                  <motion.div
                    key={action.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-br ${action.color} border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-xs text-aegis-white font-medium">{action.label}</span>
                  </motion.div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-aegis-gray text-xs uppercase tracking-widest">Live Transfers</p>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">Live</span>
                  </span>
                </div>
                <div className="space-y-3">
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={tx.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{tx.flag}</span>
                        <div>
                          <p className="text-aegis-white text-sm font-medium">{tx.name}</p>
                          <p className="text-aegis-gray text-xs">{tx.time}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${tx.color}`}>{tx.amount}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fromLeft} initial="hidden" animate="visible"
              className="absolute -left-8 top-1/3 glass-card rounded-2xl p-4 hidden lg:block animate-float"
              style={{ boxShadow: '0 0 30px rgba(198, 168, 75, 0.08)' }}>
              <p className="text-aegis-gray text-xs mb-1">Best Rate Today</p>
              <p className="text-aegis-white font-bold">GBP → USD $1.27</p>
              <p className="text-green-400 text-xs mt-1">↑ Real mid-market rate</p>
            </motion.div>

            <motion.div variants={fromRight} initial="hidden" animate="visible"
              className="absolute -right-8 bottom-1/3 glass-card rounded-2xl p-4 hidden lg:block animate-float-delayed"
              style={{ boxShadow: '0 0 30px rgba(198, 168, 75, 0.08)' }}>
              <p className="text-aegis-gray text-xs mb-1">Transfer Speed</p>
              <p className="text-aegis-white font-bold">⚡ 3 seconds</p>
              <p className="text-gold text-xs mt-1">🛡️ Protected</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
