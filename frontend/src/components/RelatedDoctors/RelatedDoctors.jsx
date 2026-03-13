import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import styles from "./RelatedDoctors.module.scss";

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    const [relDoc, setRelDoc] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter(
                (doc) => doc.speciality === speciality && doc._id !== docId
            );
            setRelDoc(doctorsData);
        }
    }, [doctors, speciality, docId]);

    return (
        <div className={`flex flex-col items-center gap-4 my-16 text-[#262626] ${styles["relatedDoctors"]}`}>
            <h1 className={`text-3xl font-medium ${styles["relatedDoctors__title"]}`}>Схожие специолисты</h1>
            <p className={`sm:w-1/3 text-center text-sm ${styles["relatedDoctors__subtitle"]}`}>
                Просмотрите наш обширный список проверенных врачей.
            </p>
            <div className={`w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0 ${styles["relatedDoctors__grid"]}`}>
                {relDoc.map((item, index) => (
                    <div
                        onClick={() => {
                            navigate(`/appointment/${item._id}`);
                            scrollTo(0, 0);
                        }}
                        className={`border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ${styles["relatedDoctors__card"]}`}
                        key={index}
                    >
                        <img
                            className={`bg-[#EAEFFF] ${styles["relatedDoctors__cardImage"]}`}
                            src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
                            alt=""
                        />
                        <div className={`p-4 ${styles["relatedDoctors__cardContent"]}`}>
                            <div
                                className={`flex items-center gap-2 text-sm text-center ${styles["relatedDoctors__availability"]}`}
                            >
                                <p
                                    className={`w-2 h-2 rounded-full ${
                                        item.available ? "bg-green-500" : "bg-gray-500"
                                    } ${styles["relatedDoctors__availabilityDot"]}`}
                                ></p>
                                <p className={styles["relatedDoctors__availabilityText"]}>{item.available ? "Available" : "Not Available"}</p>
                            </div>
                            <p className={`text-[#262626] text-lg font-medium ${styles["relatedDoctors__doctorName"]}`}>{item.name}</p>
                            <p className={`text-[#5C5C5C] text-sm ${styles["relatedDoctors__doctorSpeciality"]}`}>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* <button className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>more</button> */}
        </div>
    );
};

export default RelatedDoctors;