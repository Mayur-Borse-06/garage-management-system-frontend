import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { createVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle, type VehicleListParams } from './api'
import type { UpdateVehiclePayload, VehiclePayload } from './schemas'

const vehiclesQueryKey = ['vehicles']

const getErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
    ? error.response.data.message
    : fallback

const useVehiclesData = (params: VehicleListParams = { page: 1, limit: 100 }) => useQuery({ queryKey: [...vehiclesQueryKey, params], queryFn: () => getVehicles(params) })

const useVehicleData = (vehicleId: string) =>
  useQuery({
    queryKey: [...vehiclesQueryKey, vehicleId],
    queryFn: () => getVehicle(vehicleId),
    enabled: Boolean(vehicleId),
  })

const useCreateVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vehiclePayload: VehiclePayload) => createVehicle(vehiclePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesQueryKey })
      toast.success('Vehicle created successfully!')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Unable to create vehicle. Please try again.')),
  })
}

const useUpdateVehicle = (vehicleId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vehiclePayload: UpdateVehiclePayload) => updateVehicle(vehicleId, vehiclePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesQueryKey })
      toast.success('Vehicle updated successfully!')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Unable to update vehicle. Please try again.')),
  })
}

const useDeleteVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vehicleId: string) => deleteVehicle(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesQueryKey })
      toast.success('Vehicle deactivated successfully!')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Unable to deactivate vehicle. Please try again.')),
  })
}

export { useCreateVehicle, useDeleteVehicle, useUpdateVehicle, useVehicleData, useVehiclesData }
