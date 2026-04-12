'use client'

import { useWindowSize } from '@uidotdev/usehooks'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

import BlobBackground from '@/components/backgrounds/Blobs'
import GrainNoise from '@/components/backgrounds/GrainNoise'
import { MeshBackground } from '@/components/backgrounds/MeshBackground'
import MeteorShower from '@/components/backgrounds/MeteorShower'
import StarField from '@/components/backgrounds/Starfield'

const Background = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const { width, height } = useWindowSize()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const xNebula = useTransform(mouseX, [0, width ?? 1], [-80, 80])
  const yNebula = useTransform(mouseY, [0, height ?? 1], [-80, 80])

  const xStarsFar = useTransform(mouseX, [0, width ?? 1], [-10, 10])
  const yStarsFar = useTransform(mouseY, [0, height ?? 1], [-10, 10])
  const xStarsMedium = useTransform(mouseX, [0, width ?? 1], [-40, 40])
  const yStarsMedium = useTransform(mouseY, [0, height ?? 1], [-40, 40])
  const xStarsNear = useTransform(mouseX, [0, width ?? 1], [-70, 70])
  const yStarsNear = useTransform(mouseY, [0, height ?? 1], [-70, 70])

  const xMeteorFar = useTransform(mouseX, [0, width ?? 1], [-15, 15])
  const yMeteorFar = useTransform(mouseY, [0, height ?? 1], [-15, 15])

  const xMeteorMid = useTransform(mouseX, [0, width ?? 1], [-30, 30])
  const yMeteorMid = useTransform(mouseY, [0, height ?? 1], [-30, 30])

  const xMeteorNear = useTransform(mouseX, [0, width ?? 1], [-45, 45])
  const yMeteorNear = useTransform(mouseY, [0, height ?? 1], [-45, 45])

  return (
    <>
      <MeshBackground
        fixed
        background='#020617'
        points={[
          { color: '#030712', x: 10, y: 20, spread: 70, opacity: 0.9 },
          { color: '#020617', x: 85, y: 15, spread: 70, opacity: 0.9 },
          { color: '#030712', x: 25, y: 80, spread: 70, opacity: 0.9 },
          { color: '#020617', x: 75, y: 75, spread: 70, opacity: 0.9 },

          { color: '#1e1b4b', x: 60, y: 15, spread: 35, opacity: 0.45 },
          { color: '#312e81', x: 40, y: 70, spread: 35, opacity: 0.45 },
          { color: '#0f172a', x: 90, y: 50, spread: 35, opacity: 0.35 },

          { color: '#1d1160', x: 20, y: 45, spread: 30, opacity: 0.3 },
        ]}
      />
      <GrainNoise opacity={0.03} density={0.2} zIndex={1} fixed />

      <motion.div style={{ x: xNebula, y: yNebula }} className='fixed -inset-64 mix-blend-screen'>
        <BlobBackground
          fixed
          zIndex={2}
          blobs={[
            {
              color: '#ff00bb',
              width: 700,
              x: '80%',
              y: '80%',
              blur: 140,
              opacity: 0.1,
              shape: 'organic',
            },
            {
              color: '#00ffdd',
              width: 700,
              x: '20%',
              y: '20%',
              anchorX: 'right',
              blur: 140,
              opacity: 0.1,
              shape: 'organic',
            },

            {
              color: '#ff0000',
              width: 700,
              x: '80%',
              y: '20%',
              blur: 140,
              opacity: 0.05,
              shape: 'organic',
            },
            {
              color: '#00ffff',
              width: 700,
              x: '20%',
              y: '80%',
              blur: 140,
              opacity: 0.05,
              shape: 'organic',
            },
          ]}
        />
      </motion.div>

      <motion.div style={{ x: xStarsFar, y: yStarsFar }} className='pointer-events-none fixed inset-0'>
        <StarField fixed zIndex={1} count={180} minRadius={0.2} maxRadius={0.8} twinkleIntensity={1} twinkle />
      </motion.div>

      <motion.div style={{ x: xStarsMedium, y: yStarsMedium }} className='pointer-events-none fixed inset-0'>
        <StarField fixed zIndex={2} count={90} minRadius={0.4} maxRadius={1.2} twinkleIntensity={1} twinkle />
      </motion.div>

      <motion.div style={{ x: xStarsNear, y: yStarsNear }} className='pointer-events-none fixed inset-0'>
        <StarField fixed zIndex={3} count={45} minRadius={0.8} maxRadius={1.6} twinkleIntensity={1} twinkle />
      </motion.div>

      <motion.div style={{ x: xMeteorFar, y: yMeteorFar }} className='pointer-events-none fixed -inset-96'>
        <MeteorShower
          fixed
          zIndex={3}
          count={4}
          angle={28}
          speed={4}
          minLength={70}
          maxLength={120}
          minWidth={0.6}
          maxWidth={1.2}
          opacity={0.35}
          color='rgba(180,220,255,0.7)'
        />
      </motion.div>

      <motion.div style={{ x: xMeteorMid, y: yMeteorMid }} className='pointer-events-none fixed -inset-96'>
        <MeteorShower
          fixed
          zIndex={4}
          count={6}
          angle={25}
          speed={6}
          minLength={120}
          maxLength={200}
          minWidth={1}
          maxWidth={2}
          opacity={0.6}
          color='rgba(200,230,255,0.85)'
        />
      </motion.div>

      <motion.div style={{ x: xMeteorNear, y: yMeteorNear }} className='pointer-events-none fixed -inset-96'>
        <MeteorShower
          fixed
          zIndex={5}
          count={2}
          angle={22}
          speed={8}
          minLength={180}
          maxLength={260}
          minWidth={1.8}
          maxWidth={3}
          opacity={0.9}
          color='rgba(255,255,255,0.95)'
        />
      </motion.div>
    </>
  )
}

export default Background
