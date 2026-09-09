import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useCustomersData, useDeleteCustomer } from '../hooks';
import type { Customer } from '../types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full name</div><div className="mt-1 text-sm font-medium text-slate-800">{customer.fullName}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</div><div className="mt-1 text-sm font-medium text-emerald-700">{customer.isActive ? 'Active' : 'Inactive'}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</div><div className="mt-1 text-sm text-slate-700">{customer.phone}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alternate phone</div><div className="mt-1 text-sm text-slate-700">{customer.alternatePhone || '-'}</div></div>
        <div className="sm:col-span-2"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</div><div className="mt-1 text-sm text-slate-700">{customer.email || '-'}</div></div>
      </div>
      <div className="border-t border-slate-100 pt-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</div>
        <div className="mt-2 text-sm leading-6 text-slate-700">
          {customer.address?.addressLine || '-'}<br />
          {[customer.address?.city, customer.address?.state, customer.address?.pincode].filter(Boolean).join(', ') || '-'}
        </div>
      </div>
      <div className="border-t border-slate-100 pt-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</div>
        <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{customer.notes || '-'}</div>
      </div>
    </div>
  )
}

export function CustomersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data } = useCustomersData({ page, limit });
  const deleteCustomerMutation = useDeleteCustomer();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const customers = data?.customers || [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  const confirmDelete = (customer: Customer) => {
    const toastId = toast.warning(
      <div>
        <div className="font-semibold text-slate-800">Deactivate {customer.fullName}?</div>
        <div className="mt-1 text-sm text-slate-600">This customer will no longer appear in active records.</div>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100" onClick={() => toast.dismiss(toastId)}>Cancel</button>
          <button type="button" className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700" onClick={() => { toast.dismiss(toastId); deleteCustomerMutation.mutate(customer._id) }}>Yes, deactivate</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false },
    );
  };
  return (
    <PageContainer
      title="Customers"
      description="Manage your garage customers"
      actions={
        <Link to="/customers/new">
          <Button>Add Customer</Button>
        </Link>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">Customer list</div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Active customers</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">City</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers?.map((customer) => (
                <tr className="border-b border-slate-100 last:border-0" key={customer._id}>
                  <td className="py-3 font-medium text-slate-800">{customer.fullName}</td>
                  <td className="py-3 text-slate-600">{customer.phone}</td>
                  <td className="py-3 text-slate-600">{customer.email}</td>
                  <td className="py-3 text-slate-600">{customer.address?.city}</td>
                <td className="py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Active</span></td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" title="View customer" aria-label={`View ${customer.fullName}`} onClick={() => setSelectedCustomer(customer)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></button>
                    <Link to={`/customers/${customer._id}/edit`} title="Edit customer" aria-label={`Edit ${customer.fullName}`} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Pencil className="h-4 w-4" /></Link>
                    <button type="button" title="Deactivate customer" aria-label={`Deactivate ${customer.fullName}`} onClick={() => confirmDelete(customer)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-slate-600">
                    No customers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>
      </div>
      <Modal open={selectedCustomer !== null} title="Customer Details" onClose={() => setSelectedCustomer(null)}>
        {selectedCustomer ? <CustomerDetails customer={selectedCustomer} /> : null}
      </Modal>
    </PageContainer>
  )
}
