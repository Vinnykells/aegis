'use client'

import { motion } from 'framer-motion'

export default function ProtectedButton({ children, onClick, variant = 'primary', className = '' }) {
  const isPrimary = variant === 'primary'

  return (
    <motion.button
      onClick={onClick}
      className={`relative px-8 py-4 rounded-2xl text-sm font-semibold overflow-hidden group ${
        isPrimary
          ? 'bg-gradient-to-r from-gold to-gold-light text-black'
          : 'text-aegis-white border border-gold/20'
      } ${className}`}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      initial="rest"
    >
      {!isPrimary && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.rect
            x="0.5" y="0.5" width="99" height="99" rx="15"
            fill="none" stroke="#C6A84B" strokeWidth="0.8"
            variants={{
              rest: { pathLength: 0, opacity: 0 },
              hover: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
            }}
          />
        </svg>
      )}

      <motion.div
        className={`absolute inset-0 rounded-2xl ${isPrimary ? 'bg-white/20' : 'bg-gold/5'}`}
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2 }}
      />

      {isPrimary && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          variants={{ rest: { x: '-100%' }, hover: { x: '200%' } }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
