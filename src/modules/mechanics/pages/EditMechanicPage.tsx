import { ArrowLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { MechanicForm } from '../components/MechanicForm'
import { useMechanicData, useUpdateMechanic } from '../hooks'
import type { MechanicFormValues, MechanicPayload } from '../schemas'

const emptyValues: MechanicFormValues = { name: '', phone: '', specialization: '' }

export default function EditMechanicPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data: mechanic, isLoading, isError } = useMechanicData(id)
  const mutation = useUpdateMechanic(id)
  const defaultValues = useMemo<MechanicFormValues>(() => mechanic ? { name: mechanic.name, phone: mechanic.phone, specialization: mechanic.specialization ?? '' } : emptyValues, [mechanic])
  const handleUpdate = (payload: MechanicPayload) => mutation.mutate(payload, { onSuccess: () => navigate('/mechanics') })

  return <PageContainer title="Edit Mechanic" description="Update this mechanic's information" actions={<Link to="/mechanics"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Mechanics</Button></Link>}>
    {isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading mechanic...</div> : null}
    {isError || !mechanic ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">Unable to load this mechanic.</div> : null}
    {!isLoading && !isError && mechanic ? <MechanicForm defaultValues={defaultValues} submitLabel="Save Changes" submittingLabel="Saving..." isSubmitting={mutation.isPending} onSubmit={handleUpdate} /> : null}
  </PageContainer>
}
