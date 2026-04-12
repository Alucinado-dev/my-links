import './globals.css'

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'

import Background from '@/components/backgrounds/background'

const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: 'Links | Lucino Campos',
  description:
    'Links de redes sociais e portfólio de Lucino Campos, desenvolvedor web que adora criar projetos inovadores e compartilhar conhecimento. Siga-me para ficar por dentro das minhas últimas criações e colaborações! Seguirei aprendendo e evoluindo, e adoraria ter você nessa jornada comigo.',
  keywords: [
    'Lucino Campos',
    'desenvolvedor web',
    'portfólio',
    'redes sociais',
    'projetos inovadores',
    'compartilhar conhecimento',
  ],

  authors: [
    {
      name: 'Alucinado-dev',
      url: 'https://alucinado-dev.vercel.app/',
    },
  ],
  generator: 'Next.js',
  referrer: 'origin',
  robots: { index: true, follow: true },

  creator: 'Lucino Campos',
  publisher: 'Lucino Campos',
  openGraph: {
    title: 'Links | Lucino Campos',
    description:
      'Links de redes sociais e portfólio de Lucino Campos, desenvolvedor web que adora criar projetos inovadores e compartilhar conhecimento. Siga-me para ficar por dentro das minhas últimas criações e colaborações! Seguirei aprendendo e evoluindo, e adoraria ter você nessa jornada comigo.',
    url: url,
    siteName: 'Links | Lucino Campos',
    images: [
      {
        url: `/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Links de Lucino Campos - Imagem de Open Graph',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Links de Lucino Campos',
    description:
      'Links de redes sociais e portfólio de Lucino Campos, desenvolvedor web que adora criar projetos inovadores e compartilhar conhecimento. Siga-me para ficar por dentro das minhas últimas criações e colaborações! Seguirei aprendendo e evoluindo, e adoraria ter você nessa jornada comigo.',
    images: [`${url}/og-image.png`],
  },
  alternates: {
    canonical: url,
  },
  appleWebApp: {
    capable: true,
    title: 'Links | Lucino Campos',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'Links de Lucino Campos',

  pinterest: {
    richPin: true,
  },
  category: 'Link-tree',
  classification: 'Links de redes sociais e portfólio de Lucino Campos',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a12',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className='relative flex min-h-full flex-col'>
        <Background />
        {children}
        <Script
          src='https://cdn.counter.dev/script.js'
          data-id='33f78ff6-536a-45bc-92b9-1b262ec69e8d'
          data-utcoffset='-3'
          strategy='afterInteractive'
        />
      </body>
    </html>
  )
}
