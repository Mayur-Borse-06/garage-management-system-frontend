import { ArrowLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { JobCardForm } from '../components/JobCardForm'
import { useJobCardData, useUpdateJobCard } from '../hooks'
import type { CreateJobCardPayload, JobCardFormValues } from '../schemas'

const emptyValues: JobCardFormValues = { vehicleId: '', mechanicId: '', status: 'OPEN', customerConcern: '', inspectionDetails: '', workDetails: '', odometerReading: undefined, estimatedCost: undefined, notes: '' }
const refId = (value: string | { _id: string }) => typeof value === 'string' ? value : value._id

export default function EditJobCardPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data: jobCard, isLoading, isError } = useJobCardData(id)
  const mutation = useUpdateJobCard(id)
  const defaultValues = useMemo<JobCardFormValues>(() => jobCard ? { vehicleId: refId(jobCard.vehicleId), mechanicId: refId(jobCard.mechanicId), status: jobCard.status, customerConcern: jobCard.customerConcern ?? '', inspectionDetails: jobCard.inspectionDetails ?? '', workDetails: jobCard.workDetails ?? '', odometerReading: jobCard.odometerReading, estimatedCost: jobCard.estimatedCost, notes: jobCard.notes ?? '' } : emptyValues, [jobCard])
  const handleUpdate = (payload: CreateJobCardPayload) => mutation.mutate(payload, { onSuccess: () => navigate('/job-cards') })
  return <PageContainer title="Edit Job Card" description="Update service job information" actions={<Link to="/job-cards"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Job Cards</Button></Link>}>{isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading job card...</div> : null}{isError || !jobCard ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">Unable to load this job card.</div> : null}{!isLoading && !isError && jobCard ? <JobCardForm defaultValues={defaultValues} submitLabel="Save Changes" submittingLabel="Saving..." isSubmitting={mutation.isPending} onSubmit={handleUpdate} /> : null}</PageContainer>
}
