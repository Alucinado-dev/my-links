import { useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────
// useWindowSize — mesmo hook do MeteorShower
// ─────────────────────────────────────────────

const useWindowSize = (): { width: number; height: number } => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return size
}

// ─────────────────────────────────────────────
// Tipos internos
// ─────────────────────────────────────────────

type StarParticle = {
  x: number
  y: number
  radius: number
  baseOpacity: number
  /** Fase inicial do seno — garante que as estrelas não pulsam em sincronia */
  phase: number
  /** Velocidade do twinkle em rad/ms */
  twinkleSpeed: number
}

// ─────────────────────────────────────────────
// Props públicas
// ─────────────────────────────────────────────

export interface StarFieldProps {
  /**
   * Quantidade de estrelas na tela.
   * @default 120
   */
  count?: number

  /**
   * Raio mínimo de cada estrela em pixels.
   * @default 0.3
   */
  minRadius?: number

  /**
   * Raio máximo de cada estrela em pixels.
   * @default 1.5
   */
  maxRadius?: number

  /**
   * Cor das estrelas. Suporta qualquer valor CSS válido de cor.
   * A opacidade de cada estrela é controlada individualmente pelo canvas —
   * prefira passar uma cor sem canal alpha aqui (ex: `'#ffffff'` ou `'rgb(255,255,255)'`).
   * @default 'rgb(255, 255, 255)'
   */
  color?: string

  /**
   * Opacidade mínima base de cada estrela (0–1).
   * @default 0.2
   */
  minOpacity?: number

  /**
   * Opacidade máxima base de cada estrela (0–1).
   * @default 0.8
   */
  maxOpacity?: number

  /**
   * Ativa o efeito de twinkle (pulsar de opacidade).
   * @default true
   */
  twinkle?: boolean

  /**
   * Intensidade do twinkle: o quanto a opacidade oscila em torno do valor base.
   * 0 = sem oscilação (estrelas fixas mesmo com twinkle=true).
   * 1 = oscila entre 0 e o dobro do baseOpacity (pode chegar a 0 visivelmente).
   * Valores entre 0.3 e 0.6 dão resultado mais natural.
   * @default 0.5
   */
  twinkleIntensity?: number

  /**
   * Velocidade mínima do twinkle em ciclos por segundo.
   * @default 0.1
   */
  minTwinkleSpeed?: number

  /**
   * Velocidade máxima do twinkle em ciclos por segundo.
   * @default 0.4
   */
  maxTwinkleSpeed?: number

  /**
   * Se `true`, o canvas fica com `position: fixed`, cobrindo a viewport inteira.
   * Se `false` (padrão), o canvas fica com `position: absolute` e cobre o pai.
   * O pai deve ter `position: relative` e dimensões definidas.
   * @default false
   */
  fixed?: boolean

  /**
   * Aplica fade de transparência nas bordas superior e inferior do canvas.
   * Valor em % da altura total. 0 desativa.
   * @default 0
   */
  fadeEdgePercent?: number

  /**
   * zIndex do canvas.
   * @default 0
   */
  zIndex?: number

  /**
   * Classe CSS extra aplicada ao canvas.
   */
  className?: string
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

/**
 * `StarField`
 *
 * Canvas animado de estrelas com twinkle opcional.
 * Pensado como camada de background — coloque dentro do componente
 * que define a área visual (pai com `position: relative`).
 *
 * API consistente com `MeteorShower`: mesmos padrões de props,
 * mesmo modelo de posicionamento (absolute/fixed), mesmo hook de resize.
 * Os dois podem ser usados juntos sem conflito.
 *
 * @example
 * // Estrelas cobrindo o pai
 * <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
 *   <StarField count={150} color="#fff" twinkle twinkleIntensity={0.4} />
 *   <StarField count={30} color="rgb(180,220,255)" minRadius={1} maxRadius={3} twinkle={false} />
 * </div>
 *
 * @example
 * // Junto com MeteorShower
 * <div style={{ position: 'relative', width: '100%', height: '100%' }}>
 *   <StarField zIndex={0} count={120} />
 *   <MeteorShower zIndex={1} angle={30} color="rgba(76,201,240,0.9)" />
 * </div>
 */
export const StarField = ({
  count = 120,
  minRadius = 0.3,
  maxRadius = 1.5,
  color = 'rgb(255, 255, 255)',
  minOpacity = 0.2,
  maxOpacity = 0.8,
  twinkle = true,
  twinkleIntensity = 0.5,
  minTwinkleSpeed = 0.1,
  maxTwinkleSpeed = 0.4,
  fixed = false,
  fadeEdgePercent = 0,
  zIndex = 0,
  className,
}: StarFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const windowSize = useWindowSize()
  const sizeRef = useRef({ W: 0, H: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let stars: StarParticle[] = []

    // ── Cria uma estrela com posição aleatória dentro da tela ──────
    const spawnStar = (W: number, H: number): StarParticle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      radius: minRadius + Math.random() * (maxRadius - minRadius),
      baseOpacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
      phase: Math.random() * Math.PI * 2,
      // Converte ciclos/s para rad/ms: speed_rad_ms = cycles_per_s * 2π / 1000
      twinkleSpeed: ((minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)) * Math.PI * 2) / 1000,
    })

    // ── Aplica tamanho e redistribui estrelas ──────────────────────
    const applySize = (W: number, H: number) => {
      if (W === 0 || H === 0) return
      sizeRef.current = { W, H }
      canvas.width = W
      canvas.height = H
      stars = Array.from({ length: count }, () => spawnStar(W, H))
    }

    // ── Modo fixed: windowSize do hook; modo absolute: ResizeObserver ──
    let observer: ResizeObserver | null = null

    if (fixed) {
      applySize(windowSize.width || window.innerWidth, windowSize.height || window.innerHeight)
    } else {
      const parent = canvas.parentElement
      if (parent) {
        observer = new ResizeObserver(entries => {
          const { width, height } = entries[0].contentRect
          applySize(width, height)
        })
        observer.observe(parent)
        applySize(parent.clientWidth, parent.clientHeight)
      }
    }

    // ── Loop de animação ───────────────────────────────────────────
    const draw = (timestamp: number) => {
      const { W, H } = sizeRef.current
      if (W === 0 || H === 0) {
        animFrame = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, W, H)

      stars.forEach(star => {
        let opacity: number

        if (twinkle) {
          // Oscila em torno do baseOpacity com amplitude = baseOpacity * intensity
          // sin vai de -1 a 1, então a opacidade fica em [base - amp, base + amp]
          const amplitude = star.baseOpacity * twinkleIntensity
          opacity = star.baseOpacity + amplitude * Math.sin(timestamp * star.twinkleSpeed + star.phase)
          // Clamp para nunca sair de [0, 1]
          opacity = Math.max(0, Math.min(1, opacity))
        } else {
          opacity = star.baseOpacity
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })

      animFrame = requestAnimationFrame(draw)
    }

    animFrame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrame)
      observer?.disconnect()
    }
  }, [
    count,
    minRadius,
    maxRadius,
    color,
    minOpacity,
    maxOpacity,
    twinkle,
    twinkleIntensity,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    fixed,
    windowSize.width,
    windowSize.height,
  ])

  const edgeFade =
    fadeEdgePercent > 0
      ? `linear-gradient(to bottom, transparent 0%, black ${fadeEdgePercent}%, black ${100 - fadeEdgePercent}%, transparent 100%)`
      : undefined

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
        maskImage: edgeFade,
        WebkitMaskImage: edgeFade,
      }}
    />
  )
}

export default StarField
