export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export type InvoiceStatus = 'ISSUED'

export interface Invoice {
  _id: string
  invoiceNumber: string
  jobCardId: string | { _id: string; jobCardNumber?: string }
  items: InvoiceItem[]
  subtotal: number
  discount: number
  tax: number
  totalAmount: number
  notes?: string
  status: InvoiceStatus
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface InvoiceListResponse {
  invoices: Invoice[]
  page: number
  limit: number
  total: number
}
