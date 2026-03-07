import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import {specialityData} from "@assets/assets";
import styles from './TopDoctors.module.scss';

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
    <div className={styles.topdoctors__container}>
      <h1 className={styles.topdoctors__title}>Наши сотрудники</h1>
      <p className={styles.topdoctors__subtitle}>
        Наш обширный список проверенных врачей.
      </p>
      <div className={styles.topdoctors__grid}>
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className={styles.topdoctors__card}
            key={index}
            >
            <img
              className={styles.topdoctors__image}
              src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
              alt=""
            />
            <div className={styles.topdoctors__body}>
              <div
              className={`${styles.topdoctors__status} ${item.available ? styles["topdoctors__status--available"] : styles["topdoctors__status--unavailable"]}`}
              >
              <p
                className={`${styles.topdoctors__dot} ${item.available ? styles["topdoctors__dot--available"] : styles["topdoctors__dot--unavailable"]}`}
              ></p>
              <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
              <p className={styles.topdoctors__name}>{item.name}</p>
              <p className={styles.topdoctors__speciality}>{getSpecialityLabel(item.speciality)}</p>
            </div>
            </div>
          ))}
          </div>
          <button
          onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className={styles.topdoctors__button}
      >
        Больше
      </button>
    </div>
  );
};

export default TopDoctors;
