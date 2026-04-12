import { useWindowSize } from '@uidotdev/usehooks'
import { useEffect, useRef } from 'react'

type MeteorParticle = {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  width: number
}

// ─────────────────────────────────────────────
// Props públicas
// ─────────────────────────────────────────────

export interface MeteorShowerProps {
  /**
   * Quantidade de meteoros simultâneos na tela.
   * @default 50
   */
  count?: number

  /**
   * Ângulo de queda em graus. 0 = reto pra baixo, 90 = horizontal pra direita.
   * Aceita negativos: -30 = diagonal pra esquerda.
   * @default 30
   */
  angle?: number

  /**
   * Velocidade base dos meteoros (px/frame). Um ruído aleatório é somado em cima.
   * @default 3
   */
  speed?: number

  /**
   * Variação aleatória somada à velocidade base. Evita que todos caiam em sincronia.
   * @default 2.5
   */
  speedVariance?: number

  /**
   * Comprimento mínimo da cauda do meteoro em pixels.
   * @default 80
   */
  minLength?: number

  /**
   * Comprimento máximo da cauda do meteoro em pixels.
   * @default 200
   */
  maxLength?: number

  /**
   * Largura mínima do traço do meteoro em pixels.
   * @default 1
   */
  minWidth?: number

  /**
   * Largura máxima do traço do meteoro em pixels.
   * @default 2.5
   */
  maxWidth?: number

  /**
   * Cor da ponta (cabeça) do meteoro. Suporta qualquer valor CSS válido de cor.
   * @default 'rgba(76, 201, 240, 0.9)'
   */
  color?: string

  /**
   * Cor da cauda (fade). Se não informado, a cauda funde com 'transparent'.
   * @default undefined
   */
  tailColor?: string

  /**
   * Opacidade global dos meteoros (0–1). Multiplica a opacidade individual de cada meteoro.
   * @default 1
   */
  opacity?: number

  /**
   * Opacidade mínima de cada meteoro individualmente.
   * @default 0.3
   */
  minOpacity?: number

  /**
   * Opacidade máxima de cada meteoro individualmente.
   * @default 0.8
   */
  maxOpacity?: number

  /**
   * Se `true`, o canvas fica com `position: fixed`, cobrindo a viewport inteira.
   * Se `false` (padrão), o canvas fica com `position: absolute` e cobre o pai.
   * O pai deve ter `position: relative` e dimensões definidas.
   * @default false
   */
  fixed?: boolean

  /**
   * Aplica um fade de transparência nas bordas superior e inferior do canvas.
   * Valor em % da altura total. 0 desativa.
   * @default 5
   */
  fadeEdgePercent?: number

  /**
   * zIndex do canvas.
   * @default 0
   */
  zIndex?: number

