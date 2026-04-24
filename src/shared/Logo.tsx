import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-auto' }) => {
  return (
    <Link href="/" className={`inline-block focus:ring-0 focus:outline-hidden ${className}`}>
      {/* Logo modo claro */}
      <Image
        src="/logo-light.svg"
        alt="DoCoolture"
        width={160}
        height={37}
        className="block dark:hidden"
        priority
      />
      {/* Logo modo oscuro */}
      <Image
        src="/logo-dark.svg"
        alt="DoCoolture"
        width={160}
        height={37}
        className="hidden dark:block"
        priority
      />
    </Link>
  )
}

export default Logo