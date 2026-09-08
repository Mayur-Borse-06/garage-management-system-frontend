import { Eye, Pencil, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { useDeleteMechanic, useMechanicsData } from '../hooks'
import type { Mechanic } from '../types'

function MechanicDetails({ mechanic }: { mechanic: Mechanic }) {
  return <div className="grid gap-5 sm:grid-cols-2"><div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</div><div className="mt-1 text-sm font-medium text-slate-800">{mechanic.name}</div></div><div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</div><div className="mt-1 text-sm font-medium text-emerald-700">{mechanic.isActive ? 'Active' : 'Inactive'}</div></div><div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</div><div className="mt-1 text-sm text-slate-700">{mechanic.phone}</div></div><div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Specialization</div><div className="mt-1 text-sm text-slate-700">{mechanic.specialization || '-'}</div></div></div>
}

export default function MechanicsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null)
  const mutation = useDeleteMechanic()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { setSearch(searchInput.trim()); setPage(1) }, 350)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const { data, isLoading, isError } = useMechanicsData({ page, limit, ...(search ? { search } : {}) })
  const mechanics = data?.mechanics ?? []
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit))

  const confirmDelete = (mechanic: Mechanic) => {
    const toastId = toast.warning(<div><div className="font-semibold text-slate-800">Deactivate {mechanic.name}?</div><div className="mt-1 text-sm text-slate-600">This mechanic will no longer appear in active records.</div><div className="mt-3 flex justify-end gap-2"><button type="button" className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100" onClick={() => toast.dismiss(toastId)}>Cancel</button><button type="button" className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700" onClick={() => { toast.dismiss(toastId); mutation.mutate(mechanic._id) }}>Yes, deactivate</button></div></div>, { autoClose: false, closeOnClick: false, closeButton: false })
  }

  return <PageContainer title="Mechanics" description="Manage your workshop specialists" actions={<Link to="/mechanics/new"><Button>Add Mechanic</Button></Link>}>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm text-slate-500">Active mechanics</div><label className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search mechanics..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></label></div>
      <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Phone</th><th className="pb-3 font-medium">Specialization</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Actions</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={5} className="py-10 text-center text-slate-500">Loading mechanics...</td></tr> : isError ? <tr><td colSpan={5} className="py-10 text-center text-rose-600">Unable to load mechanics.</td></tr> : mechanics.length ? mechanics.map((mechanic) => <tr key={mechanic._id} className="border-b border-slate-100 last:border-0"><td className="py-3 font-medium text-slate-800">{mechanic.name}</td><td className="py-3 text-slate-600">{mechanic.phone}</td><td className="py-3 text-slate-600">{mechanic.specialization || '-'}</td><td className="py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Active</span></td><td className="py-3"><div className="flex items-center gap-1"><button type="button" title="View mechanic" aria-label={`View ${mechanic.name}`} onClick={() => setSelectedMechanic(mechanic)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></button><Link to={`/mechanics/${mechanic._id}/edit`} title="Edit mechanic" aria-label={`Edit ${mechanic.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Pencil className="h-4 w-4" /></Link><button type="button" title="Deactivate mechanic" aria-label={`Deactivate ${mechanic.name}`} onClick={() => confirmDelete(mechanic)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>) : <tr><td colSpan={5} className="py-10 text-center text-slate-600">No mechanics found.</td></tr>}</tbody></table></div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>
    </div>
    <Modal open={selectedMechanic !== null} title="Mechanic Details" onClose={() => setSelectedMechanic(null)}>{selectedMechanic ? <MechanicDetails mechanic={selectedMechanic} /> : null}</Modal>
  </PageContainer>
}
