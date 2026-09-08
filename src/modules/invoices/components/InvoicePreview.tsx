import type { RefObject } from 'react'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { formatDate } from '../../../utils/formatDate'
import type { Invoice } from '../types'

interface InvoicePreviewProps {
  invoice: Invoice
  invoiceRef: RefObject<HTMLDivElement | null>
}

const currency = (value: number) =>
  `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// NOTE: All colors below are inline hex styles instead of Tailwind color
// utility classes (text-slate-800, border-slate-200, etc). This is
// intentional: if the project is on Tailwind v4, the default palette
// resolves to oklch() colors, which html2canvas cannot parse and will
// throw during PDF generation. Layout/spacing Tailwind classes are kept
// since those don't affect html2canvas color parsing.

const colors = {
  textDark: '#1e293b', // slate-800
  textDarker: '#0f172a', // slate-900
  textMuted: '#64748b', // slate-500
  textFaint: '#94a3b8', // slate-400
  borderLight: '#e2e8f0', // slate-200
  borderLighter: '#f1f5f9', // slate-100
  borderMedium: '#cbd5e1', // slate-300
  indigo: '#4f46e5', // indigo-600
  emerald: '#047857', // emerald-700
  white: '#ffffff',
}

export function InvoicePreview({ invoice, invoiceRef }: InvoicePreviewProps) {
  return (
    <div className="space-y-4">
      <div
        ref={invoiceRef}
        className="p-6 sm:p-8"
        style={{ backgroundColor: colors.white, color: colors.textDark }}
      >
        <div
          className="flex flex-wrap items-start justify-between gap-5 border-b pb-6"
          style={{ borderColor: colors.borderLight }}
        >
          <div>
            <div
              className="text-xs font-bold tracking-[0.28em]"
              style={{ color: colors.indigo }}
            >
              GARAGE
            </div>
            <div
              className="mt-1 text-xs tracking-[0.12em]"
              style={{ color: colors.textMuted }}
            >
              MANAGEMENT SYSTEM
            </div>
            <h2 className="mt-8 text-2xl font-bold" style={{ color: colors.textDarker }}>
              Invoice
            </h2>
          </div>
          <div className="text-right text-sm">
            <div className="text-xs uppercase tracking-wide" style={{ color: colors.textFaint }}>
              Invoice Number
            </div>
            <div className="mt-1 text-lg font-bold" style={{ color: colors.textDarker }}>
              {invoice.invoiceNumber}
            </div>
            <div
              className="mt-3 text-xs uppercase tracking-wide"
              style={{ color: colors.textFaint }}
            >
              Invoice Date
            </div>
            <div className="mt-1" style={{ color: colors.textDark }}>
              {formatDate(invoice.createdAt)}
            </div>
            <div className="mt-3">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        <div
          className="grid gap-4 border-b py-5 sm:grid-cols-2"
          style={{ borderColor: colors.borderLight }}
        >
          <div>
            <div className="text-xs uppercase tracking-wide" style={{ color: colors.textFaint }}>
              Job Card
            </div>
            <div className="mt-1 font-semibold" style={{ color: colors.textDark }}>
              {typeof invoice.jobCardId === 'string'
                ? invoice.jobCardId
                : invoice.jobCardId.jobCardNumber || invoice.jobCardId._id}
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-xs uppercase tracking-wide" style={{ color: colors.textFaint }}>
              Status
            </div>
            <div className="mt-1 font-semibold" style={{ color: colors.emerald }}>
              Issued
            </div>
          </div>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr
              className="border-b text-xs uppercase tracking-wide"
              style={{ borderColor: colors.borderMedium, color: colors.textMuted }}
            >
              <th className="pb-3">Description</th>
              <th className="w-20 pb-3 text-right">Qty</th>
              <th className="w-28 pb-3 text-right">Unit Price</th>
              <th className="w-28 pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr
                key={`${item.description}-${index}`}
                className="border-b"
                style={{ borderColor: colors.borderLighter }}
              >
                <td className="py-3 pr-3">{item.description}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{currency(item.unitPrice)}</td>
                <td className="py-3 text-right font-medium">{currency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: colors.textMuted }}>Subtotal</span>
              <span>{currency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.textMuted }}>Discount</span>
              <span>- {currency(invoice.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.textMuted }}>Tax</span>
              <span>{currency(invoice.tax)}</span>
            </div>
            <div
              className="flex justify-between border-t pt-3 text-base font-bold"
              style={{ borderColor: colors.borderMedium, color: colors.textDarker }}
            >
              <span>Total Amount</span>
              <span>{currency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-5" style={{ borderColor: colors.borderLight }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: colors.textFaint }}>
            Notes
          </div>
          <div
            className="mt-2 whitespace-pre-wrap text-sm"
            style={{ color: colors.textMuted }}
          >
            {invoice.notes || '-'}
          </div>
        </div>
      </div>
    </div>
  )
}