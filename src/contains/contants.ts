import { TExcludeDate, TExcludeDateIntervals } from '@/app/type'
import { addDays, subDays } from 'date-fns'

const excludeDates: TExcludeDate = []
const excludeDateIntervals: TExcludeDateIntervals = [{ start: subDays(new Date(), 5000), end: subDays(new Date(), 1) }]

export { excludeDateIntervals, excludeDates }
