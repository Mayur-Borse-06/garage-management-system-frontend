import apiClient from '../../lib/apiClient'
import type { UpdateVehiclePayload, VehiclePayload } from './schemas'
import type { Vehicle, VehicleListResponse } from './types'

interface VehicleListParams {
  page: number
  limit: number
}

const getVehicles = async (params: VehicleListParams): Promise<VehicleListResponse> => {
  const response = await apiClient.get('/api/vehicles', { params })
  return response.data.data
}

const getVehicle = async (vehicleId: string): Promise<Vehicle> => {
  const response = await apiClient.get(`/api/vehicles/${vehicleId}`)
  return response.data.data
}

const createVehicle = async (vehiclePayload: VehiclePayload) => {
  const response = await apiClient.post('/api/vehicles', vehiclePayload)
  return response.data.data
}

const updateVehicle = async (vehicleId: string, vehiclePayload: UpdateVehiclePayload) => {
  const response = await apiClient.patch(`/api/vehicles/${vehicleId}`, vehiclePayload)
  return response.data.data
}

const deleteVehicle = async (vehicleId: string) => {
  const response = await apiClient.delete(`/api/vehicles/${vehicleId}`)
  return response.data
}

export { createVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle }
export type { VehicleListParams }
