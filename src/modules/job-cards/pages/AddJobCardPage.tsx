import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { JobCardForm } from '../components/JobCardForm'
import { useCreateJobCard } from '../hooks'
import type { CreateJobCardPayload, JobCardFormValues } from '../schemas'

const defaultValues: JobCardFormValues = { vehicleId: '', mechanicId: '', status: 'OPEN', customerConcern: '', inspectionDetails: '', workDetails: '', odometerReading: undefined, estimatedCost: undefined, notes: '' }

export default function AddJobCardPage() {
  const navigate = useNavigate()
  const mutation = useCreateJobCard()
  const handleCreate = (payload: CreateJobCardPayload) => mutation.mutate(payload, { onSuccess: () => navigate('/job-cards') })
  return <PageContainer title="Create Job Card" description="Open a service job for a vehicle" actions={<Link to="/job-cards"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Job Cards</Button></Link>}><JobCardForm defaultValues={defaultValues} submitLabel="Create Job Card" submittingLabel="Creating..." isSubmitting={mutation.isPending} onSubmit={handleCreate} /></PageContainer>
}
