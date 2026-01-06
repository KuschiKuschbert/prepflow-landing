'use client'

import { useEffect, useRef } from 'react'

export default function TriangleGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight

    const triangles: Triangle[] = []
    const numTriangles = 50

    class Triangle {
      x: number
      y: number
      size: number
      rotation: number
      speed: number
      opacity: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 40 + 20 // Different sizes: 20px to 60px
        this.rotation = Math.random() * Math.PI * 2
        this.speed = Math.random() * 0.5 + 0.1
        this.opacity = Math.random() * 0.5 + 0.15 // More visible opacity
      }

      update() {
        this.rotation += 0.005 * this.speed

        // Pulse effect
        this.opacity = 0.2 + Math.sin(Date.now() * 0.001 * this.speed) * 0.1

        // Gentle float
        this.y -= this.speed * 0.5
        if (this.y + this.size < 0) {
            this.y = height + this.size
            this.x = Math.random() * width
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        ctx.beginPath()
        // Draw centered triangle
        ctx.moveTo(0, -this.size / 2)
        ctx.lineTo(this.size / 2, this.size / 2)
        ctx.lineTo(-this.size / 2, this.size / 2)
        ctx.closePath()

        ctx.strokeStyle = `rgba(204, 255, 0, ${this.opacity})` // Electric Lime
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.restore()
      }
    }

    const init = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height

      triangles.length = 0
      for (let i = 0; i < numTriangles; i++) {
        triangles.push(new Triangle())
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      triangles.forEach(t => {
        t.update()
        t.draw(ctx)
      })
      animationFrameId = requestAnimationFrame(render)
    }

    init()
    window.addEventListener('resize', init)
    render()

    return () => {
      window.removeEventListener('resize', init)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20"
      // Removed solid background color to allow stacking with other backgrounds if needed
    />
  )
}
