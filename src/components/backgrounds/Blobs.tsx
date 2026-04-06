import { type CSSProperties } from "react";

// ─────────────────────────────────────────────
// Tipos públicos
// ─────────────────────────────────────────────

export interface BlobConfig {
  /**
   * Cor do blob. Suporta qualquer valor CSS válido: hex, rgb, hsl, gradiente radial, etc.
   * Para gradientes use: `'radial-gradient(circle, #f72585, #7209b7)'`
   * @example 'rgb(76, 201, 240)'
   */
  color: string;

  /**
   * Largura do blob em pixels.
   * @default 400
   */
  width?: number;

  /**
   * Altura do blob em pixels. Se omitido, usa o valor de `width` (blob circular).
   * @default igual a width
   */
  height?: number;

  /**
   * Posição horizontal. Aceita qualquer valor CSS: `'50%'`, `'calc(50% - 200px)'`, `'-10%'`, etc.
   * Use em conjunto com `anchorX` para definir o ponto de ancoragem.
   * @default '50%'
   */
  x?: CSSProperties["left"];

  /**
   * Posição vertical. Aceita qualquer valor CSS.
   * Use em conjunto com `anchorY` para definir o ponto de ancoragem.
   * @default '50%'
   */
  y?: CSSProperties["top"];

  /**
   * Ponto de ancoragem horizontal do blob em relação à posição `x`.
   * `'left'`   → x define a borda esquerda do blob
   * `'center'` → x define o centro do blob
   * `'right'`  → x define a borda direita do blob
   * @default 'center'
   */
  anchorX?: "left" | "center" | "right";

  /**
   * Ponto de ancoragem vertical do blob em relação à posição `y`.
   * `'top'`    → y define a borda superior do blob
   * `'center'` → y define o centro do blob
   * `'bottom'` → y define a borda inferior do blob
   * @default 'center'
   */
  anchorY?: "top" | "center" | "bottom";

  /**
   * Opacidade do blob (0–1).
   * @default 0.15
   */
  opacity?: number;

  /**
   * Raio do blur em pixels. Controla o quanto o blob se expande e suaviza.
   * @default 80
   */
  blur?: number;

  /**
   * Formato do blob. `'circle'` mantém bordas perfeitamente redondas.
   * `'organic'` aplica um border-radius assimétrico para forma mais natural.
   * @default 'circle'
   */
  shape?: "circle" | "organic";

  /**
   * zIndex individual do blob. Útil para controlar sobreposição entre blobs.
   * @default 0
   */
  zIndex?: number;
}

export interface BlobBackgroundProps {
  /**
   * Array de configurações de blobs.
   * Cada objeto define um blob independente — cor, tamanho, posição, opacidade e blur.
   *
   * @example
   * blobs={[
   *   { color: 'rgb(76,201,240)', width: 600, x: '-10%', y: '-20%', opacity: 0.15 },
   *   { color: 'rgb(247,37,133)', width: 500, x: '100%', y: '80%', anchorX: 'right', opacity: 0.12 },
   * ]}
   */
  blobs: BlobConfig[];

  /**
   * Se `true`, o container fica com `position: fixed`, cobrindo a viewport inteira.
   * Se `false` (padrão), fica com `position: absolute` e cobre o pai.
   * O pai deve ter `position: relative` e dimensões definidas.
   * @default false
   */
  fixed?: boolean;

  /**
   * zIndex do container de blobs.
   * @default 0
   */
  zIndex?: number;

  /**
   * Classe CSS extra aplicada ao container.
   */
  className?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Converte anchorX/anchorY em `transform: translate` para centralizar corretamente.
 * Por padrão (center/center) o blob fica perfeitamente centrado no ponto x/y.
 */
const anchorToTransform = (
  anchorX: BlobConfig["anchorX"] = "center",
  anchorY: BlobConfig["anchorY"] = "center",
): string => {
  const x = anchorX === "left" ? "0%" : anchorX === "right" ? "-100%" : "-50%";
  const y = anchorY === "top" ? "0%" : anchorY === "bottom" ? "-100%" : "-50%";
  return `translate(${x}, ${y})`;
};

/**
 * border-radius assimétrico para forma orgânica.
 * Fixo mas visualmente natural — evita que todos os blobs "organic" sejam idênticos
 * usando o índice para rotacionar o padrão.
 */
const organicRadius = (index: number): string => {
  const patterns = [
    "60% 54% 87% 12% / 65% 32% 54% 98%",
    "15% 8% 79% 21% / 44% 78% 34% 61%",
    "50% 50% 30% 70% / 30% 60% 40% 70%",
    "70% 30% 50% 50% / 50% 40% 60% 50%",
  ];
  return patterns[index % patterns.length];
};

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

/**
 * `BlobBackground`
 *
 * Camada de blobs coloridos e desfocados para uso como background.
 * Implementado puramente com CSS — sem canvas, sem animação de movimento.
 * Cada blob é um `div` absolutamente posicionado com `filter: blur`.
 *
 * Não possui paralaxe — essa responsabilidade fica com o pai,
 * que pode envolver blobs individuais em `motion.div` se necessário.
 *
 * Compatível com `StarField` e `MeteorShower`: empilhe usando `zIndex`.
 *
 * @example
 * // Uso básico
 * <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
 *   <BlobBackground
 *     blobs={[
 *       { color: 'rgb(76,201,240)', width: 600, x: '-10%', y: '-20%', opacity: 0.15, blur: 100 },
 *       { color: 'rgb(247,37,133)', width: 500, x: '100%', y: '80%', anchorX: 'right', opacity: 0.12 },
 *       { color: 'rgb(114,9,183)',  width: 380, x: '60%',  y: '15%', opacity: 0.13, shape: 'organic' },
 *     ]}
 *   />
 *   <p style={{ position: 'relative', zIndex: 1 }}>Conteúdo</p>
 * </div>
 *
 * @example
 * // Junto com StarField e MeteorShower
 * <div style={{ position: 'relative', width: '100%', height: '100%' }}>
 *   <BlobBackground zIndex={0} blobs={[...]} />
 *   <StarField      zIndex={1} count={120} />
 *   <MeteorShower   zIndex={2} angle={30} color="rgba(76,201,240,0.9)" />
 * </div>
 */
export const BlobBackground = ({
  blobs,
  fixed = false,
  zIndex = 0,
  className,
}: BlobBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: fixed ? "fixed" : "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex,
      }}
    >
      {blobs.map((blob, i) => {
        const {
          color,
          width = 400,
          height,
          x = "50%",
          y = "50%",
          anchorX = "center",
          anchorY = "center",
          opacity = 0.15,
          blur = 80,
          shape = "circle",
          zIndex: blobZ = 0,
        } = blob;

        const h = height ?? width;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width,
              height: h,
              background: color,
              opacity,
              borderRadius: shape === "organic" ? organicRadius(i) : "50%",
              filter: `blur(${blur}px)`,
              transform: anchorToTransform(anchorX, anchorY),
              zIndex: blobZ,
              // Evita que o blur crie um halo além do container
              willChange: "filter",
            }}
          />
        );
      })}
    </div>
  );
};

export default BlobBackground;
