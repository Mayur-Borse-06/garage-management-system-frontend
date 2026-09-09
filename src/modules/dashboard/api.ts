import apiClient from '../../lib/apiClient'
import type { DashboardData } from './types'

const getDashboard = async (): Promise<DashboardData> => {
  const response = await apiClient.get('/api/dashboard')
  return response.data.data
}

export { getDashboard }