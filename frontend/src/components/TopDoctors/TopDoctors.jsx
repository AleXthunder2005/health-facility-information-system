import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import {specialityData} from "@assets/assets";
import styles from "./TopDoctors.module.scss";

const TopDoctors = () => {
    const navigate = useNavigate();

    const { doctors } = useContext(AppContext);

    const getSpecialityLabel = (speciality) => {
        const foundSpeciality = specialityData.find(
            (item) => item.speciality === speciality
        );
        return foundSpeciality ? foundSpeciality.label : "Unknown";
    }

    return (
        <div className={`flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10 ${styles["topDoctors"]}`}>
            <h1 className={`text-3xl font-medium ${styles["topDoctors__title"]}`}>Наши сотрудники</h1>
            <p className={`sm:w-1/3 text-center text-sm ${styles["topDoctors__subtitle"]}`}>
                Наш обширный список проверенных врачей.
            </p>
            <div className={`w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0 ${styles["topDoctors__grid"]}`}>
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => {
                            navigate(`/appointment/${item._id}`);
                            scrollTo(0, 0);
                        }}
                        className={`border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ${styles["topDoctors__card"]}`}
                        key={index}
                    >
                        <img
                            className={`bg-[#EAEFFF] h-60 object-cover ${styles["topDoctors__cardImage"]}`}
                            src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
                            alt=""
                        />
                        <div className={`p-4 ${styles["topDoctors__cardContent"]}`}>
                            <div
                                className={`flex items-center gap-2 text-sm text-center ${
                                    item.available ? "text-green-500" : "text-gray-500"
                                } ${styles["topDoctors__availability"]}`}
                            >
                                <p
                                    className={`w-2 h-2 rounded-full ${
                                        item.available ? "bg-green-500" : "bg-gray-500"
                                    } ${styles["topDoctors__availabilityDot"]}`}
                                ></p>
                                <p className={styles["topDoctors__availabilityText"]}>{item.available ? "Available" : "Not Available"}</p>
                            </div>
                            <p className={`text-[#262626] text-lg font-medium ${styles["topDoctors__doctorName"]}`}>{item.name}</p>
                            <p className={`text-[#5C5C5C] text-sm ${styles["topDoctors__doctorSpeciality"]}`}>{getSpecialityLabel(item.speciality)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => {
                    navigate("/doctors");
                    scrollTo(0, 0);
                }}
                className={`bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10 ${styles["topDoctors__moreButton"]}`}
            >
                Больше
            </button>
        </div>
    );
};

export default TopDoctors;