import { zodResolver } from '@hookform/resolvers/zod'
import { Check, MapPin, UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { createCustomerSchema, type CustomerPayload } from '../schemas'

interface CustomerFormProps {
  defaultValues: CustomerPayload
  submitLabel: string
  submittingLabel: string
  isSubmitting?: boolean
  onSubmit: (customerPayload: CustomerPayload) => void
}

const inputClassName =
  'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'

function FieldError({ message }: { message?: unknown }) {
  return typeof message === 'string' ? <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p> : null
}

export function CustomerForm({
  defaultValues,
  submitLabel,
  submittingLabel,
  isSubmitting = false,
  onSubmit,
}: CustomerFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerPayload>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)] sm:p-7">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
            <p className="mt-1 text-sm text-slate-500">Add the customer&apos;s primary contact details.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Full name <span className="text-rose-500">*</span>
            <input {...register('fullName')} placeholder="e.g. Ramesh Sharma" className={inputClassName} autoComplete="name" />
            <FieldError message={errors.fullName?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Phone number <span className="text-rose-500">*</span>
            <input {...register('phone')} placeholder="e.g. +91 98765 43210" className={inputClassName} autoComplete="tel" />
            <FieldError message={errors.phone?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Alternate phone
            <input {...register('alternatePhone')} placeholder="Optional alternate number" className={inputClassName} autoComplete="tel" />
            <FieldError message={errors.alternatePhone?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Email address <span className="text-rose-500">*</span>
            <input {...register('email')} type="email" placeholder="customer@example.com" className={inputClassName} autoComplete="email" />
            <FieldError message={errors.email?.message} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)] sm:p-7">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Address</h2>
            <p className="mt-1 text-sm text-slate-500">Keep location information handy for service records.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Address line
            <input {...register('address.addressLine')} placeholder="Street, building or area" className={inputClassName} autoComplete="street-address" />
            <FieldError message={errors.address?.addressLine?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            City
            <input {...register('address.city')} placeholder="Mumbai" className={inputClassName} autoComplete="address-level2" />
            <FieldError message={errors.address?.city?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            State
            <input {...register('address.state')} placeholder="Maharashtra" className={inputClassName} autoComplete="address-level1" />
            <FieldError message={errors.address?.state?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Pincode
            <input {...register('address.pincode')} placeholder="400001" className={inputClassName} inputMode="numeric" autoComplete="postal-code" />
            <FieldError message={errors.address?.pincode?.message} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)] sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">Notes</h2>
        <p className="mt-1 text-sm text-slate-500">Add useful context for your workshop team.</p>
        <label className="mt-5 block text-sm font-medium text-slate-700">
          Customer notes
          <textarea {...register('notes')} rows={4} placeholder="Preferences, reminders or other details" className={`${inputClassName} h-auto resize-y py-3`} />
          <FieldError message={errors.notes?.message} />
        </label>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} icon={<Check className="h-4 w-4" />}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
