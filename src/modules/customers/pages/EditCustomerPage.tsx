import { ArrowLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { CustomerForm } from '../components/CustomerForm'
import { useCustomerData, useUpdateCustomer } from '../hooks'
import type { CustomerPayload } from '../schemas'

const emptyCustomer: CustomerPayload = {
  fullName: '',
  phone: '',
  alternatePhone: '',
  email: '',
  address: {
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  },
  notes: '',
}

export default function EditCustomerPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data: customer, isLoading, isError } = useCustomerData(id)
  const updateCustomerMutation = useUpdateCustomer(id)

  const defaultValues = useMemo<CustomerPayload>(() => (
    customer
      ? {
          fullName: customer.fullName,
          phone: customer.phone,
          alternatePhone: customer.alternatePhone ?? '',
          email: customer.email ?? '',
          address: {
            addressLine: customer.address?.addressLine ?? '',
            city: customer.address?.city ?? '',
            state: customer.address?.state ?? '',
            pincode: customer.address?.pincode ?? '',
          },
          notes: customer.notes ?? '',
        }
      : emptyCustomer
  ), [customer])

  const handleUpdate = (customerPayload: CustomerPayload) => {
    updateCustomerMutation.mutate(customerPayload, {
      onSuccess: () => navigate('/customers'),
    })
  }

  return (
    <PageContainer
      title="Edit Customer"
      description="Update this customer&apos;s profile"
      actions={
        <Link to="/customers" className="inline-flex">
          <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Customers
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading customer...</div>
      ) : isError || !customer ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">Unable to load this customer.</div>
      ) : (
        <CustomerForm
          defaultValues={defaultValues}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          isSubmitting={updateCustomerMutation.isPending}
          onSubmit={handleUpdate}
        />
      )}
    </PageContainer>
  )
}
