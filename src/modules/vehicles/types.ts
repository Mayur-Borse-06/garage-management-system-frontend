import type { Customer } from '../customers/types'

export interface Vehicle {
  _id: string
  customerId: string | Customer
  registrationNumber: string
  vehicleType: string
  manufacturer: string
  model: string
  variant?: string
  manufacturingYear?: number
  fuelType?: string
  color?: string
  odometerReading?: number
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface VehicleListResponse {
  vehicles: Vehicle[]
  page: number
  limit: number
  total: number
}
