import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { VehicleForm } from '../components/VehicleForm'
import { useCreateVehicle } from '../hooks'
import type { VehicleFormValues, VehiclePayload } from '../schemas'

const defaultValues: VehicleFormValues = {
  customerId: '',
  registrationNumber: '',
  vehicleType: '',
  manufacturer: '',
  model: '',
  variant: '',
  manufacturingYear: undefined,
  fuelType: '',
  color: '',
  odometerReading: undefined,
  notes: '',
}

export default function AddVehiclePage() {
  const navigate = useNavigate()
  const createVehicleMutation = useCreateVehicle()

  const handleCreate = (vehiclePayload: VehiclePayload) => {
    createVehicleMutation.mutate(vehiclePayload, {
      onSuccess: () => navigate('/vehicles'),
    })
  }

  return (
    <PageContainer
      title="Add Vehicle"
      description="Register a vehicle for your garage customer"
      actions={<Link to="/vehicles"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Vehicles</Button></Link>}
    >
      <VehicleForm
        defaultValues={defaultValues}
        submitLabel="Create Vehicle"
        submittingLabel="Creating..."
        isSubmitting={createVehicleMutation.isPending}
        onSubmit={handleCreate}
      />
    </PageContainer>
  )
}
