import { useQuery } from '@tanstack/react-query'
import { getDashboard } from './api'

const dashboardQueryKey = ['dashboard']

const useDashboardData = () =>
  useQuery({
    queryKey: dashboardQueryKey,
    queryFn: () => getDashboard(),
  })

export { useDashboardData }