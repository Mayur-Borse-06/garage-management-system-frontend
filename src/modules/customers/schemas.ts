import { z } from 'zod'

const optionalTrimmedString = z.string().trim()

export const customerAddressSchema = z
  .object({
    addressLine: optionalTrimmedString.max(200, 'Address line must not exceed 200 characters'),
    city: optionalTrimmedString.max(100, 'City must not exceed 100 characters'),
    state: optionalTrimmedString.max(100, 'State must not exceed 100 characters'),
    pincode: optionalTrimmedString.max(10, 'Pincode must not exceed 10 characters'),
  })
  .strict()

export const createCustomerSchema = z
  .object({
    fullName: z
      .string({ error: 'Full name is required' })
      .trim()
      .min(1, 'Full name is required')
      .max(100, 'Full name must not exceed 100 characters'),
    phone: z
      .string({ error: 'Phone number is required' })
      .trim()
      .min(1, 'Phone number is required')
      .max(15, 'Phone number must not exceed 15 characters'),
    alternatePhone: optionalTrimmedString.max(15, 'Alternate phone must not exceed 15 characters'),
    email: z
      .string({ error: 'Email address is required' })
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address')
      .max(254, 'Email address must not exceed 254 characters'),
    address: customerAddressSchema,
    notes: optionalTrimmedString.max(1000, 'Notes must not exceed 1000 characters'),
  })
  .strict()

export type CustomerPayload = z.infer<typeof createCustomerSchema>
