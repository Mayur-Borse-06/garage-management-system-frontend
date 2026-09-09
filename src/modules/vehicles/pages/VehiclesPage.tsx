import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { useDeleteVehicle, useVehiclesData } from '../hooks'
import type { Vehicle } from '../types'

const customerName = (vehicle: Vehicle) => typeof vehicle.customerId === 'string' ? vehicle.customerId : vehicle.customerId.fullName

function VehicleDetails({ vehicle }: { vehicle: Vehicle }) {
  return <div className="grid gap-4 sm:grid-cols-2">
    {[
      ['Registration number', vehicle.registrationNumber], ['Customer', customerName(vehicle)], ['Vehicle type', vehicle.vehicleType],
      ['Manufacturer', vehicle.manufacturer], ['Model', vehicle.model], ['Variant', vehicle.variant || '-'],
      ['Year', vehicle.manufacturingYear || '-'], ['Fuel', vehicle.fuelType || '-'], ['Color', vehicle.color || '-'],
      ['Odometer', vehicle.odometerReading ?? '-'], ['Notes', vehicle.notes || '-'],
    ].map(([label, value]) => <div key={label} className="sm:col-span-1"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm text-slate-700">{value}</div></div>)}
  </div>
}

export default function VehiclesPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data } = useVehiclesData({ page, limit })
  const deleteVehicleMutation = useDeleteVehicle()
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const vehicles = data?.vehicles ?? []
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit))

  const confirmDelete = (vehicle: Vehicle) => {
    const toastId = toast.warning(<div><div className="font-semibold text-slate-800">Deactivate {vehicle.registrationNumber}?</div><div className="mt-1 text-sm text-slate-600">This vehicle will no longer appear in active records.</div><div className="mt-3 flex justify-end gap-2"><button type="button" className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100" onClick={() => toast.dismiss(toastId)}>Cancel</button><button type="button" className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700" onClick={() => { toast.dismiss(toastId); deleteVehicleMutation.mutate(vehicle._id) }}>Yes, deactivate</button></div></div>, { autoClose: false, closeOnClick: false, closeButton: false })
  }

  return <PageContainer title="Vehicles" description="Track all workshop vehicles" actions={<Link to="/vehicles/new"><Button>Add Vehicle</Button></Link>}>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
      <div className="mb-4 flex items-center justify-between"><div className="text-sm text-slate-500">Vehicle inventory</div><div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Active vehicles</div></div>
      <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 font-medium">Registration No.</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Vehicle</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Fuel</th><th className="pb-3 font-medium">Year</th><th className="pb-3 font-medium">Actions</th></tr></thead><tbody>{vehicles.length ? vehicles.map((vehicle) => <tr key={vehicle._id} className="border-b border-slate-100 last:border-0"><td className="py-3 font-medium text-slate-800">{vehicle.registrationNumber}</td><td className="py-3 text-slate-600">{customerName(vehicle)}</td><td className="py-3 text-slate-600">{vehicle.manufacturer} {vehicle.model}</td><td className="py-3 text-slate-600">{vehicle.vehicleType}</td><td className="py-3 text-slate-600">{vehicle.fuelType || '-'}</td><td className="py-3 text-slate-600">{vehicle.manufacturingYear || '-'}</td><td className="py-3"><div className="flex items-center gap-1"><button type="button" title="View vehicle" aria-label={`View ${vehicle.registrationNumber}`} onClick={() => setSelectedVehicle(vehicle)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></button><Link to={`/vehicles/${vehicle._id}/edit`} title="Edit vehicle" aria-label={`Edit ${vehicle.registrationNumber}`} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Pencil className="h-4 w-4" /></Link><button type="button" title="Deactivate vehicle" aria-label={`Deactivate ${vehicle.registrationNumber}`} onClick={() => confirmDelete(vehicle)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>) : <tr><td colSpan={7} className="py-10 text-center text-slate-600">No vehicles available.</td></tr>}</tbody></table></div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>
    </div>
    <Modal open={selectedVehicle !== null} title="Vehicle Details" onClose={() => setSelectedVehicle(null)}>{selectedVehicle ? <VehicleDetails vehicle={selectedVehicle} /> : null}</Modal>
  </PageContainer>
}
