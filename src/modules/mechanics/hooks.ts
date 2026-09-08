import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { createMechanic, deleteMechanic, getMechanic, getMechanics, updateMechanic, type MechanicListParams } from './api'
import type { MechanicPayload, UpdateMechanicPayload } from './schemas'

const mechanicsQueryKey = ['mechanics']

const getErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
    ? error.response.data.message
    : fallback

const useMechanicsData = (params: MechanicListParams) =>
  useQuery({ queryKey: [...mechanicsQueryKey, params], queryFn: () => getMechanics(params) })

const useMechanicData = (mechanicId: string) =>
  useQuery({
    queryKey: [...mechanicsQueryKey, mechanicId],
    queryFn: () => getMechanic(mechanicId),
    enabled: Boolean(mechanicId),
  })

const useCreateMechanic = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mechanicPayload: MechanicPayload) => createMechanic(mechanicPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mechanicsQueryKey })
      toast.success('Mechanic created successfully!')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Unable to create mechanic. Please try again.')),
  })
}

const useUpdateMechanic = (mechanicId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mechanicPayload: UpdateMechanicPayload) => updateMechanic(mechanicId, mechanicPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mechanicsQueryKey })
      toast.success('Mechanic updated successfully!')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Unable to update mechanic. Please try again.')),
  })
}

const useDeleteMechanic = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mechanicId: string) => deleteMechanic(mechanicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mechanicsQueryKey })
      toast.success('Mechanic deactivated successfully!')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Unable to deactivate mechanic. Please try again.')),
  })
}

export { useCreateMechanic, useDeleteMechanic, useMechanicData, useMechanicsData, useUpdateMechanic }
