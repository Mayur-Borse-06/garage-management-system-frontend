import { z } from 'zod'
import type { JobCardStatus } from './types'

const optionalText = (label: string, maxLength: number) =>
  z.string().trim().max(maxLength, `${label} must not exceed ${maxLength} characters`)

export const invoiceItemSchema = z.object({
  description: z.string({ error: 'Description is required' }).trim().min(1, 'Description is required').max(200, 'Description must not exceed 200 characters'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().nonnegative('Unit price cannot be negative'),
}).strict()

export const invoiceDetailsSchema = z.object({
  items: z.array(invoiceItemSchema).min(1, 'Add at least one invoice item'),
  discount: z.number().nonnegative('Discount cannot be negative'),
  tax: z.number().nonnegative('Tax cannot be negative'),
  notes: optionalText('Invoice notes', 2000),
}).strict()

export const createJobCardSchema = z.object({
  vehicleId: z.string({ error: 'Vehicle is required' }).min(1, 'Vehicle is required'),
  mechanicId: z.string({ error: 'Mechanic is required' }).min(1, 'Mechanic is required'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], { error: 'Status is required' }),
  customerConcern: optionalText('Customer concern', 1000),
  inspectionDetails: optionalText('Inspection details', 1000),
  workDetails: optionalText('Work details', 1000),
  odometerReading: z.number().nonnegative('Odometer reading cannot be negative').optional(),
  estimatedCost: z.number().nonnegative('Estimated cost cannot be negative').optional(),
  notes: optionalText('Notes', 1000),
}).strict()

export const updateJobCardSchema = createJobCardSchema.partial().strict()

export const completeJobCardSchema = z.object({
  status: z.literal('COMPLETED'),
  workDetails: optionalText('Work details', 1000),
  odometerReading: z.number().nonnegative('Odometer reading cannot be negative').optional(),
  invoice: invoiceDetailsSchema,
}).strict()

export type JobCardFormValues = {
  vehicleId: string
  mechanicId: string
  status: JobCardStatus
  customerConcern: string
  inspectionDetails: string
  workDetails: string
  odometerReading?: number
  estimatedCost?: number
  notes: string
}
export type CreateJobCardPayload = z.output<typeof createJobCardSchema>
export type UpdateJobCardPayload = z.output<typeof updateJobCardSchema>
export type CompleteJobCardPayload = z.output<typeof completeJobCardSchema>

export interface CompleteJobCardFormValues {
  status: 'COMPLETED'
  workDetails: string
  odometerReading?: number
  invoice: {
    items: Array<{ description: string; quantity: number; unitPrice: number }>
    discount: number
    tax: number
    notes: string
  }
}
