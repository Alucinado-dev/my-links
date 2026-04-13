# My Links - Link Tree Pessoal com Backgrounds Especiais

> Um site de links pessoal impressionante com um sistema de backgrounds em camadas altamente customizável e visualmente
> deslumbrante.

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwindcss)

## 🎨 Sobre o Projeto

**My Links** é uma página linktre pessoal desenvolvida com tecnologias modernas, mas o que realmente destaca este
projeto é seu **sistema de backgrounds cinematográfico e altamente sofisticado** em camadas.

Ao invés de um plano de fundo estático, o projeto implementa um ecossistema visual complexo com:

- **Malha de gradientes dinâmica** que responde ao movimento do mouse
- **Efeito de "blobs" coloridos** desfocados e orgânicos
- **Campo de estrelas twinkling** com paralaxe em múltiplas camadas
- **Chuva de meteoros** animados em tempo real
- **Ruído de grão fotográfico** para adicionar textura e realismo
- **Transformações em tempo real** baseadas na posição do mouse

O resultado é uma experiência visual imersiva e moderna que transforma uma simples página de links em uma experiência
digital memorável.

## 📸 Características Principais

### 1. **Sistema de Backgrounds em Camadas** (O Destaque Principal)

O background é composto por **7 camadas independentes** que trabalham juntas:

#### 🔷 **MeshBackground** - Gradiente em Malha

```typescript
<MeshBackground
  fixed
  background='#020617'
  points={[
    { color: '#1e1b4b', x: 60, y: 15, spread: 35, opacity: 0.45 },
    { color: '#312e81', x: 40, y: 70, spread: 35, opacity: 0.45 },
  ]}
/>
```

- Cria um gradient mesh usando canvas 2D
- Interpolação suave entre múltiplos pontos de cor
- Responsivo e adaptável a diferentes tamanhos de tela
- **Cada ponto irradia sua cor** usando `radialGradient`, criando uma mistura natural

#### ✨ **StarField** - Campo de Estrelas com Twinkle

```typescript
<StarField
  fixed
  count={180}
  minRadius={0.2}
  maxRadius={0.8}
  twinkleIntensity={1}
  twinkle
/>
```

- 3 camadas paralaxe de estrelas com diferentes tamanhos
- Sincronização do movimento do mouse para efeito parallax profundo
- Twinkle (pulsação) realista com fases individuais
- Renderização eficiente em canvas com cache de partículas

#### 🌍 **BlobBackground** - Blobs Coloridos e Desfocados

```typescript
<BlobBackground
  blobs={[
    { color: '#ff00bb', width: 700, x: '80%', y: '80%', blur: 140, opacity: 0.1 },
    { color: '#00ffdd', width: 700, x: '20%', y: '20%', blur: 140, opacity: 0.1 },
  ]}
/>
```

- Formas orgânicas assimétrias com `border-radius` dinâmico
- Blur CSS para efeito de desfoque variável
- Responde ao movimento do mouse via Motion
- Suporta gradientes radiais em cores

#### 🌩️ **MeteorShower** - Chuva de Meteoros Animados

```typescript
<MeteorShower
  count={6}
  angle={25}
  speed={6}
  minLength={120}
  maxLength={200}
  color='rgba(200,230,255,0.85)'
/>
```

- 3 camadas de meteoros em diferentes velocidades e tamanhos
- Física realista de queda com ângulo dinâmico
- Efeito gradient na cauda do meteoro
- Sincronização com parallax para profundidade visual

#### 🎬 **GrainNoise** - Textura de Grão Fotográfico

```typescript
<GrainNoise opacity={0.03} density={0.2} fixed />
```

- Rúído Perlin-like renderizado em tempo real
- Adiciona textura cinematográfica ao conjunto
- Opacidade ajustável para não dominar outras camadas

### 2. **Animações e Interatividade**

- **Motion Integration**: Uso da biblioteca Motion para animações suaves
- **Mouse Tracking**: Background responde em tempo real ao movimento do mouse
- **Staggered Animations**: Ícones de tecnologia e links sociais animam em sequência
- **Glitch Text**: Títulos com efeito estilo glitch usando `Rubik_Glitch` font

### 3. **Design UI Refinado**

- **BorderBeam**: Animação de borda brilhante que circula ao redor do card principal
- **MeshText**: Texto com gradiente de malha em múltiplos pontos de cor
- **HolographicText**: Efeito holográfico em textos
- **SocialLink**: Componentes customizados para links sociais com ícones

## 🛠️ Stack Tecnológico

| Tecnologia        | Versão  | Propósito                             |
| ----------------- | ------- | ------------------------------------- |
| **Next.js**       | 16.2.2  | Framework React com SSG e otimizações |
| **React**         | 19.2.4  | Biblioteca UI moderna                 |
| **TypeScript**    | 5       | Type safety                           |
| **Tailwind CSS**  | 4       | Estilização com utility-first CSS     |
| **Motion**        | 12.38.0 | Animações declarativas e fluidas      |
| **Iconify React** | 6.0.2   | Sistema de ícones SVG                 |
| **UseHooks**      | 2.4.1   | Hooks customizados (useWindowSize)    |

## 🚀 Como Instalar e Usar

### Pré-requisitos

- Node.js 18+ ou superior
- npm, yarn, pnpm ou bun

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Alucinado-dev/my-links.git
cd my-links

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

### Build e Deploy

