import { PageContainer } from '../components/layout/PageContainer'

export function SettingsPage() {
  return (
    <PageContainer title="Settings" description="Garage configuration and preferences">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Garage Information</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div>Garage Name: Apex Auto Care</div>
            <div>Contact: +91 98765 43210</div>
            <div>Location: Mumbai</div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Appearance</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div>Theme: Dark sidebar / light workspace</div>
            <div>Accent: Purple / blue</div>
            <div>Density: Comfortable</div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
