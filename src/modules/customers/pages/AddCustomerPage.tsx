import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Button } from '../../../components/ui/Button'
import { CustomerForm } from '../components/CustomerForm'
import { useCreateCustomer } from '../hooks'
import type { CustomerPayload } from '../schemas'

const defaultValues: CustomerPayload = {
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

const AddCustomerPage = () => {
  const navigate = useNavigate()
  const createCustomerMutation = useCreateCustomer()

  const handleCreate = (customerPayload: CustomerPayload) => {
    createCustomerMutation.mutate(customerPayload, {
      onSuccess: () => navigate('/customers'),
    })
  }

  return (
    <PageContainer
      title="Add Customer"
      description="Create a customer profile for your garage"
      actions={
        <Link to="/customers" className="inline-flex">
          <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Customers
          </Button>
        </Link>
      }
    >
      <CustomerForm
        defaultValues={defaultValues}
        submitLabel="Create Customer"
        submittingLabel="Creating..."
        isSubmitting={createCustomerMutation.isPending}
        onSubmit={handleCreate}
      />
    </PageContainer>
  )
}

export default AddCustomerPage
