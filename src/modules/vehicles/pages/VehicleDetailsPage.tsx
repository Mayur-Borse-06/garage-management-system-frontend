import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { useVehicleData } from '../hooks'
import type { Vehicle } from '../types'

const customerName = (vehicle: Vehicle) => typeof vehicle.customerId === 'string' ? vehicle.customerId : vehicle.customerId.fullName

export default function VehicleDetailsPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: vehicle, isLoading, isError } = useVehicleData(id)

  return (
    <PageContainer title="Vehicle Details" description="Review vehicle information" actions={<Link to="/vehicles"><Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to Vehicles</Button></Link>}>
      {isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading vehicle...</div> : null}
      {isError || !vehicle ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">Unable to load this vehicle.</div> : null}
      {vehicle ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
            <h2 className="text-lg font-bold text-slate-900">Vehicle Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Registration number', vehicle.registrationNumber], ['Customer', customerName(vehicle)], ['Vehicle type', vehicle.vehicleType],
                ['Manufacturer', vehicle.manufacturer], ['Model', vehicle.model], ['Variant', vehicle.variant || '-'],
                ['Manufacturing year', vehicle.manufacturingYear || '-'], ['Fuel type', vehicle.fuelType || '-'], ['Color', vehicle.color || '-'],
                ['Odometer reading', vehicle.odometerReading ?? '-'],
              ].map(([label, value]) => <div key={label}><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm text-slate-800">{value}</div></div>)}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
            <h2 className="text-lg font-bold text-slate-900">Notes</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{vehicle.notes || 'No notes added.'}</p>
            <div className="mt-8 border-t border-slate-100 pt-5"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</div><div className="mt-2 text-sm font-medium text-emerald-700">{vehicle.isActive ? 'Active' : 'Inactive'}</div></div>
          </section>
        </div>
      ) : null}
    </PageContainer>
  )
}
