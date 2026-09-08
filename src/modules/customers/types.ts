
export interface CustomerAddress {
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Customer {
  _id: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: CustomerAddress;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  page: number;
  limit: number;
  total: number;
}