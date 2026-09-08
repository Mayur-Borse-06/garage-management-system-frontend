import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/StatusBadge'

export function JobCardsPage() {
  return (
    <PageContainer title="Job Cards" description="Track service progress and scheduled work" actions={<Button>Add Job Card</Button>}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">Open and active jobs</div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Status filter</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Job Card No.</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Mechanic</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Odometer</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 last:border-0">
                <td className="py-3 font-medium text-slate-800">JC-0001</td>
                <td className="py-3 text-slate-600">MH12 AB 1234</td>
                <td className="py-3 text-slate-600">Ramesh Sharma</td>
                <td className="py-3 text-slate-600">Amit Kumar</td>
                <td className="py-3"><StatusBadge status="OPEN" /></td>
                <td className="py-3 text-slate-600">12,450</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}
