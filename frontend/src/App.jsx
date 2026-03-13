import Navbar from '@components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from '@pages/Home/Home'
import Doctors from '@pages/Doctors/Doctors'
import Login from '@pages/Login/Login'
import About from '@pages/About/About'
import Contact from '@pages/Contact/Contact'
import Appointment from '@pages/Appointment/Appointment'
import MyAppointments from '@pages/MyAppointments/MyAppointments'
import MyProfile from '@pages/MyProfile/MyProfile'
import Footer from '@components/Footer/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from '@pages/Verify/Verify'

const App = () => {
    return (
        <div className="flex flex-col min-h-screen mx-4 sm:mx-[10%]">
            <ToastContainer />
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/doctors' element={<Doctors />} />
                    <Route path='/doctors/:speciality' element={<Doctors />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/appointment/:docId' element={<Appointment />} />
                    <Route path='/my-appointments' element={<MyAppointments />} />
                    <Route path='/my-profile' element={<MyProfile />} />
                    <Route path='/verify' element={<Verify />} />
                </Routes>
            </main>
            <Footer />

        </div>
    )
}

export default App