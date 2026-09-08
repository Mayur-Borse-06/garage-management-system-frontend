import { Bell, ChevronDown, Search, UserRound } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-[78px] items-center justify-between gap-6 border-b border-slate-200 bg-[#f7f8fb] px-6">
      <div className="relative w-full max-w-[440px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          aria-label="Search"
          placeholder="Search anything..."
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f3d7d7] to-[#d9e0ff] text-[#2b2f36]">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="pr-1 text-left">
            <div className="text-sm font-semibold text-slate-800">Arjun Patel</div>
            <div className="text-[11px] text-slate-500">Admin</div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </header>
  )
}
