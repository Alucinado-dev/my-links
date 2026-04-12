'use client'

import { Icon } from '@iconify/react'
import { easeInOut, motion } from 'motion/react'
import { Audiowide, Rubik_Glitch } from 'next/font/google'
import Image from 'next/image'

import { BorderBeam } from '@/components/ui/BorderBeam'
import MeshText from '@/components/ui/MeshText'
import SocialLink from '@/components/ui/SocialLink'
import Container from '@/container/Container'
import { cn } from '@/utils/cn'

import perfil from '../assets/img/Perfil.webp'

const rubikGlitch = Rubik_Glitch({
  variable: '--font-rubik-glitch',
  subsets: ['latin'],
  weight: ['400'],
})

const audiowide = Audiowide({
  variable: '--font-audiowide',
  subsets: ['latin'],
  weight: ['400'],
})

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2, // delay entre cada filho
      delayChildren: 0.5, // delay antes de começar a animar os filhos
      easeInOut, // tipo de easing para a animação
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className='relative flex flex-1 flex-col items-center justify-center'>
      <main className='flex w-full overflow-hidden'>
        <Container isFluid className='flex flex-1 flex-col items-center justify-center'>
          <div className='relative flex w-70 flex-col items-center justify-center rounded-2xl border border-white/30 bg-black/50 p-8 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] backdrop-blur-xs sm:w-110'>
            <BorderBeam
              duration={6}
              borderWidth={3}
              size={400}
              className='from-transparent via-[#ff2ed1] to-transparent'
            />
            <BorderBeam
              duration={6}
              delay={3}
              size={400}
              borderWidth={3}
              className='from-transparent via-[#00f5ff] to-transparent'
            />
            <div className='flex flex-col items-center justify-center gap-2'>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='h-20 w-20 overflow-hidden rounded-full'
              >
                <Image src={perfil} alt='Foto de perfil de Lucino Campos' />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
              >
                <MeshText
                  as='h1'
                  className={cn(rubikGlitch.className, 'text-4xl uppercase')}
                  points={[
                    { color: '#00ffff', x: 54, y: 26, spread: 5, opacity: 0.9 },
                    { color: '#39ff14', x: 73, y: 49, spread: 5, opacity: 0.8 },
                    { color: '#0080ff', x: 37, y: 72, spread: 5, opacity: 0.7 },
                    { color: '#ff0080', x: 90, y: 34, spread: 5, opacity: 0.8 },
                    { color: '#ff00ff', x: 47, y: 55, spread: 5, opacity: 0.9 },
                    { color: '#8000ff', x: 10, y: 28, spread: 5, opacity: 0.9 },
                  ]}
                  background='#fff'
                >
                  Lucino Campos
                </MeshText>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.6 }}
              >
                <MeshText
                  as='p'
                  className={cn(audiowide.className, 'text-lg')}
                  points={[
                    { color: '#ffffff', x: 50, y: 0, spread: 90, opacity: 0.9 },
                    { color: '#00f5ff', x: 50, y: 0, spread: 50, opacity: 0.3 },
                  ]}
                >
                  Desenvolvedor Web
                </MeshText>
              </motion.div>
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='mt-4 flex items-center justify-center gap-4'
              >
                <motion.div variants={itemVariants} initial='hidden' animate='visible'>
                  <Icon icon='devicon:react' width='28' height='28' />
                </motion.div>

                <motion.div variants={itemVariants} initial='hidden' animate='visible'>
                  <Icon icon='devicon:nextjs' width='28' height='28' />
                </motion.div>

                <motion.div variants={itemVariants} initial='hidden' animate='visible'>
                  <Icon icon='devicon:typescript' width='28' height='28' />
                </motion.div>

                <motion.div variants={itemVariants} initial='hidden' animate='visible'>
                  <Icon icon='devicon:tailwindcss' width='28' height='28' />
                </motion.div>
              </motion.div>
            </div>

            <div className='mt-6 flex items-center justify-center'>
              <motion.ul
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='flex w-full flex-col items-start justify-center gap-4'
              >
                <SocialLink socialMedia='GitHub' icon='mdi:github' src='https://github.com/Alucinado-dev' />
                <SocialLink
                  socialMedia='LinkedIn'
                  icon='skill-icons:linkedin'
                  src='https://www.linkedin.com/in/lucino-de-campos/'
                />

                <SocialLink
                  socialMedia='Instagram'
                  icon='skill-icons:instagram'
                  src='https://www.instagram.com/lucino_de_campos/'
                />
                <SocialLink socialMedia='Email' icon='logos:google-gmail' src='lucinogabriel1510@gmail.com' />
              </motion.ul>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
