'use client'

import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface MeshPoint {
  /** Cor do ponto. Qualquer cor CSS válida: hex, rgb, hsl. Sem alpha — use opacity no ponto. */
  color: string
  /** Posição horizontal em % da largura. @default 50 */
  x?: number
  /** Posição vertical em % da altura. @default 50 */
  y?: number
  /**
   * Raio de espalhamento em % da diagonal da tela.
   * Quanto maior, mais a cor se expande.
   * @default 60
   */
  spread?: number
  /** Opacidade do ponto (0–1). @default 0.8 */
  opacity?: number
}

export interface MeshBackgroundProps {
  /** Array de pontos de cor que formam a malha. */
  points: MeshPoint[]
  /**
   * Cor de fundo sólida exibida atrás dos pontos.
   * @default '#000000'
   */
  background?: string
  /**
   * Se `true`, cobre a viewport inteira (position fixed).
   * Se `false`, cobre o pai (position absolute — pai precisa de position relative).
   * @default false
   */
  fixed?: boolean
  /** @default 0 */
  zIndex?: number
  className?: string
}

// ─────────────────────────────────────────────
// Helper — converte hex para rgb
// ─────────────────────────────────────────────

const hexToRgb = (hex: string): [number, number, number] | null => {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean
  const n = parseInt(full, 16)
  if (isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

/**
 * `MeshBackground`
 *
 * Mesh gradient usando canvas 2D.
 * Cada ponto irradia sua cor via radialGradient — o resultado é uma malha
 * suave de cores que mistura naturalmente.
 *
 * Usa a mesma arquitetura do MeteorShower e StarField:
 * canvas absoluto dentro do pai, sem paralaxe, sem animação de movimento.
 *
 * @example
 * <div style={{ position: 'relative', height: '100vh' }}>
 *   <MeshBackground
 *     background="#0f0f11"
 *     points={[
 *       { color: '#f72585', x: 20, y: 30, spread: 55, opacity: 0.8 },
 *       { color: '#4cc9f0', x: 80, y: 10, spread: 60, opacity: 0.8 },
 *       { color: '#7209b7', x: 50, y: 85, spread: 50, opacity: 0.8 },
 *     ]}
 *   />
 * </div>
 */
export const MeshBackground = ({
  points,
  background = '#000000',
  fixed = false,
  zIndex = 0,
  className,
}: MeshBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = (W: number, H: number) => {
      // Fundo sólido
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, W, H)

      // Cada ponto é um radialGradient da cor para transparente
      points.forEach(point => {
        const cx = ((point.x ?? 50) / 100) * W
        const cy = ((point.y ?? 50) / 100) * H
        const diagonal = Math.sqrt(W * W + H * H)
        const radius = ((point.spread ?? 60) / 100) * diagonal
        const opacity = point.opacity ?? 0.8

        const rgb = hexToRgb(point.color)
        if (!rgb) return

        const [r, g, b] = rgb
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      })
    }

    const applySize = (W: number, H: number) => {
      canvas.width = W
      canvas.height = H
      draw(W, H)
    }

    let observer: ResizeObserver | null = null

    if (fixed) {
      applySize(window.innerWidth, window.innerHeight)
      const handler = () => applySize(window.innerWidth, window.innerHeight)
      window.addEventListener('resize', handler)
      return () => window.removeEventListener('resize', handler)
    } else {
      const parent = canvas.parentElement
      if (parent) {
        applySize(parent.clientWidth, parent.clientHeight)
        observer = new ResizeObserver(entries => {
          const { width, height } = entries[0].contentRect
          applySize(width, height)
        })
        observer.observe(parent)
      }
    }

    return () => observer?.disconnect()
  }, [points, background, fixed])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className={className}
      style={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex,
        pointerEvents: 'none',
      }}
    />
  )
}

export default MeshBackground
