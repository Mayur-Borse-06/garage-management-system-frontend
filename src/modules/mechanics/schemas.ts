import { z } from 'zod'

const optionalText = z.string().trim().max(100, 'Specialization must not exceed 100 characters')

export const createMechanicSchema = z
  .object({
    name: z.string({ error: 'Name is required' }).trim().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
    phone: z.string({ error: 'Phone number is required' }).trim().min(1, 'Phone number is required').max(15, 'Phone number must not exceed 15 characters'),
    specialization: optionalText,
  })
  .strict()

export const updateMechanicSchema = createMechanicSchema.partial().strict()

export type MechanicPayload = z.infer<typeof createMechanicSchema>
export type MechanicFormValues = MechanicPayload
export type UpdateMechanicPayload = z.infer<typeof updateMechanicSchema>
