"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  rotation: number
  speedX: number
  speedY: number
  speedRotation: number
  color: string
  size: number
  shape: "circle" | "square" | "triangle"
}

export function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Confetti settings
    const particles: Particle[] = []
    const particleCount = 150
    const gravity = 0.35
    const drag = 0.08
    const colors = ["#00ffff", "#3b82f6", "#22c55e", "#eab308", "#ec4899"]
    const shapes = ["circle", "square", "triangle"]

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        rotation: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 20,
        speedY: (Math.random() - 0.5) * 20 - 5,
        speedRotation: (Math.random() - 0.5) * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)] as Particle["shape"],
      })
    }

    // Draw a particle
    const drawParticle = (particle: Particle) => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate((particle.rotation * Math.PI) / 180)
      ctx.fillStyle = particle.color

      switch (particle.shape) {
        case "circle":
          ctx.beginPath()
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
          ctx.fill()
          break
        case "square":
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
          break
        case "triangle":
          ctx.beginPath()
          ctx.moveTo(-particle.size / 2, particle.size / 2)
          ctx.lineTo(particle.size / 2, particle.size / 2)
          ctx.lineTo(0, -particle.size / 2)
          ctx.closePath()
          ctx.fill()
          break
      }

      ctx.restore()
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.speedRotation

        // Apply gravity and drag
        particle.speedY += gravity
        particle.speedX *= 1 - drag
        particle.speedY *= 1 - drag

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -0.5
        }
        if (particle.y > canvas.height) {
          particle.speedY *= -0.5
          particle.y = canvas.height
        }

        drawParticle(particle)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
}

