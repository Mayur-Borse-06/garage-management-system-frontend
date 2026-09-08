import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { CompleteJobCardModal } from '../components/CompleteJobCardModal'
import { useMechanicsData } from '../../mechanics/hooks'
import type { Mechanic } from '../../mechanics/types'
import { useVehiclesData } from '../../vehicles/hooks'
import type { Vehicle } from '../../vehicles/types'
import { useJobCardData, useUpdateJobCard, useUpdateJobCardStatus } from '../hooks'
import type { CompleteJobCardPayload } from '../schemas'
import type { JobCard, JobCardStatus } from '../types'

const statuses: JobCardStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

const vehicleInfo = (jobCard: JobCard, vehicles: Vehicle[]) => {
  if (typeof jobCard.vehicleId !== 'string') return `${jobCard.vehicleId.manufacturer} ${jobCard.vehicleId.model} (${jobCard.vehicleId.registrationNumber})`
  const vehicle = vehicles.find((item) => item._id === jobCard.vehicleId)
  return vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.registrationNumber})` : jobCard.vehicleId
}

const mechanicInfo = (jobCard: JobCard, mechanics: Mechanic[]) => {
  if (typeof jobCard.mechanicId !== 'string') return jobCard.mechanicId.name
  return mechanics.find((item) => item._id === jobCard.mechanicId)?.name ?? jobCard.mechanicId
}

function StatusUpdateControls({ jobCard, onComplete }: { jobCard: JobCard; onComplete: () => void }) {
  const updateStatusMutation = useUpdateJobCardStatus()
  const [status, setStatus] = useState<JobCardStatus>(jobCard.status)

  useEffect(() => setStatus(jobCard.status), [jobCard.status])

  return (
    <div className="flex items-end gap-2">
      <label className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        Change status
        <select
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value as JobCardStatus
            if (nextStatus === 'COMPLETED') {
              setStatus(jobCard.status)
              onComplete()
              return
            }
            setStatus(nextStatus)
          }}
          disabled={jobCard.status === 'COMPLETED' || updateStatusMutation.isPending}
          className="mt-1 block h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal normal-case tracking-normal text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {statuses.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}
        </select>
      </label>
      <Button size="sm" onClick={() => updateStatusMutation.mutate({ jobCardId: jobCard._id, status })} disabled={jobCard.status === 'COMPLETED' || updateStatusMutation.isPending || status === jobCard.status}>
        {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
      </Button>
    </div>
  )
}

export default function JobCardDetailsPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: jobCard, isLoading, isError } = useJobCardData(id)
  const [completionOpen, setCompletionOpen] = useState(false)
  const completeMutation = useUpdateJobCard(id)
  const { data: vehicleData } = useVehiclesData()
  const { data: mechanicData } = useMechanicsData({ page: 1, limit: 100 })
  const vehicles = vehicleData?.vehicles ?? []
  const mechanics = mechanicData?.mechanics ?? []

  const handleCompletionSubmit = (payload: CompleteJobCardPayload) => {
    completeMutation.mutate(payload, { onSuccess: () => setCompletionOpen(false) })
  }

  return (
    <PageContainer
      title={jobCard?.jobCardNumber || 'Job Card Details'}
      description="Review service job information"
      actions={<Link to="/job-cards"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Job Cards</Button></Link>}
    >
      {isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading job card...</div> : null}
      {isError || !jobCard ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">Unable to load this job card.</div> : null}
      {jobCard ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job card number</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{jobCard.jobCardNumber}</div>
              <div className="mt-3"><StatusBadge status={jobCard.status} /></div>
            </div>
            <StatusUpdateControls jobCard={jobCard} onComplete={() => setCompletionOpen(true)} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">Vehicle and Mechanic</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div><span className="font-semibold">Vehicle:</span> {vehicleInfo(jobCard, vehicles)}</div>
                <div><span className="font-semibold">Mechanic:</span> {mechanicInfo(jobCard, mechanics)}</div>
                {typeof jobCard.mechanicId !== 'string' ? <div><span className="font-semibold">Mechanic phone:</span> {jobCard.mechanicId.phone}</div> : null}
                {typeof jobCard.mechanicId !== 'string' ? <div><span className="font-semibold">Specialization:</span> {jobCard.mechanicId.specialization || '-'}</div> : null}
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">Service Details</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div><span className="font-semibold">Customer concern:</span> {jobCard.customerConcern || '-'}</div>
                <div><span className="font-semibold">Inspection:</span> {jobCard.inspectionDetails || '-'}</div>
                <div><span className="font-semibold">Work:</span> {jobCard.workDetails || '-'}</div>
                <div><span className="font-semibold">Odometer:</span> {jobCard.odometerReading ?? '-'}</div>
                <div><span className="font-semibold">Estimated cost:</span> {jobCard.estimatedCost ?? '-'}</div>
                <div><span className="font-semibold">Notes:</span> {jobCard.notes || '-'}</div>
              </div>
            </section>
          </div>
        </div>
      ) : null}
      {jobCard ? <CompleteJobCardModal open={completionOpen} jobCardNumber={jobCard.jobCardNumber} isSubmitting={completeMutation.isPending} onClose={() => setCompletionOpen(false)} onSubmit={handleCompletionSubmit} /> : null}
    </PageContainer>
  )
}
