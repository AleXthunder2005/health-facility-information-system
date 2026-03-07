import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '@context/AppContext';
import { toast } from 'react-toastify';
import styles from './Verify.module.scss';

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")

    const { backendUrl, token } = useContext(AppContext)

    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {

        try {

            const { data } = await axios.post(backendUrl + "/api/user/verifyStripe", { success, appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

            navigate("/my-appointments")

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (token, appointmentId, success) {
            verifyStripe()
        }
    }, [token])

    return (
        <div className={styles.verify__container}>
            <div className={styles.verify__spinner}></div>
        </div>
    )
}

export default Verify