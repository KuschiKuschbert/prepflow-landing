'use client'

import { useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function SpotlightCursor() {
  const mouseX = useMotionValue(-100) // Start off-screen
  const mouseY = useMotionValue(-100)

  // Smooth catch-up effect using springs
  const springConfig = { damping: 25, stiffness: 300 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150) // Center the 300px circle
      mouseY.set(e.clientY - 150)
    }

    window.addEventListener('mousemove', moveCursor)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-50"
      style={{
        x,
        y,
        background: 'radial-gradient(circle, rgba(204, 255, 0, 0.15) 0%, rgba(204, 255, 0, 0) 70%)',
        mixBlendMode: 'screen' 
      }}
    />
  )
}
