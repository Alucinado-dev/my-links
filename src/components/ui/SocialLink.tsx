import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { Iceland } from 'next/font/google'

import MeshText from '@/components/ui/MeshText'
import { cn } from '@/utils/cn'

const iceland = Iceland({
  variable: '--font-iceland',
  subsets: ['latin'],
  weight: ['400'],
})

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}
const SocialLink = ({ socialMedia, icon, src }: { socialMedia: string; icon: string; src: string }) => {
  return (
    <motion.li
      className='relative w-full rounded-lg border border-transparent shadow-[0_6px_12px_-2px_rgba(50,50,93,0.25),0_3px_7px_-3px_rgba(0,0,0,0.3)] transition-shadow duration-300 ease-out hover:border-[#68097e] hover:shadow-[0_54px_55px_rgba(0,0,0,0.25),0_-12px_30px_rgba(0,0,0,0.12),0_4px_6px_rgba(0,0,0,0.12),0_12px_13px_rgba(0,0,0,0.17),0_-3px_5px_rgba(0,0,0,0.09)]'
      variants={itemVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    >
      <a
        className='flex w-full items-center justify-between gap-4 rounded-lg bg-black/15 px-6 py-2'
        href={src}
        target='_blank'
        rel='noopener noreferrer'
      >
        <MeshText
          as='span'
          className={cn(iceland.className, 'text-2xl hover:text-white')}
          points={[{ color: '#ffffff', x: 50, y: 50, spread: 115, opacity: 0.7 }]}
        >
          {socialMedia}
        </MeshText>
        <Icon icon={icon} width={24} height={24} />
      </a>
    </motion.li>
  )
}

export default SocialLink
