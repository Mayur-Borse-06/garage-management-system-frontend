import apiClient from '../../lib/apiClient'
import type { DashboardData, DashboardPeriod } from './types'

const getDashboard = async (period: DashboardPeriod): Promise<DashboardData> => {
  const response = await apiClient.get('/api/dashboard', { params: { period } })
  return response.data.data
}

export { getDashboard }