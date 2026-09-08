import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CarFront } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { useCustomersData } from '../../customers/hooks'
import { createVehicleSchema, type VehicleFormValues, type VehiclePayload } from '../schemas'

interface VehicleFormProps {
  defaultValues: VehicleFormValues
  submitLabel: string
  submittingLabel: string
  isSubmitting?: boolean
  isEdit?: boolean
  onSubmit: (vehiclePayload: VehiclePayload) => void
}

const inputClassName =
  'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60'

function FieldError({ message }: { message?: unknown }) {
  return typeof message === 'string' ? <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p> : null
}

export function VehicleForm({
  defaultValues,
  submitLabel,
  submittingLabel,
  isSubmitting = false,
  isEdit = false,
  onSubmit,
}: VehicleFormProps) {
  const { data: customerData, isLoading: isCustomersLoading } = useCustomersData()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormValues, unknown, VehiclePayload>({
    resolver: zodResolver(createVehicleSchema),
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><CarFront className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Vehicle Information</h2>
            <p className="mt-1 text-sm text-slate-500">Add the vehicle details used by your workshop.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Customer <span className="text-rose-500">*</span>
            <select {...register('customerId')} disabled={isEdit || isCustomersLoading} className={inputClassName}>
              <option value="">{isCustomersLoading ? 'Loading customers...' : 'Select customer'}</option>
              {(customerData?.customers ?? []).map((customer) => <option key={customer._id} value={customer._id}>{customer.fullName} - {customer.phone}</option>)}
            </select>
            <FieldError message={errors.customerId?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Registration number <span className="text-rose-500">*</span>
            <input {...register('registrationNumber')} placeholder="e.g. GJ05 AB 1234" className={inputClassName} />
            <FieldError message={errors.registrationNumber?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Vehicle type <span className="text-rose-500">*</span>
            <input {...register('vehicleType')} placeholder="e.g. Car, SUV or Bike" className={inputClassName} />
            <FieldError message={errors.vehicleType?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Manufacturer <span className="text-rose-500">*</span>
            <input {...register('manufacturer')} placeholder="e.g. Maruti Suzuki" className={inputClassName} />
            <FieldError message={errors.manufacturer?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Model <span className="text-rose-500">*</span>
            <input {...register('model')} placeholder="e.g. Swift" className={inputClassName} />
            <FieldError message={errors.model?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Variant
            <input {...register('variant')} placeholder="e.g. VXI" className={inputClassName} />
            <FieldError message={errors.variant?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Manufacturing year
            <input {...register('manufacturingYear', { setValueAs: (value) => value === '' ? undefined : Number(value) })} type="number" placeholder="2022" className={inputClassName} />
            <FieldError message={errors.manufacturingYear?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Fuel type
            <input {...register('fuelType')} placeholder="e.g. Petrol" className={inputClassName} />
            <FieldError message={errors.fuelType?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Color
            <input {...register('color')} placeholder="e.g. White" className={inputClassName} />
            <FieldError message={errors.color?.message} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Odometer reading
            <input {...register('odometerReading', { setValueAs: (value) => value === '' ? undefined : Number(value) })} type="number" min="0" placeholder="e.g. 45000" className={inputClassName} />
            <FieldError message={errors.odometerReading?.message} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)] sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">Notes</h2>
        <p className="mt-1 text-sm text-slate-500">Add useful information for future service visits.</p>
        <label className="mt-5 block text-sm font-medium text-slate-700">
          Vehicle notes
          <textarea {...register('notes')} rows={4} placeholder="Service reminders or other details" className={`${inputClassName} h-auto resize-y py-3`} />
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
