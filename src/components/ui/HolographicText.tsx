import type { ElementType, ReactNode } from 'react'
import { useId } from 'react'

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface HolographicTextProps {
  children: ReactNode
  /**
   * Velocidade da animação de shift em segundos.
   * @default 4
   */
  duration?: number
  /**
   * Intensidade do efeito iridescente (0–1).
   * 0 = quase monocromático, 1 = espectro completo vibrante.
   * @default 0.8
   */
  intensity?: number
  /**
   * Tag HTML a ser renderizada.
   * @default 'span'
   */
  as?: ElementType
  className?: string
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

/**
 * `HolographicText`
 *
 * Texto com efeito holográfico iridescente animado.
 * Simula o arco-íris de um cartão holográfico — espectro de cores
 * distribuído horizontalmente com reflexo de luz no topo,
 * animado com um shift suave pra simular mudança de ângulo.
 *
 * Não precisa de props de cor — o espectro é fixo e calibrado.
 * Use `intensity` pra controlar o quão vibrante fica.
 *
 * @example
 * <HolographicText as='h1' className='text-5xl font-bold'>
 *   Lucino Campos
 * </HolographicText>
 *
 * @example
 * // Mais sutil
 * <HolographicText intensity={0.4} duration={6}>
 *   Lucino Campos
 * </HolographicText>
 */
export const HolographicText = ({
  children,
  duration = 4,
  intensity = 0.8,
  as: Tag = 'span',
  className,
}: HolographicTextProps) => {
  const uid = useId().replace(/:/g, '')

  // Espectro holográfico — cores distribuídas horizontalmente
  // Cada cor tem opacidade modulada pela intensidade
  const o = (base: number) => Math.min(1, base * intensity)

  const css = `
    @keyframes holo-shift-${uid} {
      0%   { background-position: 0% 50%;   }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%;   }
    }

    .holo-${uid} {
      background:
        radial-gradient(ellipse 30% 80% at 50% 0%,   rgba(255,255,255,${o(0.5)}) 0%, transparent 100%),
        radial-gradient(ellipse 40% 80% at 0%   50%,  rgba(0,245,255,  ${o(0.9)}) 0%, transparent 100%),
        radial-gradient(ellipse 35% 80% at 20%  50%,  rgba(0,255,136,  ${o(0.8)}) 0%, transparent 100%),
        radial-gradient(ellipse 35% 80% at 40%  50%,  rgba(255,255,0,  ${o(0.7)}) 0%, transparent 100%),
        radial-gradient(ellipse 35% 80% at 60%  50%,  rgba(255,102,0,  ${o(0.8)}) 0%, transparent 100%),
        radial-gradient(ellipse 35% 80% at 80%  50%,  rgba(255,0,170,  ${o(0.9)}) 0%, transparent 100%),
        radial-gradient(ellipse 40% 80% at 100% 50%,  rgba(170,0,255,  ${o(0.9)}) 0%, transparent 100%),
        linear-gradient(transparent, transparent);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: holo-shift-${uid} ${duration}s ease-in-out infinite;
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Tag className={`holo-${uid}${className ? ` ${className}` : ''}`}>{children}</Tag>
    </>
  )
}

export default HolographicText
