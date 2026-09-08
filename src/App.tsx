import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './modules/dashboard/pages/DashboardPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { CustomersPage } from './modules/customers/pages/CustomersPage'
import AddCustomerPage from './modules/customers/pages/AddCustomerPage'
import EditCustomerPage from './modules/customers/pages/EditCustomerPage'
import VehiclesPage from './modules/vehicles/pages/VehiclesPage'
import AddVehiclePage from './modules/vehicles/pages/AddVehiclePage'
import EditVehiclePage from './modules/vehicles/pages/EditVehiclePage'
import VehicleDetailsPage from './modules/vehicles/pages/VehicleDetailsPage'
import MechanicsPage from './modules/mechanics/pages/MechanicsPage'
import AddMechanicPage from './modules/mechanics/pages/AddMechanicPage'
import EditMechanicPage from './modules/mechanics/pages/EditMechanicPage'
import MechanicDetailsPage from './modules/mechanics/pages/MechanicDetailsPage'
import JobCardsPage from './modules/job-cards/pages/JobCardsPage'
import AddJobCardPage from './modules/job-cards/pages/AddJobCardPage'
import EditJobCardPage from './modules/job-cards/pages/EditJobCardPage'
import JobCardDetailsPage from './modules/job-cards/pages/JobCardDetailsPage'
import InvoicesPage from './modules/invoices/pages/InvoicesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/new" element={<AddCustomerPage />} />
          <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/new" element={<AddVehiclePage />} />
          <Route path="/vehicles/:id/edit" element={<EditVehiclePage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="/mechanics" element={<MechanicsPage />} />
          <Route path="/mechanics/new" element={<AddMechanicPage />} />
          <Route path="/mechanics/:id/edit" element={<EditMechanicPage />} />
          <Route path="/mechanics/:id" element={<MechanicDetailsPage />} />
          <Route path="/job-cards" element={<JobCardsPage />} />
          <Route path="/job-cards/new" element={<AddJobCardPage />} />
          <Route path="/job-cards/:id/edit" element={<EditJobCardPage />} />
          <Route path="/job-cards/:id" element={<JobCardDetailsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/payments" element={<ComingSoonPage title="Payments" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
