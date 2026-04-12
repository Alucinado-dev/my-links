import { cn } from '../utils/cn'

type ContainerProps = {
  children: React.ReactNode
  isFluid?: boolean
  className?: string
}

const Container: React.FC<ContainerProps> = ({ children, isFluid = false, className }) => {
  return <div className={cn('mx-auto px-4', isFluid ? 'w-full' : 'container', className)}>{children}</div>
}

export default Container
