'use client'

import { motion } from 'framer-motion'

export default function RotatingTaco() {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center -z-10 overflow-hidden">
      <motion.div
        animate={{ 
          rotateY: 360,
          rotateX: [0, 10, 0, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="opacity-80"
        style={{ perspective: '1000px' }}
      >
        {/* Wireframe Taco SVG */}
        <svg 
            width="500" 
            height="500" 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="#CCFF02" 
            strokeWidth="0.8"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 0 15px rgba(204, 255, 0, 0.4))" }}
        >
            {/* Taco Shell - Bottom Curve */}
            <path d="M10,60 Q50,95 90,60" />
            
            {/* Taco Shell - Top Lip */}
            <path d="M10,50 Q50,85 90,50" />
            
            {/* Connectors (Depth) */}
            <path d="M10,50 L10,60" />
            <path d="M90,50 L90,60" />
            
            {/* Filling / Lettuce (Jagged Abstract Lines) */}
            <path d="M15,50 L20,35 L25,50 L30,30 L35,50 L40,25 L45,50 L50,20 L55,50 L60,25 L65,50 L70,30 L75,50 L80,35 L85,50" strokeLinejoin="round" />
            
            {/* Cheese / Meat Detail (Dashed Lines) */}
            <path d="M20,60 Q50,85 80,60" strokeDasharray="1 2" strokeOpacity="0.7" />
            <path d="M30,50 Q50,70 70,50" strokeDasharray="1 2" strokeOpacity="0.7" />
        </svg>
      </motion.div>
      
      {/* Abstract Rings */}
       <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-[#ccff00]/20 rounded-full"
      />
       <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] border border-[#ccff00]/20 rounded-full border-dashed"
      />
    </div>
  )
}
