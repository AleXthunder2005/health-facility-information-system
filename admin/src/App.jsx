import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import {Navigate, Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorPatients from './pages/Doctor/DoctorPatients';
import DoctorPatientsAdmin from './pages/Admin/DoctorPatientsAdmin';
import PatientHistory from "./pages/Doctor/PatientHistory.jsx";
import AddAnalysis from "./pages/Doctor/AddAnalysis.jsx";
import Services from "./pages/Admin/Services.jsx";

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
      <div className='bg-[#F8F9FD] min-h-screen flex flex-col'>
          <ToastContainer />
          <Navbar />

          <div className='flex flex-1'>
              <Sidebar />

              <div className='flex-1'>
                  <Routes>
                      <Route path='/' element={<Navigate to={aToken ? '/admin-dashboard' : '/doctor-dashboard'}/>} />
                      <Route path='/admin-dashboard' element={<Dashboard />} />
                      <Route path='/all-appointments' element={<AllAppointments />} />
                      <Route path='/add-doctor' element={<AddDoctor />} />
                      <Route path='/doctor-list' element={<DoctorsList />} />
                      <Route path='/doctor-patients-admin' element={<DoctorPatientsAdmin />} />
                      <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                      <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                      <Route path='/doctor-patients' element={<DoctorPatients />} />
                      <Route path='/doctor-profile' element={<DoctorProfile />} />
                      <Route path='/patient-history/:patientId' element={<PatientHistory />} />
                      <Route path='/doctor-analyses' element={<AddAnalysis />} />
                      <Route path='/services' element={<Services />} />
                  </Routes>
              </div>
          </div>
      </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App