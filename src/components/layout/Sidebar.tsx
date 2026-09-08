import { CarFront, FileText, Gauge, Receipt, Truck, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Gauge },
  { label: 'Customers', to: '/customers', icon: Users },
  { label: 'Vehicles', to: '/vehicles', icon: CarFront },
  { label: 'Mechanics', to: '/mechanics', icon: Users },
  { label: 'Job Cards', to: '/job-cards', icon: FileText },
  { label: 'Invoices', to: '/invoices', icon: Receipt },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col overflow-hidden bg-[#0b1222] px-5 py-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="mb-8 flex items-center gap-3 px-2 pt-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
          <Truck className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-bold tracking-[0.34em] text-white/80">GARAGE</div>
          <div className="text-[9px] font-semibold tracking-[0.18em] text-slate-300">MANAGEMENT SYSTEM</div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-[#5c6ef8] to-[#6e53f7] text-white shadow-[0_12px_28px_rgba(92,110,248,0.42)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}
