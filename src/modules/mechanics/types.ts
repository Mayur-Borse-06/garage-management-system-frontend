export interface Mechanic {
  _id: string
  name: string
  phone: string
  specialization?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MechanicListResponse {
  mechanics: Mechanic[]
  page: number
  limit: number
  total: number
}
