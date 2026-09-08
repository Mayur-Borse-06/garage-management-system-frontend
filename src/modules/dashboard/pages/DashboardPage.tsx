import {
  ArrowUpRight,
  BriefcaseBusiness,
  CarFront,
  IndianRupee,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { useDashboardData } from '../hooks'
import type { DashboardData } from '../types'

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const shortDateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' })

const formatCurrency = (value: number) => currencyFormatter.format(value)

const formatShortDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : shortDateFormatter.format(date)
}

const formatChange = (changePercentage: number) => `${changePercentage > 0 ? '+' : ''}${changePercentage}% from last month`

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardData('this_month')

  return (
    <PageContainer title="Dashboard" description="Overview of your garage operations">
      {isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading dashboard...</div> : null}
      {isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-600">Unable to load dashboard.</div> : null}
      {!isLoading && !isError && data ? <DashboardContent data={data} /> : null}
    </PageContainer>
  )
}

function DashboardContent({ data }: { data: DashboardData }) {
  const overviewCards = [
    { label: 'Total Customers', value: data.overview.totalCustomers.value, change: data.overview.totalCustomers.changePercentage, icon: Users, tone: 'violet' },
    { label: 'Total Vehicles', value: data.overview.totalVehicles.value, change: data.overview.totalVehicles.changePercentage, icon: CarFront, tone: 'blue' },
    { label: 'Open Job Cards', value: data.overview.openJobCards.value, change: data.overview.openJobCards.changePercentage, icon: BriefcaseBusiness, tone: 'amber' },
    { label: 'Total Revenue', value: formatCurrency(data.overview.totalRevenue.value), change: data.overview.totalRevenue.changePercentage, icon: IndianRupee, tone: 'green' },
  ]
  const pieData = [
    { name: 'Open', value: data.jobCardStatus.OPEN, color: '#6e6df6' },
    { name: 'In Progress', value: data.jobCardStatus.IN_PROGRESS, color: '#f4bf4f' },
    { name: 'Completed', value: data.jobCardStatus.COMPLETED, color: '#4ec18b' },
    { name: 'Cancelled', value: data.jobCardStatus.CANCELLED, color: '#ec7a88' },
  ]
  const hasRevenue = data.revenue.series.length > 0
  const hasJobCards = data.recentJobCards.length > 0
  const hasInvoices = data.recentInvoices.length > 0

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
        {overviewCards.map(({ label, value, change, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
            <div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700"><Icon className={tone === 'violet' ? 'text-[#6f6ef8]' : tone === 'blue' ? 'text-[#4e9af5]' : tone === 'amber' ? 'text-[#ecb13d]' : 'text-[#2bb673]'} /></div></div>
            <div className="mt-6 text-4xl font-bold tracking-[-0.05em] text-slate-900">{value}</div>
            <div className="mt-1 text-slate-600">{label}</div>
            <div className="mt-3 flex items-center gap-1 text-sm text-emerald-600"><ArrowUpRight className="h-3.5 w-3.5" />{formatChange(change)}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-900">Revenue Overview</h2><div className="mt-1 text-4xl font-semibold tracking-[-0.06em] text-slate-900">{formatCurrency(data.revenue.total)}</div><div className="text-sm text-slate-500">Total Revenue</div></div><div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">This Month</div></div>
          <div className="h-64 w-full">{hasRevenue ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={data.revenue.series.map((point) => ({ ...point, date: formatShortDate(point.date) }))}><defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6d6ef8" stopOpacity={0.25} /><stop offset="100%" stopColor="#6d6ef8" stopOpacity={0.04} /></linearGradient></defs><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' }} formatter={(value) => formatCurrency(Number(value))} /><Area type="monotone" dataKey="value" stroke="#6d6ef8" strokeWidth={3} fill="url(#revenueFill)" /></AreaChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-slate-500">No revenue data for this period.</div>}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]"><h2 className="mb-5 text-2xl font-bold tracking-[-0.04em] text-slate-900">Job Card Status</h2><div className="flex items-center justify-center"><div className="relative h-52 w-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" innerRadius={56} outerRadius={78} paddingAngle={3}>{pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><div className="text-3xl font-bold text-slate-900">{data.jobCardStatus.total}</div><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Total</div></div></div></div><div className="mt-4 space-y-2 text-sm text-slate-700">{pieData.map((entry) => <div key={entry.name} className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} /><span>{entry.name}</span></div><span className="font-medium">{entry.value} ({data.jobCardStatus.total ? Math.round((entry.value / data.jobCardStatus.total) * 100) : 0}%)</span></div>)}</div></div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]"><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-900">Recent Job Cards</h2><Link to="/job-cards" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="pb-3 font-medium">Job Card No.</th><th className="pb-3 font-medium">Vehicle</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Mechanic</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Date</th></tr></thead><tbody>{hasJobCards ? data.recentJobCards.map((job) => <tr key={job.jobCardNumber} className="border-b border-slate-100 last:border-0"><td className="py-3 font-medium text-slate-700">{job.jobCardNumber}</td><td className="py-3 text-slate-600">{job.vehicle}</td><td className="py-3 text-slate-600">{job.customer}</td><td className="py-3 text-slate-600">{job.mechanic}</td><td className="py-3"><StatusBadge status={job.status} /></td><td className="py-3 text-slate-600">{formatShortDate(job.date)}</td></tr>) : <tr><td colSpan={6} className="py-10 text-center text-slate-600">No recent job cards.</td></tr>}</tbody></table></div></div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]"><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-900">Recent Invoices</h2><Link to="/invoices" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link></div><div className="space-y-3">{hasInvoices ? data.recentInvoices.map((invoice) => <div key={invoice.invoiceNumber} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm"><IndianRupee className="h-4 w-4" /></div><div><div className="font-semibold text-slate-800">{invoice.invoiceNumber}</div><div className="text-sm text-slate-500">{invoice.customer}</div></div></div><div className="text-right"><div className="font-semibold text-slate-800">{formatCurrency(invoice.amount)}</div><div className="text-xs text-slate-500">{formatShortDate(invoice.date)}</div></div><StatusBadge status={invoice.status} /></div>) : <div className="py-10 text-center text-sm text-slate-600">No recent invoices.</div>}</div></div>
      </div>
    </>
  )
}
