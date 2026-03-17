import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '@context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '@assets/assets'
import { specialityData } from "@assets/assets";
import styles from "./MyAppointments.module.scss";

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

    const getSpecialityLabel = (speciality) => {
        const foundSpeciality = specialityData.find(
            (item) => item.speciality === speciality
        );
        return foundSpeciality ? foundSpeciality.label : "Неизвестен";
    }

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])-1] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(
                backendUrl + '/api/user/appointments',
                { headers: { token } }
            )

            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                backendUrl + '/api/user/cancel-appointment',
                { appointmentId },
                { headers: { token } }
            )

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

                try {

                    const { data } = await axios.post(
                        backendUrl + "/api/user/verifyRazorpay",
                        response,
                        { headers: { token } }
                    );

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

    const appointmentRazorpay = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                backendUrl + '/api/user/payment-razorpay',
                { appointmentId },
                { headers: { token } }
            )

            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const appointmentStripe = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                backendUrl + '/api/user/payment-stripe',
                { appointmentId },
                { headers: { token } }
            )

            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
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

        <section className="w-full px-4 md:px-10 lg:px-20 py-8">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Мои записи
                </h1>

                <div className="space-y-4">

                    {appointments.map((item, index) => (

                        <div
                            key={index}
                            className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 ${styles["myAppointments__item"]}`}
                        >

                            <div className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center">
                                <img
                                    src={
                                        item.docData?.image
                                            ? import.meta.env.VITE_BACKEND_URL + "/images/" + item.docData.image
                                            : assets.doctor_male
                                    }
                                    className={
                                        item.docData?.image
                                            ? "w-full h-full object-cover"
                                            : "w-10"
                                    }
                                />
                            </div>


                            <div className={`flex-1 text-sm text-gray-600 ${styles["myAppointments__info"]}`}>

                                <p className="text-gray-900 text-base font-semibold">
                                    {item.docData.name}
                                </p>

                                <p className="text-gray-500">
                                    {getSpecialityLabel(item.docData.speciality)}
                                </p>

                                <p className="text-gray-700 font-medium mt-3">
                                    Адрес:
                                </p>

                                <p>
                                    {item.docData.address.line1}
                                </p>

                                {/*<p>*/}
                                {/*    {item.docData.address.line2}*/}
                                {/*</p>*/}

                                <p className="mt-2">
                                    <span className="font-medium text-gray-700">
                                        Время:
                                    </span>
                                    {" "}
                                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                                </p>

                            </div>

                            <div className="flex flex-col gap-2 justify-center md:items-end text-sm">

                                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id &&
                                    <button
                                        onClick={() => appointmentStripe(item._id)}
                                        className="px-5 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center"
                                    >
                                        <img className="max-w-20 max-h-5" src={assets.stripe_logo} alt="" />
                                    </button>
                                }

                                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id &&
                                    <button
                                        onClick={() => appointmentRazorpay(item._id)}
                                        className="px-5 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center"
                                    >
                                        <img className="max-w-20 max-h-5" src={assets.razorpay_logo} alt="" />
                                    </button>
                                }

                                {!item.cancelled && item.payment && !item.isCompleted &&
                                    <button className="px-5 py-2 rounded-lg bg-blue-50 text-blue-600">
                                        Оплачено
                                    </button>
                                }

                                {item.isCompleted &&
                                    <button className="px-5 py-2 border border-green-500 rounded-lg text-green-600">
                                        Завершен
                                    </button>
                                }

                                {!item.cancelled && !item.isCompleted &&
                                    <button
                                        onClick={() => cancelAppointment(item._id)}
                                        className="px-5 py-2 border rounded-lg hover:bg-red-600 hover:text-white transition"
                                    >
                                        Отменить запись
                                    </button>
                                }

                                {item.cancelled && !item.isCompleted &&
                                    <button className="px-5 py-2 border border-red-500 rounded-lg text-red-500">
                                        Запись отменена
                                    </button>
                                }

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    )
}

export default MyAppointments
