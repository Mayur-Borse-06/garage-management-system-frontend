import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Wrench } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { createMechanicSchema, type MechanicFormValues, type MechanicPayload } from '../schemas'

interface MechanicFormProps {
  defaultValues: MechanicFormValues
  submitLabel: string
  submittingLabel: string
  isSubmitting?: boolean
  onSubmit: (mechanicPayload: MechanicPayload) => void
}

const inputClassName =
  'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'

function FieldError({ message }: { message?: unknown }) {
  return typeof message === 'string' ? <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p> : null
}

export function MechanicForm({ defaultValues, submitLabel, submittingLabel, isSubmitting = false, onSubmit }: MechanicFormProps) {
  const { register, reset, handleSubmit, formState: { errors } } = useForm<MechanicFormValues>({
    resolver: zodResolver(createMechanicSchema),
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Wrench className="h-5 w-5" /></div>
          <div><h2 className="text-lg font-bold text-slate-900">Mechanic Information</h2><p className="mt-1 text-sm text-slate-500">Add the mechanic&apos;s contact and specialty details.</p></div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Name <span className="text-rose-500">*</span><input {...register('name')} placeholder="e.g. Amit Kumar" className={inputClassName} autoComplete="name" /><FieldError message={errors.name?.message} /></label>
          <label className="text-sm font-medium text-slate-700">Phone number <span className="text-rose-500">*</span><input {...register('phone')} placeholder="e.g. +91 99887 66554" className={inputClassName} autoComplete="tel" /><FieldError message={errors.phone?.message} /></label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">Specialization<input {...register('specialization')} placeholder="e.g. Engine Diagnostics" className={inputClassName} /><FieldError message={errors.specialization?.message} /></label>
        </div>
      </section>
      <div className="flex justify-end"><Button type="submit" disabled={isSubmitting} icon={<Check className="h-4 w-4" />}>{isSubmitting ? submittingLabel : submitLabel}</Button></div>
    </form>
  )
}
