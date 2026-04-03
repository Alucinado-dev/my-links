import Image from 'next/image'

import SocialLink from '@/components/ui/SocialLink'
import Container from '@/container/Container'

import perfil from '../assets/img/Perfil.webp'

export default function Home() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex w-full'>
        <Container isFluid>
          <div className='flex flex-col items-center justify-center'>
            <div className='flex w-full flex-col items-center justify-center'>
              <figure className='h-20 w-20 overflow-hidden rounded-full'>
                <Image src={perfil} alt='Foto de perfil de Lucino Campos' />
              </figure>

              <h1>Lucino Campos</h1>

              <p>Desenvolvedor Web | React | TypeScript | Next.js | Tailwind CSS</p>
            </div>

            <div className='mt-6 flex w-full items-center justify-center'>
              <ul className='flex w-full flex-col items-center justify-center gap-4'>
                <SocialLink socialMedia='GitHub' icon='mdi:github' src='https://github.com/Alucinado-dev' />
                <SocialLink
                  socialMedia='LinkedIn'
                  icon='mdi:linkedin'
                  src='https://www.linkedin.com/in/lucino-de-campos/'
                />

                <SocialLink
                  socialMedia='Instagram'
                  icon='mdi:instagram'
                  src='https://www.instagram.com/lucino_de_campos/'
                />
                <SocialLink socialMedia='Email' icon='logos:google-gmail' src='lucinogabriel1510@gmail.com' />
              </ul>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