  /**
   * Classe CSS extra aplicada ao canvas (útil para `mix-blend-mode`, etc).
   */
  className?: string
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

/**
 * `MeteorShower`
 *
 * Canvas animado de meteoros caindo em diagonal.
 * Pensado como camada de background — coloque dentro do componente
 * que define a área visual (pai com `position: relative`).
 *
 * Não possui lógica de paralaxe — essa responsabilidade fica com o pai,
 * que pode envolver o componente em um `motion.div` quando necessário.
 *
 * Dimensionamento:
 * - Modo `fixed`: usa `useWindowSize` (hook baseado em evento resize)
 * - Modo `absolute`: usa `ResizeObserver` no elemento pai
 * Em ambos os casos o tamanho é armazenado em um ref e lido pelo loop
 * de animação sem causar re-renders.
 *
 * @example
 * // Cobrindo o pai (modo padrão)
 * <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
 *   <MeteorShower color="rgba(255,200,100,0.9)" angle={20} count={60} />
 *   <p style={{ position: 'relative', zIndex: 1 }}>Conteúdo</p>
 * </div>
 *
 * @example
 * // Cobrindo a viewport inteira (fixed)
 * <MeteorShower fixed color="#fff" angle={-15} speed={4} />
 *
 * @example
 * // Dois MeteorShowers sobrepostos — camadas independentes
 * <div style={{ position: 'relative', width: '100%', height: '100%' }}>
 *   <MeteorShower color="rgba(76,201,240,0.8)" angle={25} count={40} zIndex={0} />
 *   <MeteorShower color="rgba(247,37,133,0.6)" angle={-10} count={20} speed={6} zIndex={1} />
 * </div>
 */
export const MeteorShower = ({
  count = 50,
  angle = 30,
  speed = 3,
  speedVariance = 2.5,
  minLength = 80,
  maxLength = 200,
  minWidth = 1,
  maxWidth = 2.5,
  color = 'rgba(76, 201, 240, 0.9)',
  tailColor,
  opacity = 1,
  minOpacity = 0.3,
  maxOpacity = 0.8,
  fixed = false,
  fadeEdgePercent = 5,
  zIndex = 0,
  className,
}: MeteorShowerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // No modo fixed, o hook fornece o tamanho da janela reativamente.
  // Isso garante que o canvas seja redimensionado quando a janela mudar,
  // sem precisar de event listener manual dentro do useEffect do canvas.
  const windowSize = useWindowSize()

  // Tamanho atual exposto ao loop de animação via ref — sem re-render.
  const sizeRef = useRef({ W: 0, H: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let meteors: MeteorParticle[] = []

    /**
     * Cria um meteoro.
     *
     * `initial=true` → posição aleatória dentro da tela para distribuição uniforme no mount.
     *
     * `initial=false` → nasce ao longo da "linha de entrada" do ângulo.
     * A ideia: um meteoro com ângulo θ cobre a tela percorrendo uma diagonal.
     * A linha de entrada é toda a borda perpendicular à direção de movimento —
     * parametrizada por um valor t ∈ [0, 1] que representa a posição ao longo
     * dessa borda. Isso garante que qualquer ponto da tela seja alcançado com
     * igual probabilidade, independente do ângulo.
     *
     * Para ângulo de 30° (padrão): meteoros entram pela borda superior E pela esquerda.
     * O parâmetro t cobre toda a soma das duas bordas proporcionalmente ao tamanho.
     */
    const spawnMeteor = (W: number, H: number, initial = false): MeteorParticle => {
      const length = minLength + Math.random() * (maxLength - minLength)
      const w = minWidth + Math.random() * (maxWidth - minWidth)

      let x: number
      let y: number

      if (initial) {
        // Distribuição inicial: cobre toda a tela + uma margem extra além das bordas
        // para que nem todos comecem visíveis ao mesmo tempo
        const margin = length + 100
        x = -margin + Math.random() * (W + margin * 2)
        y = -margin + Math.random() * (H + margin * 2)
      } else {
        // Spawn uniforme ao longo da linha de entrada perpendicular ao ângulo.
        // Para ângulos entre 0° e 90° (diagonal pra baixo-direita):
        //   - borda de entrada superior: x ∈ [0, W], y = negativo
        //   - borda de entrada esquerda: y ∈ [0, H], x = negativo
        // Sorteia um ponto ao longo da soma das duas bordas ponderada pelo tamanho.
        const topWeight = W // comprimento da borda superior
        const leftWeight = H // comprimento da borda esquerda
        const total = topWeight + leftWeight
        const t = Math.random() * total

        const margin = length + Math.random() * 80

        if (t < topWeight) {
          // Entra pelo topo — cobre toda a largura incluindo além das bordas
          x = -margin * Math.abs(Math.cos((angle * Math.PI) / 180)) + (t / topWeight) * (W + margin)
          y = -margin
        } else {
          // Entra pela esquerda — cobre toda a altura
          x = -margin
          y = ((t - topWeight) / leftWeight) * (H + margin) - margin * Math.abs(Math.sin((angle * Math.PI) / 180))
        }
      }

      return {
        x,
        y,
        length,
        speed: speed + Math.random() * speedVariance,
        opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
        width: w,
      }
    }

    // ── Aplica tamanho e reinicia pool de meteoros ─────────────────
    const applySize = (W: number, H: number) => {
      if (W === 0 || H === 0) return
      sizeRef.current = { W, H }
      canvas.width = W
      canvas.height = H
      meteors = Array.from({ length: count }, () => spawnMeteor(W, H, true))
    }

    // ── Modo fixed: windowSize do hook ─────────────────────────────
    // ── Modo absolute: ResizeObserver no pai ───────────────────────
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
        // Inicializa com tamanho atual do pai
        applySize(parent.clientWidth, parent.clientHeight)
      }
    }

    // ── Pré-calcula ângulo uma única vez ───────────────────────────
    const RAD = (angle * Math.PI) / 180
    const cos = Math.cos(RAD)
    const sin = Math.sin(RAD)

    // ── Loop de animação ───────────────────────────────────────────
    // Lê W/H do sizeRef — nunca do DOM. Zero custo de layout query por frame.
    const draw = () => {
      const { W, H } = sizeRef.current
      if (W === 0 || H === 0) {
        animFrame = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, W, H)

      meteors.forEach(m => {
        m.x += m.speed * cos
        m.y += m.speed * sin

        // Saiu da tela — respawn fora da borda
        if (m.x > W + m.length || m.y > H + m.length) {
          Object.assign(m, spawnMeteor(W, H, false))
        }

        const headX = m.x
        const headY = m.y
        const tailX = headX - m.length * cos
        const tailY = headY - m.length * sin

        // Gradiente cauda → cabeça
        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY)
        grad.addColorStop(0, tailColor ?? 'transparent')
        grad.addColorStop(1, color)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(headX, headY)
        ctx.strokeStyle = grad
        ctx.globalAlpha = m.opacity * opacity
        ctx.lineWidth = m.width
        ctx.stroke()

        // Ponto brilhante na cabeça
        ctx.beginPath()
        ctx.arc(headX, headY, m.width * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = m.opacity * opacity * 0.9
        ctx.fill()

        ctx.globalAlpha = 1
      })

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      observer?.disconnect()
    }
  }, [
    count,
    angle,
    speed,
    speedVariance,
    minLength,
    maxLength,
    minWidth,
    maxWidth,
    color,
    tailColor,
    opacity,
    minOpacity,
    maxOpacity,
    fixed,
    // windowSize entra nas deps para que o modo fixed reaja ao resize via hook
    windowSize.width,
    windowSize.height,
  ])

  // ── Máscara de fade nas bordas ─────────────────────────────────
  const edgeFade =
    fadeEdgePercent > 0
      ? `linear-gradient(to bottom, transparent 0%, black ${fadeEdgePercent}%, black ${
          100 - fadeEdgePercent
        }%, transparent 100%)`
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

export default MeteorShower
