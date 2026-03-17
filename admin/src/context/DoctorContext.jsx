import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [patients, setPatients] = useState([])


    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: { dToken }
            });
            if (data.success) setAppointments(data.appointments.reverse());
            else toast.error(data.message);
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { dToken } });
            setProfileData(data.profileData);
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const getPatients = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/patients`, { headers: { dToken } });
            if (data.success) setPatients(data.patients);
            else toast.error(data.message);
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    // Получение истории конкретного пациента
    const getPatientHistory = async (patientId) => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/visits/doctor?patientId=${patientId}`,
                { headers: { dToken } }
            );

            if (data.success) {
                return data.visits;
            } else {
                toast.error(data.message);
                return [];
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
            return [];
        }
    };

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            // const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

            // if (data.success) {
                toast.success("Запись успешно подтверждена")
                getAppointments()
                // Later after creating getDashData Function
                getDashData()
            // } else {
            //     toast.error(data.message)
            // }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Функция для отправки инвойса по email пациенту
    const sendInvoice = async (appointmentId, additionalText = '') => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/send-invoice',
                { appointmentId, additionalText },
                { headers: { dToken } }
            )

            if (data.success) {
                toast.success(data.message)
                return { success: true }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
            return { success: false, message: error.message }
        }
    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const value = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        sendInvoice,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
        patients, getPatients, getPatientHistory
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )


}

export default DoctorContextProvider