'use client'

import { useEffect, useState } from 'react'

export default function PulsatingConcentricCircles() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#29e7cd]/5 pointer-events-none">
        {/* Circle 1 - Smallest */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-current opacity-20 animate-[pulse-slow_4s_ease-in-out_infinite]" />

        {/* Circle 2 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-current opacity-15 animate-[pulse-slow_5s_ease-in-out_infinite_0.5s]" />

        {/* Circle 3 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-current opacity-10 animate-[pulse-slow_6s_ease-in-out_infinite_1s]" />

        {/* Circle 4 - Largest */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-current opacity-5 animate-[pulse-slow_7s_ease-in-out_infinite_1.5s]" />
      </div>
    </div>
  )
}
