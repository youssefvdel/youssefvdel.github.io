import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'

type MagneticProps = {
  href: string
  className?: string
  children: ReactNode
}

const SPRING = { stiffness: 320, damping: 26, mass: 0.4 }

export function Magnetic({ href, className, children }: MagneticProps) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  function handleMove(event: PointerEvent<HTMLAnchorElement>) {
    if (reduce || event.pointerType !== 'mouse') return

    const rect = event.currentTarget.getBoundingClientRect()
    let dx = ((event.clientX - rect.left) / rect.width - 0.5) * 8
    let dy = ((event.clientY - rect.top) / rect.height - 0.5) * 6
    const distance = Math.hypot(dx, dy)

    if (distance > 4) {
      const scale = 4 / distance
      dx *= scale
      dy *= scale
    }

    x.set(dx)
    y.set(dy)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      className={className}
      href={href}
      style={{ x: springX, y: springY }}
      target="_blank"
      rel="noreferrer"
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.a>
  )
}
