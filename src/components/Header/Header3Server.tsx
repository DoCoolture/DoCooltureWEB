import { getCurrencies, getLanguages } from '@/data/navigation'
import { ListingType } from '@/type'
import Header3 from './Header3'

interface Header3ServerProps {
  hasBorderBottom?: boolean
  className?: string
  initSearchFormTab: ListingType
}

const Header3Server = async ({ hasBorderBottom, className, initSearchFormTab }: Header3ServerProps) => {
  const [currencies, languages] = await Promise.all([getCurrencies(), getLanguages()])
  return (
    <Header3
      hasBorderBottom={hasBorderBottom}
      className={className}
      initSearchFormTab={initSearchFormTab}
      currencies={currencies}
      languages={languages}
    />
  )
}

export default Header3Server
