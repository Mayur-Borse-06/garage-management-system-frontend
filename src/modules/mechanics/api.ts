import apiClient from '../../lib/apiClient'
import type { MechanicPayload, UpdateMechanicPayload } from './schemas'
import type { Mechanic, MechanicListResponse } from './types'

interface MechanicListParams {
  page: number
  limit: number
  search?: string
}

const getMechanics = async (params: MechanicListParams): Promise<MechanicListResponse> => {
  const response = await apiClient.get('/api/mechanics', { params })
  return response.data.data
}

const getMechanic = async (mechanicId: string): Promise<Mechanic> => {
  const response = await apiClient.get(`/api/mechanics/${mechanicId}`)
  return response.data.data
}

const createMechanic = async (mechanicPayload: MechanicPayload) => {
  const response = await apiClient.post('/api/mechanics', mechanicPayload)
  return response.data.data
}

const updateMechanic = async (mechanicId: string, mechanicPayload: UpdateMechanicPayload) => {
  const response = await apiClient.patch(`/api/mechanics/${mechanicId}`, mechanicPayload)
  return response.data.data
}

const deleteMechanic = async (mechanicId: string) => {
  const response = await apiClient.delete(`/api/mechanics/${mechanicId}`)
  return response.data
}

export { createMechanic, deleteMechanic, getMechanic, getMechanics, updateMechanic }
export type { MechanicListParams }
