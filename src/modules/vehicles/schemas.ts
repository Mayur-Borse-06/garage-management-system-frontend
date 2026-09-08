import { z } from 'zod'

const optionalText = (fieldName: string, maxLength: number) =>
  z.string().trim().max(maxLength, `${fieldName} must not exceed ${maxLength} characters`).optional()

const registrationNumberSchema = z
  .string({ error: 'Registration number is required' })
  .trim()
  .min(1, 'Registration number is required')
  .max(20, 'Registration number must not exceed 20 characters')
  .transform((value) => value.replace(/\s+/g, '').toUpperCase())

const customerIdSchema = z
  .string({ error: 'Customer is required' })
  .regex(/^[a-f\d]{24}$/i, 'Invalid customer')

export const createVehicleSchema = z
  .object({
    customerId: customerIdSchema,
    registrationNumber: registrationNumberSchema,
    vehicleType: z.string({ error: 'Vehicle type is required' }).trim().min(1, 'Vehicle type is required').max(50, 'Vehicle type must not exceed 50 characters'),
    manufacturer: z.string({ error: 'Manufacturer is required' }).trim().min(1, 'Manufacturer is required').max(100, 'Manufacturer must not exceed 100 characters'),
    model: z.string({ error: 'Model is required' }).trim().min(1, 'Model is required').max(100, 'Model must not exceed 100 characters'),
    variant: optionalText('Variant', 100),
    manufacturingYear: z.number().int('Manufacturing year must be a whole number').min(1886, 'Invalid manufacturing year').max(new Date().getFullYear(), 'Manufacturing year cannot be in the future').optional(),
    fuelType: optionalText('Fuel type', 30),
    color: optionalText('Color', 50),
    odometerReading: z.number().nonnegative('Odometer reading cannot be negative').optional(),
    notes: optionalText('Notes', 1000),
  })
  .strict()

export const updateVehicleSchema = createVehicleSchema.omit({ customerId: true }).partial().strict()

export type VehiclePayload = z.output<typeof createVehicleSchema>
export type VehicleFormValues = z.input<typeof createVehicleSchema>
export type UpdateVehiclePayload = z.output<typeof updateVehicleSchema>
