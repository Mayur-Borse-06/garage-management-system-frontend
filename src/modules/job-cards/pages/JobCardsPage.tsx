import { Eye, Pencil, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { formatDate } from '../../../utils/formatDate'
import { CompleteJobCardModal } from '../components/CompleteJobCardModal'
import { useMechanicsData } from '../../mechanics/hooks'
import type { Mechanic } from '../../mechanics/types'
import { useVehiclesData } from '../../vehicles/hooks'
import type { Vehicle } from '../../vehicles/types'
import { useDeleteJobCard, useJobCardsData, useUpdateJobCardStatus } from '../hooks'
import { useUpdateJobCard } from '../hooks'
import type { CompleteJobCardPayload } from '../schemas'
import type { JobCard, JobCardStatus } from '../types'

const statuses: JobCardStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

const vehicleText = (job: JobCard, vehicles: Vehicle[]) => {
  if (typeof job.vehicleId !== 'string') return `${job.vehicleId.manufacturer} ${job.vehicleId.model} (${job.vehicleId.registrationNumber})`
  const vehicle = vehicles.find((item) => item._id === job.vehicleId)
  return vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.registrationNumber})` : job.vehicleId
}

const mechanicText = (job: JobCard, mechanics: Mechanic[]) => {
  if (typeof job.mechanicId !== 'string') return job.mechanicId.name
  return mechanics.find((item) => item._id === job.mechanicId)?.name ?? job.mechanicId
}

const statusClassName: Record<JobCardStatus, string> = {
  OPEN: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  IN_PROGRESS: 'border-amber-200 bg-amber-50 text-amber-700',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  CANCELLED: 'border-rose-200 bg-rose-50 text-rose-700',
}

function JobCardDetails({ jobCard, vehicles, mechanics }: { jobCard: JobCard; vehicles: Vehicle[]; mechanics: Mechanic[] }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job card number</div><div className="mt-1 text-sm font-bold text-slate-800">{jobCard.jobCardNumber}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</div><div className="mt-1 text-sm font-medium text-slate-700">{jobCard.status.replace('_', ' ')}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vehicle</div><div className="mt-1 text-sm text-slate-700">{vehicleText(jobCard, vehicles)}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mechanic</div><div className="mt-1 text-sm text-slate-700">{mechanicText(jobCard, mechanics)}</div></div>
      </div>
      <div className="border-t border-slate-100 pt-5 text-sm leading-6 text-slate-700">
        <div><strong>Customer concern:</strong> {jobCard.customerConcern || '-'}</div>
        <div><strong>Work details:</strong> {jobCard.workDetails || '-'}</div>
        <div><strong>Estimated cost:</strong> {jobCard.estimatedCost ?? '-'}</div>
        <div><strong>Notes:</strong> {jobCard.notes || '-'}</div>
      </div>
    </div>
  )
}

export default function JobCardsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobCardStatus | ''>('')
  const [page, setPage] = useState(1)
  const limit = 10
  const [selectedJobCard, setSelectedJobCard] = useState<JobCard | null>(null)
  const [completionTarget, setCompletionTarget] = useState<JobCard | null>(null)
  const deleteMutation = useDeleteJobCard()
  const updateStatusMutation = useUpdateJobCardStatus()
  const completeMutation = useUpdateJobCard(completionTarget?._id ?? '')
  const { data: vehicleData } = useVehiclesData()
  const { data: mechanicData } = useMechanicsData({ page: 1, limit: 100 })
  const vehicles = vehicleData?.vehicles ?? []
  const mechanics = mechanicData?.mechanics ?? []

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 350)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const { data, isLoading, isError } = useJobCardsData({
    page,
    limit,
    ...(search ? { search } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  })
  const jobCards = data?.jobCards ?? []
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit))

  const handleStatusChange = (jobCard: JobCard, nextStatus: JobCardStatus) => {
    if (nextStatus === 'COMPLETED') {
      setCompletionTarget(jobCard)
      return
    }

    updateStatusMutation.mutate({ jobCardId: jobCard._id, status: nextStatus })
  }

  const handleCompletionSubmit = (payload: CompleteJobCardPayload) => {
    if (!completionTarget) return

    completeMutation.mutate(payload, {
      onSuccess: () => setCompletionTarget(null),
    })
  }

  const confirmDelete = (jobCard: JobCard) => {
    const toastId = toast.warning(
      <div>
        <div className="font-semibold text-slate-800">Deactivate {jobCard.jobCardNumber}?</div>
        <div className="mt-1 text-sm text-slate-600">This job card will no longer appear in active records.</div>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100" onClick={() => toast.dismiss(toastId)}>Cancel</button>
          <button type="button" className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700" onClick={() => { toast.dismiss(toastId); deleteMutation.mutate(jobCard._id) }}>Yes, deactivate</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false },
    )
  }

  return (
    <PageContainer title="Job Cards" description="Track service progress and scheduled work" actions={<Link to="/job-cards/new"><Button>Create Job Card</Button></Link>}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-slate-500">Active job cards</div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search job cards..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:w-64" />
            </label>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as JobCardStatus | ''); setPage(1) }} className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none">
              <option value="">All statuses</option>
              {statuses.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 font-medium">Job Card</th><th className="pb-3 font-medium">Vehicle</th><th className="pb-3 font-medium">Mechanic</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Created</th><th className="pb-3 font-medium">Actions</th></tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="py-10 text-center text-slate-500">Loading job cards...</td></tr> : null}
              {isError ? <tr><td colSpan={6} className="py-10 text-center text-rose-600">Unable to load job cards.</td></tr> : null}
              {!isLoading && !isError && jobCards.length ? jobCards.map((jobCard) => (
                <tr key={jobCard._id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 font-medium text-slate-800">{jobCard.jobCardNumber}</td>
                  <td className="py-3 text-slate-600">{vehicleText(jobCard, vehicles)}</td>
                  <td className="py-3 text-slate-600">{mechanicText(jobCard, mechanics)}</td>
                  <td className="py-3">
                    <select value={jobCard.status} onChange={(event) => handleStatusChange(jobCard, event.target.value as JobCardStatus)} disabled={jobCard.status === 'COMPLETED' || updateStatusMutation.isPending || completeMutation.isPending} aria-label={`Update status for ${jobCard.jobCardNumber}`} className={`h-9 min-w-[120px] rounded-lg border px-3 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70 ${statusClassName[jobCard.status]}`}>
                      {statuses.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td className="py-3 text-slate-600">{formatDate(jobCard.createdAt)}</td>
                  <td className="py-3"><div className="flex items-center gap-1"><button type="button" title="View job card" aria-label={`View ${jobCard.jobCardNumber}`} onClick={() => setSelectedJobCard(jobCard)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></button><Link to={`/job-cards/${jobCard._id}/edit`} title="Edit job card" aria-label={`Edit ${jobCard.jobCardNumber}`} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Pencil className="h-4 w-4" /></Link><button type="button" title="Deactivate job card" aria-label={`Deactivate ${jobCard.jobCardNumber}`} onClick={() => confirmDelete(jobCard)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              )) : null}
              {!isLoading && !isError && !jobCards.length ? <tr><td colSpan={6} className="py-10 text-center text-slate-600">No job cards found.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>
      </div>
      <Modal open={selectedJobCard !== null} title="Job Card Details" onClose={() => setSelectedJobCard(null)}>{selectedJobCard ? <JobCardDetails jobCard={selectedJobCard} vehicles={vehicles} mechanics={mechanics} /> : null}</Modal>
      <CompleteJobCardModal open={completionTarget !== null} jobCardNumber={completionTarget?.jobCardNumber ?? ''} isSubmitting={completeMutation.isPending} onClose={() => setCompletionTarget(null)} onSubmit={handleCompletionSubmit} />
    </PageContainer>
  )
}
