import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { completeJobCardSchema, type CompleteJobCardFormValues, type CompleteJobCardPayload } from '../schemas'

interface CompleteJobCardModalProps {
  open: boolean
  jobCardNumber: string
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: CompleteJobCardPayload) => void
}

const defaultValues: CompleteJobCardFormValues = {
  status: 'COMPLETED',
  workDetails: '',
  odometerReading: undefined,
  invoice: {
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    discount: 0,
    tax: 0,
    notes: '',
  },
}

const inputClassName = 'mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100'

function FieldError({ message }: { message?: unknown }) {
  return typeof message === 'string' ? <p className="mt-1 text-xs font-medium text-rose-600">{message}</p> : null
}

export function CompleteJobCardModal({ open, jobCardNumber, isSubmitting = false, onClose, onSubmit }: CompleteJobCardModalProps) {
  const { register, reset, control, handleSubmit, formState: { errors } } = useForm<CompleteJobCardFormValues>({
    resolver: zodResolver(completeJobCardSchema),
    defaultValues,
    mode: 'onBlur',
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'invoice.items' })

  useEffect(() => {
    if (open) reset(defaultValues)
  }, [open, reset])

  return (
    <Modal open={open} title={`Complete ${jobCardNumber}`} onClose={isSubmitting ? () => undefined : onClose}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Work details
          <textarea {...register('workDetails')} rows={3} placeholder="Describe the completed work" className={`${inputClassName} h-auto resize-y py-2.5`} />
          <FieldError message={errors.workDetails?.message} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Odometer reading
          <input {...register('odometerReading', { setValueAs: (value) => value === '' ? undefined : Number(value) })} type="number" min="0" placeholder="e.g. 45230" className={inputClassName} />
          <FieldError message={errors.odometerReading?.message} />
        </label>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Invoice Items</h3>
              <p className="mt-1 text-xs text-slate-500">Add at least one final billing item.</p>
            </div>
            <Button type="button" size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>Add Item</Button>
          </div>
          <FieldError message={errors.invoice?.items?.message} />
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="grid gap-3 md:grid-cols-[1fr_100px_130px_auto] md:items-end">
                  <label className="text-xs font-semibold text-slate-600">Description<input {...register(`invoice.items.${index}.description`)} placeholder="Engine Oil" className={inputClassName} /><FieldError message={errors.invoice?.items?.[index]?.description?.message} /></label>
                  <label className="text-xs font-semibold text-slate-600">Quantity<input {...register(`invoice.items.${index}.quantity`, { setValueAs: (value) => value === '' ? 0 : Number(value) })} type="number" min="0.01" step="0.01" className={inputClassName} /><FieldError message={errors.invoice?.items?.[index]?.quantity?.message} /></label>
                  <label className="text-xs font-semibold text-slate-600">Unit price<input {...register(`invoice.items.${index}.unitPrice`, { setValueAs: (value) => value === '' ? 0 : Number(value) })} type="number" min="0" step="0.01" className={inputClassName} /><FieldError message={errors.invoice?.items?.[index]?.unitPrice?.message} /></label>
                  <button type="button" title="Remove invoice item" aria-label={`Remove invoice item ${index + 1}`} disabled={fields.length === 1} onClick={() => remove(index)} className="mb-0.5 flex h-10 items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Discount<input {...register('invoice.discount', { setValueAs: (value) => value === '' ? 0 : Number(value) })} type="number" min="0" step="0.01" className={inputClassName} /><FieldError message={errors.invoice?.discount?.message} /></label>
          <label className="text-sm font-medium text-slate-700">Tax<input {...register('invoice.tax', { setValueAs: (value) => value === '' ? 0 : Number(value) })} type="number" min="0" step="0.01" className={inputClassName} /><FieldError message={errors.invoice?.tax?.message} /></label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Invoice notes
          <textarea {...register('invoice.notes')} rows={3} placeholder="Final invoice" className={`${inputClassName} h-auto resize-y py-2.5`} />
          <FieldError message={errors.invoice?.notes?.message} />
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Completing...' : 'Complete Job Card'}</Button>
        </div>
      </form>
    </Modal>
  )
}
