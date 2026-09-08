import type { Mechanic } from '../mechanics/types'
import type { Vehicle } from '../vehicles/types'

export type JobCardStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface JobCard {
  _id: string
  jobCardNumber: string
  vehicleId: string | Vehicle
  mechanicId: string | Mechanic
  status: JobCardStatus
  customerConcern?: string
  inspectionDetails?: string
  workDetails?: string
  odometerReading?: number
  estimatedCost?: number
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface JobCardListResponse {
  jobCards: JobCard[]
  page: number
  limit: number
  total: number
}
