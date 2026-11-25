'use client'

import type { MouseEventHandler, ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ProtectedButtonProps {
  children: ReactNode
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function ProtectedButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
}: ProtectedButtonProps) {
  const isPrimary = variant === 'primary'
  const classes = `relative inline-flex px-8 py-4 rounded-2xl text-sm font-semibold overflow-hidden group cursor-pointer ${
    isPrimary
      ? 'bg-gradient-to-r from-gold to-gold-light text-black'
      : 'text-aegis-white border border-gold/20 hover:border-gold/40'
  } ${className}`

  const content = (
    <>
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

      <motion.span
        className={`absolute inset-0 rounded-2xl ${isPrimary ? 'bg-white/20' : 'bg-gold/5'}`}
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2 }}
      />

      {isPrimary && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          variants={{ rest: { x: '-100%' }, hover: { x: '200%' } }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  )

  const animationProps = {
    className: classes,
    whileHover: 'hover' as const,
    whileTap: { scale: 0.97 },
    initial: 'rest' as const,
  }

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        <motion.span {...animationProps}>{content}</motion.span>
      </Link>
    )
  }

  return (
    <motion.button {...animationProps} onClick={onClick}>
      {content}
    </motion.button>
  )
}
