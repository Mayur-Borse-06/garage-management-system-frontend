import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-[#eef2f8] text-slate-800">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="min-h-0 flex-1 overflow-y-auto bg-[#f3f6fb] p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
