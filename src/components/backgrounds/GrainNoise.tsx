'use client'

import { useEffect, useRef } from 'react'

type GrainNoiseProps = {
  opacity?: number
  density?: number
  zIndex?: number
  fixed?: boolean
}

export default function GrainNoise({ opacity = 0.05, density = 1, zIndex = 1, fixed = true }: GrainNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 100
    canvas.width = size
    canvas.height = size

    const imageData = ctx.createImageData(size, size)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255 * density

      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
      data[i + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
        zIndex,
        imageRendering: 'pixelated',
      }}
    />
  )
}
