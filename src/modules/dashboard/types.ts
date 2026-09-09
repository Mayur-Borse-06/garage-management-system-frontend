export type DashboardJobCardStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface DashboardMetric {
  value: number
  changePercentage: number
}

export interface DashboardRevenuePoint {
  value: number
  date: string
}

export interface DashboardJobCardStatusSummary {
  OPEN: number
  IN_PROGRESS: number
  COMPLETED: number
  CANCELLED: number
  total: number
}

export interface DashboardRecentJobCard {
  jobCardNumber: string
  status: DashboardJobCardStatus
  vehicle: string
  customer: string
  mechanic: string
  date: string
}

export interface DashboardRecentInvoice {
  invoiceNumber: string
  status: 'ISSUED'
  customer: string
  amount: number
  date: string
}

export interface DashboardData {
  overview: {
    totalCustomers: DashboardMetric
    totalVehicles: DashboardMetric
    openJobCards: DashboardMetric
    totalRevenue: DashboardMetric
  }
  revenue: {
    total: number
    series: DashboardRevenuePoint[]
  }
  jobCardStatus: DashboardJobCardStatusSummary
  recentJobCards: DashboardRecentJobCard[]
  recentInvoices: DashboardRecentInvoice[]
}