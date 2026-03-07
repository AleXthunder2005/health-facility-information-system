import React from "react";
import { specialityData } from "@assets/assets";
import { Link } from "react-router-dom";
import styles from './SpecialityMenu.module.scss';

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className={styles.specialitymenu__container}
    >
      <h1 className={styles.specialitymenu__title}>Найти специолиста</h1>
      <div className={styles.specialitymenu__list}>
        {specialityData.map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className={styles.specialitymenu__item}
            key={index}
          >
            <img
              className={styles.specialitymenu__image}
              src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
              alt=""
            />
            <p>{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
