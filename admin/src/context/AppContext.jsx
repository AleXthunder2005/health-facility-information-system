import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const dToken = localStorage.getItem("dToken");

    const [services, setServices] = useState([]);

    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа",
        "сентября", "октября", "ноября", "декабря"];

    // ================= SERVICES =================

    const getServices = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/services",
                { headers: { dToken } }
            );

            if (data.success) {
                setServices(data.services);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Ошибка загрузки услуг");
        }
    };

    const addService = async (service) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/services/add",
                service,
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getServices();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }

        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    const updateService = async (service) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/services/update",
                service,
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getServices();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }

        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    const deleteService = async (serviceId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/services/delete",
                { serviceId },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getServices();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }

        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // ================= UTILS =================

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
    };

    const calculateAge = (dob) => {
        const dateArray = dob.split('_');
        const newDob = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
        const today = new Date();
        const birthDate = new Date(newDob);
        return today.getFullYear() - birthDate.getFullYear();
    };

    const value = {
        backendUrl,
        currency,

        // services
        services,
        getServices,
        addService,
        updateService,
        deleteService,

        // utils
        slotDateFormat,
        calculateAge,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;