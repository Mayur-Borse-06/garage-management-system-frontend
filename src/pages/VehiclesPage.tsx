import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/Button'

export function VehiclesPage() {
  return (
    <PageContainer title="Vehicles" description="Track all workshop vehicles" actions={<Button>Add Vehicle</Button>}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">Vehicle inventory</div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Customer filter</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Registration No.</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Fuel</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 last:border-0">
                <td className="py-3 font-medium text-slate-800">MH12 AB 1234</td>
                <td className="py-3 text-slate-600">Ramesh Sharma</td>
                <td className="py-3 text-slate-600">Hyundai Creta</td>
                <td className="py-3 text-slate-600">SUV</td>
                <td className="py-3 text-slate-600">Petrol</td>
                <td className="py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}