```bash
# Build para produção
npm run build

# Inicie o servidor de produção
npm start
```

## 📱 Como Customizar

### Personalizar Dados do Site

Edite o arquivo `src/app/layout.tsx` para alterar:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: 'Links | Lucino Campos', // ← Seu nome
  description: '...', // ← Sua descrição
  // ... mais metadata
}
```

### Personalizar Links Sociais

No arquivo `src/app/page.tsx`, altere a lista de `SocialLink`:

```typescript
<SocialLink
  socialMedia='GitHub'
  icon='mdi:github'
  src='https://github.com/seu-usuario'
/>
```

### Personalizar o Background

O arquivo principal é `src/components/backgrounds/background.tsx`. Você pode ajustar:

#### 1. **Cores do MeshBackground**

```typescript
<MeshBackground
  fixed
  background='#020617' // Cor de fundo
  points={[
    { color: '#1e1b4b', x: 60, y: 15, spread: 35, opacity: 0.45 },
    // Ajuste cores, posição (x/y%) e spread (raio de influência)
  ]}
/>
```

#### 2. **Quantidade e Tamanho das Estrelas**

```typescript
<StarField
  fixed
  count={180}          // Aumentar/diminuir quantidade
  minRadius={0.2}      // Tamanho mínimo
  maxRadius={0.8}      // Tamanho máximo
  twinkleIntensity={1} // 0-1: intensidade do piscar
/>
```

#### 3. **Velocidade e Ângulo dos Meteoros**

```typescript
<MeteorShower
  count={6}           // Quantidade simultânea
  angle={25}          // Ângulo em graus
  speed={6}           // Velocidade em px/frame
  minLength={120}     // Tamanho mínimo da cauda
  maxLength={200}     // Tamanho máximo da cauda
/>
```

#### 4. **Intensidade da Paralaxe do Mouse**

No `useTransform`, ajuste os pares de valores para mais/menos movimento:

```typescript
const xNebula = useTransform(mouseX, [0, width ?? 1], [-80, 80])
// [-80, 80] controlam o range de movimento em px
// Aumentar para paralaxe mais exagerada
// Diminuir para sutil
```

### Personalizar Cores do Card Principal

Em `src/app/page.tsx`, altere as props de `MeshText`:

```typescript
<MeshText
  points={[
    { color: '#00ffff', x: 54, y: 26, spread: 5, opacity: 0.9 },
    // Ajuste cores CSS e opacidade
  ]}
>
  Seu Nome
</MeshText>
```

## 📁 Estrutura do Projeto

```txt
src/
├── app/
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal e metadata
│   └── page.tsx             # Página home
├── components/
│   ├── backgrounds/         # ⭐ Componentes de background
│   │   ├── background.tsx   # Orquestrador principal
│   │   ├── Blobs.tsx        # BlobBackground component
│   │   ├── GrainNoise.tsx   # Textura de ruído
│   │   ├── MeshBackground.tsx # Gradient mesh
│   │   ├── MeteorShower.tsx # Chuva de meteoros
│   │   └── Starfield.tsx    # Campo de estrelas
│   └── ui/
│       ├── BorderBeam.tsx   # Borda animada brilhante
│       ├── HolographicText.tsx
│       ├── MeshText.tsx     # Texto com gradiente mesh
│       ├── ShinyBorder.tsx
│       └── SocialLink.tsx   # Link social customizado
├── container/
│   └── Container.tsx        # Wrapper responsivo
└── utils/
    └── cn.ts               # Utilidade clsx + tailwind-merge
```

## 🎯 Performance e Otimizações

- ✅ **Canvas 2D Nativo**: Backgrounds usam canvas para máxima performance
- ✅ **Memoização Eficiente**: Componentes otimizados com React.memo onde apropriado
- ✅ **ResizeObserver**: Adaptação automática a mudanças de tamanho
- ✅ **requestAnimationFrame**: Animações sincronizadas com o refresh da tela
- ✅ **Lazy Loading**: Ícones carregados bajo demanda via Iconify
- ✅ **Next.js Image Optimization**: Imagens otimizadas automaticamente

## 🎓 Conceitos Avançados Implementados

### 1. **Canvas Mesh Gradient**

Implementação de gradiente em malha usando `radialGradient` do canvas 2D, interpolando suavemente entre múltiplos pontos
de cor.

### 2. **Parallax Multi-Camada**

Uso de `useTransform` do Motion para criar efeito parallax em 3 profundidades diferentes de estrelas e meteoros.

### 3. **Ruído Procedural em Canvas**

Geração de ruído de grão fotográfico em tempo real usando `Math.random()` e `putImageData()`.

### 4. **Animações Staggered**

Uso de `containerVariants` e `itemVariants` com Motion para sequenciar animações de entrada.

### 5. **Responsive Canvas**

ResizeObserver para redimensionar canvas automaticamente quando o container muda de tamanho.

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 👤 Autor

**Lucino Campos** - Desenvolvedor Web

- GitHub: [@Alucinado-dev](https://github.com/Alucinado-dev)
- LinkedIn: [Lucino de Campos](https://www.linkedin.com/in/lucino-de-campos/)
- Instagram: [@lucino_de_campos](https://www.instagram.com/lucino_de_campos/)
- Email: lucinogabriel1510@gmail.com

## 🙏 Contribuições

Sinta-se livre para fazer fork, criar issues e submeter pull requests com melhorias!

---

**Desenvolvido com ❤️ usando Next.js**
