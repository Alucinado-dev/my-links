import { Icon } from '@iconify/react'
import { Iceland } from 'next/font/google'

import MeshText from '@/components/ui/MeshText'
import { cn } from '@/utils/cn'

const iceland = Iceland({
  variable: '--font-iceland',
  subsets: ['latin'],
  weight: ['400'],
})

const SocialLink = ({ socialMedia, icon, src }: { socialMedia: string; icon: string; src: string }) => {
  return (
    <li className='w-full'>
      <a
        className='flex w-full items-center justify-between gap-4 rounded-lg bg-black/15 px-6 py-2 text-white'
        href={src}
        target='_blank'
        rel='noopener noreferrer'
      >
        <MeshText
          as='span'
          className={cn(iceland.className, 'text-2xl')}
          points={[{ color: '#ffffff', x: 50, y: 50, spread: 130, opacity: 0.7 }]}
        >
          {socialMedia}
        </MeshText>
        <Icon icon={icon} width={24} height={24} />
      </a>
    </li>
  )
}

export default SocialLink
