import { TExcludeDate, TExcludeDateIntervals } from '@/app/type'
import { addDays, subDays } from 'date-fns'

const excludeDates: TExcludeDate = [addDays(new Date(), -1), new Date('1-06-01')]
const excludeDateIntervals: TExcludeDateIntervals = [{ start: subDays(new Date(), 5000), end: subDays(new Date(), 1) }]

export { excludeDateIntervals, excludeDates }
