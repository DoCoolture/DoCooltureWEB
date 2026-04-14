import { FC } from 'react'

interface SaleOffBadgeProps {
  className?: string
  desc?: string
}

const SaleOffBadge: FC<SaleOffBadgeProps> = ({ className = '', desc = '-10% today' }) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full border border-red-100 bg-red-50 px-3 py-0.5 text-xs font-medium text-red-600 ${className}`}
    >
      {desc}
    </div>
  )
}

export default SaleOffBadge
