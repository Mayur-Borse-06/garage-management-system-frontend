import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getInvoice, getInvoices, type InvoiceListParams } from './api'

const invoicesQueryKey = ['invoices']

const errorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
    ? error.response.data.message
    : fallback

const useInvoicesData = (params: InvoiceListParams) =>
  useQuery({
    queryKey: [...invoicesQueryKey, params],
    queryFn: () => getInvoices(params),
    meta: { errorMessage: 'Unable to load invoices.' },
  })

const useInvoiceData = (invoiceId: string, enabled = true) =>
  useQuery({
    queryKey: [...invoicesQueryKey, invoiceId],
    queryFn: () => getInvoice(invoiceId),
    enabled: Boolean(invoiceId) && enabled,
    retry: false,
    throwOnError: (error) => {
      toast.error(errorMessage(error, 'Unable to load invoice. Please try again.'))
      return false
    },
  })

export { useInvoiceData, useInvoicesData }
