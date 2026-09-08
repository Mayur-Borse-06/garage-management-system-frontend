import { PageContainer } from '../components/layout/PageContainer'

export function ReportsPage() {
  return (
    <PageContainer title="Reports" description="Workshop performance overview">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Monthly revenue</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">₹4.6L</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Completed jobs</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">142</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Average turnaround</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">2.4 days</div>
        </div>
      </div>
    </PageContainer>
  )
}
