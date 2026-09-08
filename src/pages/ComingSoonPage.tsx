import { PageContainer } from '../components/layout/PageContainer'

interface ComingSoonPageProps {
  title: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <PageContainer title={title} description="Coming Soon">
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-[0_2px_0_rgba(15,23,42,0.02)]">
        <div className="mx-auto w-fit rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
          Coming Soon
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900">{title} management will be available once the backend module is implemented.</h2>
        <p className="mt-3 text-slate-600">This section is intentionally left as a placeholder and does not call any fake APIs.</p>
      </div>
    </PageContainer>
  )
}
