import { Download, Eye, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import html2pdf from 'html2pdf.js'
import { toast } from 'react-toastify'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { formatDate } from '../../../utils/formatDate'
import { InvoicePreview } from '../components/InvoicePreview'
import { useInvoiceData, useInvoicesData } from '../hooks'
import type { Invoice } from '../types'

const currency = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const jobCardText = (invoice: Invoice) => typeof invoice.jobCardId === 'string' ? invoice.jobCardId : invoice.jobCardId.jobCardNumber || invoice.jobCardId._id

export default function InvoicesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const { data, isLoading, isError } = useInvoicesData({ page, limit, ...(search ? { search } : {}) })
  const invoiceQuery = useInvoiceData(selectedInvoice?._id ?? '', selectedInvoice !== null)
  const invoices = data?.invoices ?? []
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit))

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 350)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    if (isError) toast.error('Unable to load invoices. Please try again.')
  }, [isError])

  const closeInvoice = () => {
    if (!invoiceQuery.isFetching) setSelectedInvoice(null)
  }

  const downloadPdf = async () => {
    if (!invoiceRef.current || !invoiceQuery.data) return

    setIsDownloading(true)
    try {
      // Small delay to make sure the modal/content has fully painted
      // before html2canvas captures it (avoids blank/partial captures
      // right after the modal opens or data changes).
      await new Promise((resolve) => window.setTimeout(resolve, 50))

      const element = invoiceRef.current
      if (!element) {
        throw new Error('Invoice element is not available')
      }

      await html2pdf()
        .set({
          margin: 0.35,
          filename: `Invoice-${invoiceQuery.data.invoiceNumber}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save()
    } catch (error) {
      // Log the real error so the root cause is visible in the console
      // instead of only showing a generic toast.
      console.error('PDF generation failed:', error)
      toast.error('Unable to download invoice PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <PageContainer title="Invoices" description="Review and download generated service invoices">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">Issued invoices</div>
          <label className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search invoices..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 font-medium">Invoice Number</th><th className="pb-3 font-medium">Job Card</th><th className="pb-3 font-medium">Subtotal</th><th className="pb-3 font-medium">Discount</th><th className="pb-3 font-medium">Tax</th><th className="pb-3 font-medium">Total Amount</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Created Date</th><th className="pb-3 font-medium">Actions</th></tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={9} className="py-10 text-center text-slate-500">Loading invoices...</td></tr> : null}
              {isError ? <tr><td colSpan={9} className="py-10 text-center text-rose-600">Unable to load invoices.</td></tr> : null}
              {!isLoading && !isError && invoices.length ? invoices.map((invoice) => <tr key={invoice._id} className="border-b border-slate-100 last:border-0"><td className="py-3 font-medium text-slate-800">{invoice.invoiceNumber}</td><td className="py-3 text-slate-600">{jobCardText(invoice)}</td><td className="py-3 text-slate-600">{currency(invoice.subtotal)}</td><td className="py-3 text-slate-600">{currency(invoice.discount)}</td><td className="py-3 text-slate-600">{currency(invoice.tax)}</td><td className="py-3 font-semibold text-slate-800">{currency(invoice.totalAmount)}</td><td className="py-3"><StatusBadge status={invoice.status} /></td><td className="py-3 text-slate-600">{formatDate(invoice.createdAt)}</td><td className="py-3"><button type="button" title="View invoice" aria-label={`View ${invoice.invoiceNumber}`} onClick={() => setSelectedInvoice(invoice)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></button></td></tr>) : null}
              {!isLoading && !isError && !invoices.length ? <tr><td colSpan={9} className="py-10 text-center text-slate-600">No invoices found.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>
      </div>

      <Modal
        open={selectedInvoice !== null}
        title={invoiceQuery.data?.invoiceNumber || selectedInvoice?.invoiceNumber || 'Invoice Details'}
        onClose={closeInvoice}
        showCloseButton={false}
        headerAction={<Button size="sm" onClick={downloadPdf} disabled={isDownloading || !invoiceQuery.data} icon={<Download className="h-4 w-4" />}>{isDownloading ? 'Generating...' : 'Download PDF'}</Button>}
      >
        {invoiceQuery.isLoading ? <div className="py-12 text-center text-sm text-slate-500">Loading invoice...</div> : null}
        {invoiceQuery.isError ? <div className="py-12 text-center text-sm text-rose-600">Unable to load invoice details.</div> : null}
        {invoiceQuery.data ? <InvoicePreview invoice={invoiceQuery.data} invoiceRef={invoiceRef} /> : null}
      </Modal>
    </PageContainer>
  )
}