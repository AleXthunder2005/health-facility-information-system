import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import styles from './RelatedDoctors.module.scss';
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
    <div className={styles.relateddoctors__container}>
      <h1 className={styles.relateddoctors__title}>Схожие специолисты</h1>
      <p className={styles.relateddoctors__subtitle}>
        Просмотрите наш обширный список проверенных врачей.
      </p>
      <div className={styles.relateddoctors__grid}>
        {relDoc.map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className={styles.relateddoctors__card}
            key={index}
          >
            <img
              className={styles.relateddoctors__image}
              src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
              alt=""
            />
            <div className={styles.relateddoctors__body}>
              <div
              className={`${styles.relateddoctors__status} ${item.available ? styles["relateddoctors__status--available"] : styles["relateddoctors__status--unavailable"]}`}
              >
              <p
                className={`${styles.relateddoctors__dot} ${item.available ? styles["relateddoctors__dot--available"] : styles["relateddoctors__dot--unavailable"]}`}
              ></p>
              <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
              <p className={styles.relateddoctors__name}>{item.name}</p>
              <p className={styles.relateddoctors__speciality}>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <button className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>more</button> */}
    </div>
  );
};

export default RelatedDoctors;
