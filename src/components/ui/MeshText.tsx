import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useId } from 'react'

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface MeshTextPoint {
  /** Cor do ponto. Hex sem alpha — use opacity para transparência. */
  color: string
  /** Posição horizontal em % (0–100). @default 50 */
  x?: number
  /** Posição vertical em % (0–100). @default 50 */
  y?: number
  /**
   * Raio de espalhamento em % do elemento.
   * @default 60
   */
  spread?: number
  /** Opacidade do ponto (0–1). @default 1 */
  opacity?: number
}

export interface MeshTextProps {
  /** Conteúdo de texto. */
  children: ReactNode
  /** Pontos de cor que formam a malha. */
  points: MeshTextPoint[]
  /**
   * Cor de fundo da malha — aparece onde os pontos não cobrem.
   * Normalmente uma cor escura ou transparente.
   * @default 'transparent'
   */
  background?: string
  /**
   * Tag HTML a ser renderizada.
   * @default 'span'
   */
  as?: ElementType
  /** Classe CSS extra aplicada ao elemento. */
  className?: string
  /** Estilos inline extras. */
  style?: CSSProperties
}

// ─────────────────────────────────────────────
// Helper — monta a string de background
// ─────────────────────────────────────────────

const hexToRgba = (hex: string, opacity: number): string => {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean
  const n = parseInt(full, 16)
  if (isNaN(n)) return `rgba(255,255,255,${opacity})`
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const buildMeshBackground = (points: MeshTextPoint[], background: string): string => {
  const pointLayers = points.map(p => {
    const x = p.x ?? 50
    const y = p.y ?? 50
    const spread = p.spread ?? 60
    const color = hexToRgba(p.color, p.opacity ?? 1)
    // Sintaxe correta: farthest-side/corner como keyword, não % pra circle
    // Para controlar o tamanho usamos ellipse com dois valores em %
    return `radial-gradient(ellipse ${spread}% ${spread}% at ${x}% ${y}%, ${color} 0%, transparent 100%)`
  })

  // Cor sólida de fundo como última camada
  const bgLayer = `linear-gradient(${background}, ${background})`

  return [...pointLayers, bgLayer].join(', ')
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

/**
 * `MeshText`
 *
 * Aplica um mesh gradient recortado no formato do texto.
 * Mesma lógica de pontos do `MeshBackground`, mas via `background-clip: text`.
 *
 * Não usa canvas — é CSS puro, leve e sem side effects.
 *
 * @example
 * // Básico
 * <MeshText
 *   points={[
 *     { color: '#3ca2fa', x: 50, y: 0,   spread: 60, opacity: 0.9 },
 *     { color: '#f72585', x: 80, y: 80,  spread: 50, opacity: 0.8 },
 *   ]}
 * >
 *   Code & Cafe
 * </MeshText>
 *
 * @example
 * // Como h1
 * <MeshText as='h1' className='text-7xl font-bold' points={[...]}>
 *   Título
 * </MeshText>
 *
 * @example
 * // Fundo escuro visível onde os pontos não cobrem
 * <MeshText background='#0f0f11' points={[...]}>
 *   Texto
 * </MeshText>
 */
export const MeshText = ({
  children,
  points,
  background = 'transparent',
  as: Tag = 'span',
  className,
  style,
}: MeshTextProps) => {
  const uid = useId().replace(/:/g, '')
  const bg = buildMeshBackground(points, background)

  // Injeta via <style> pra evitar qualquer sanitização do React
  // em propriedades background complexas (mesmo problema do GradientBackground)
  const css = `
    .mt-${uid} {
      background: ${bg};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Tag className={`mt-${uid}${className ? ` ${className}` : ''}`} style={style}>
        {children}
      </Tag>
    </>
  )
}

export default MeshText
