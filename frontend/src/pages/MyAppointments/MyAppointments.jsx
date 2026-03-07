import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '@context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '@assets/assets'
import { specialityData } from "@assets/assets";
import styles from './MyAppointments.module.scss'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const getSpecialityLabel = (speciality) => {
        const foundSpeciality = specialityData.find(
            (item) => item.speciality === speciality
        );
        return foundSpeciality ? foundSpeciality.label : "Unknown";
    }
    

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }   

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className={styles.myappointments__title}>Мои записи</p>
            <div className={styles.myappointments__list}>
                {appointments.map((item, index) => (
                    <div key={index} className={styles.myappointments__item}>
                        <div className={styles.myappointments__imageContainer}>
                            <img className={styles.myappointments__image} src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.docData.image} alt="" />
                        </div>
                        <div className={styles.myappointments__info}>
                            <p className={styles.myappointments__name}>{item.docData.name}</p>
                            <p className={styles.myappointments__speciality}>{getSpecialityLabel(item.docData.speciality)}</p>
                            <p className={styles.myappointments__addressLabel}>Адрес:</p>
                            <p className={styles.myappointments__address}>{item.docData.address.line1}</p>
                            <p className={styles.myappointments__address}>{item.docData.address.line2}</p>
                            <p className={styles.myappointments__time}><span className={styles.myappointments__timeLabel}>Время:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className={styles.myappointments__actions}>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className={styles['myappointments__button--stripe']}>
                                <img className={styles.myappointments__logo} src={assets.stripe_logo} alt="" />
                            </button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className={styles['myappointments__button--razorpay']}>
                                <img className={styles.myappointments__logo} src={assets.razorpay_logo} alt="" />
                            </button>}
                            {!item.cancelled && item.payment && !item.isCompleted && <button className={styles['myappointments__button--paid']}>Оплачено</button>}

                            {item.isCompleted && <button className={styles['myappointments__button--completed']}>Завершен</button>}

                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className={styles['myappointments__button--cancel']}>Отменить запись</button>}
                            {item.cancelled && !item.isCompleted && <button className={styles['myappointments__button--cancelled']}>Запись отменена</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments
