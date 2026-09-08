import apiClient from '../../lib/apiClient'
import type { Invoice, InvoiceListResponse } from './types'

interface InvoiceListParams {
  page: number
  limit: number
  search?: string
}

const getInvoices = async (params: InvoiceListParams): Promise<InvoiceListResponse> => {
  const response = await apiClient.get('/api/invoices', { params })
  return response.data.data
}

const getInvoice = async (invoiceId: string): Promise<Invoice> => {
  const response = await apiClient.get(`/api/invoices/${invoiceId}`)
  return response.data.data
}

export { getInvoice, getInvoices }
export type { InvoiceListParams }
