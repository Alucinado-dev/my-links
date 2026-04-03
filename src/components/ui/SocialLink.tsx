import { Icon } from '@iconify/react'

const SocialLink = ({ socialMedia, icon, src }: { socialMedia: string; icon: string; src: string }) => {
  return (
    <li>
      <a
        className='flex items-center justify-center gap-4 rounded-lg bg-red-400 px-6 py-2 text-white'
        href={src}
        target='_blank'
        rel='noopener noreferrer'
      >
        <p>{socialMedia}</p>

        <Icon icon={icon} width={24} height={24} />
      </a>
    </li>
  )
}

export default SocialLink
