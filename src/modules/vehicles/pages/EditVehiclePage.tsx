import { ArrowLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { VehicleForm } from '../components/VehicleForm'
import { useUpdateVehicle, useVehicleData } from '../hooks'
import type { VehicleFormValues, VehiclePayload } from '../schemas'

const emptyVehicle: VehicleFormValues = {
  customerId: '', registrationNumber: '', vehicleType: '', manufacturer: '', model: '', variant: '',
  manufacturingYear: undefined, fuelType: '', color: '', odometerReading: undefined, notes: '',
}

export default function EditVehiclePage() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data: vehicle, isLoading, isError } = useVehicleData(id)
  const updateVehicleMutation = useUpdateVehicle(id)

  const defaultValues = useMemo<VehicleFormValues>(() => {
    if (!vehicle) return emptyVehicle
    return {
      customerId: typeof vehicle.customerId === 'string' ? vehicle.customerId : vehicle.customerId._id,
      registrationNumber: vehicle.registrationNumber,
      vehicleType: vehicle.vehicleType,
      manufacturer: vehicle.manufacturer,
      model: vehicle.model,
      variant: vehicle.variant ?? '',
      manufacturingYear: vehicle.manufacturingYear,
      fuelType: vehicle.fuelType ?? '',
      color: vehicle.color ?? '',
      odometerReading: vehicle.odometerReading,
      notes: vehicle.notes ?? '',
    }
  }, [vehicle])

  const handleUpdate = (vehiclePayload: VehiclePayload) => {
    const { customerId: _customerId, ...updatePayload } = vehiclePayload
    updateVehicleMutation.mutate(updatePayload, { onSuccess: () => navigate('/vehicles') })
  }

  return (
    <PageContainer
      title="Edit Vehicle"
      description="Update this vehicle's information"
      actions={<Link to="/vehicles"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Vehicles</Button></Link>}
    >
      {isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading vehicle...</div> : null}
      {isError || !vehicle ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">Unable to load this vehicle.</div> : null}
      {!isLoading && !isError && vehicle ? <VehicleForm defaultValues={defaultValues} isEdit submitLabel="Save Changes" submittingLabel="Saving..." isSubmitting={updateVehicleMutation.isPending} onSubmit={handleUpdate} /> : null}
    </PageContainer>
  )
}
