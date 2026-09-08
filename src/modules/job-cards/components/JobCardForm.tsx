import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ClipboardList } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { useMechanicsData } from '../../mechanics/hooks'
import { useVehiclesData } from '../../vehicles/hooks'
import { createJobCardSchema, type CreateJobCardPayload, type JobCardFormValues } from '../schemas'
import type { JobCardStatus } from '../types'

interface JobCardFormProps {
  defaultValues: JobCardFormValues
  submitLabel: string
  submittingLabel: string
  isSubmitting?: boolean
  onSubmit: (payload: CreateJobCardPayload) => void
}

const statuses: JobCardStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
const inputClassName = 'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'

function FieldError({ message }: { message?: unknown }) {
  return typeof message === 'string' ? <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p> : null
}

function vehicleLabel(vehicle: { manufacturer: string; model: string; registrationNumber: string }) {
  return `${vehicle.manufacturer} ${vehicle.model} - ${vehicle.registrationNumber}`
}

export function JobCardForm({ defaultValues, submitLabel, submittingLabel, isSubmitting = false, onSubmit }: JobCardFormProps) {
  const { data: vehicleData, isLoading: vehiclesLoading } = useVehiclesData()
  const { data: mechanicData, isLoading: mechanicsLoading } = useMechanicsData({ page: 1, limit: 100 })
  const { register, reset, handleSubmit, formState: { errors } } = useForm<JobCardFormValues, unknown, CreateJobCardPayload>({
    resolver: zodResolver(createJobCardSchema),
    defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => reset(defaultValues), [defaultValues, reset])

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)] sm:p-7">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><ClipboardList className="h-5 w-5" /></div>
          <div><h2 className="text-lg font-bold text-slate-900">Job Information</h2><p className="mt-1 text-sm text-slate-500">Select the vehicle and mechanic for this service job.</p></div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Vehicle <span className="text-rose-500">*</span><select {...register('vehicleId')} className={inputClassName}><option value="">{vehiclesLoading ? 'Loading vehicles...' : 'Select vehicle'}</option>{(vehicleData?.vehicles ?? []).map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicleLabel(vehicle)}</option>)}</select><FieldError message={errors.vehicleId?.message} /></label>
          <label className="text-sm font-medium text-slate-700">Mechanic <span className="text-rose-500">*</span><select {...register('mechanicId')} className={inputClassName}><option value="">{mechanicsLoading ? 'Loading mechanics...' : 'Select mechanic'}</option>{(mechanicData?.mechanics ?? []).map((mechanic) => <option key={mechanic._id} value={mechanic._id}>{mechanic.name} - {mechanic.specialization || 'General'}</option>)}</select><FieldError message={errors.mechanicId?.message} /></label>
          <label className="text-sm font-medium text-slate-700">Status <span className="text-rose-500">*</span><select {...register('status')} className={inputClassName}>{statuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select><FieldError message={errors.status?.message} /></label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)] sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">Service Details</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Customer concern<textarea {...register('customerConcern')} rows={3} placeholder="Describe the customer's concern" className={`${inputClassName} h-auto resize-y py-3`} /><FieldError message={errors.customerConcern?.message} /></label>
          <label className="text-sm font-medium text-slate-700">Inspection details<textarea {...register('inspectionDetails')} rows={3} placeholder="Inspection findings" className={`${inputClassName} h-auto resize-y py-3`} /><FieldError message={errors.inspectionDetails?.message} /></label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">Work details<textarea {...register('workDetails')} rows={3} placeholder="Work to be performed" className={`${inputClassName} h-auto resize-y py-3`} /><FieldError message={errors.workDetails?.message} /></label>
          <label className="text-sm font-medium text-slate-700">Odometer reading<input {...register('odometerReading', { setValueAs: (value) => value === '' ? undefined : Number(value) })} type="number" min="0" placeholder="e.g. 45000" className={inputClassName} /><FieldError message={errors.odometerReading?.message} /></label>
          <label className="text-sm font-medium text-slate-700">Estimated cost<input {...register('estimatedCost', { setValueAs: (value) => value === '' ? undefined : Number(value) })} type="number" min="0" step="0.01" placeholder="e.g. 12500" className={inputClassName} /><FieldError message={errors.estimatedCost?.message} /></label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">Notes<textarea {...register('notes')} rows={3} placeholder="Additional notes" className={`${inputClassName} h-auto resize-y py-3`} /><FieldError message={errors.notes?.message} /></label>
        </div>
      </section>
      <div className="flex justify-end"><Button type="submit" disabled={isSubmitting} icon={<Check className="h-4 w-4" />}>{isSubmitting ? submittingLabel : submitLabel}</Button></div>
    </form>
  )
}
