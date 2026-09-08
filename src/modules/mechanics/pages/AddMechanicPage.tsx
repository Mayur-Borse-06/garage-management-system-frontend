import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { MechanicForm } from '../components/MechanicForm'
import { useCreateMechanic } from '../hooks'
import type { MechanicFormValues, MechanicPayload } from '../schemas'

const defaultValues: MechanicFormValues = { name: '', phone: '', specialization: '' }

export default function AddMechanicPage() {
  const navigate = useNavigate()
  const mutation = useCreateMechanic()
  const handleCreate = (mechanicPayload: MechanicPayload) => mutation.mutate(mechanicPayload, { onSuccess: () => navigate('/mechanics') })

  return <PageContainer title="Add Mechanic" description="Add a specialist to your workshop team" actions={<Link to="/mechanics"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Mechanics</Button></Link>}>
    <MechanicForm defaultValues={defaultValues} submitLabel="Create Mechanic" submittingLabel="Creating..." isSubmitting={mutation.isPending} onSubmit={handleCreate} />
  </PageContainer>
}
