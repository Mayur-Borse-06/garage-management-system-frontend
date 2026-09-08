import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/Button'

export function MechanicsPage() {
  return (
    <PageContainer title="Mechanics" description="Manage workshop specialists" actions={<Button>Add Mechanic</Button>}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">Team roster</div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Search</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-lg font-semibold text-slate-800">Amit Kumar</div>
            <div className="mt-1 text-sm text-slate-600">+91 99887 66554</div>
            <div className="mt-3 text-sm text-indigo-600">Engine Diagnostics</div>
            <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Available</div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
