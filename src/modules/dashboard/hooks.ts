import { useQuery } from '@tanstack/react-query'
import { getDashboard } from './api'
import type { DashboardPeriod } from './types'

const dashboardQueryKey = ['dashboard']

const useDashboardData = (period: DashboardPeriod) =>
  useQuery({
    queryKey: [...dashboardQueryKey, period],
    queryFn: () => getDashboard(period),
  })

export { useDashboardData }