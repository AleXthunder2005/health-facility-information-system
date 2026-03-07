import React from "react";
import { assets } from "@assets/assets";
import { useNavigate } from "react-router-dom";
import styles from './Banner.module.scss';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.banner__container}>
      {/* ------- Left Side ------- */}
      <div className={styles.banner__left}>
        <div className={styles.banner__text}>
          <p>Запишись на прием</p>
          <p className={styles.banner__subtitle}>40+ проверенных докторов</p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className={styles.banner__button}
        >
          Создать аккаунт
        </button>
      </div>

      {/* ------- Right Side ------- */}
      <div className={styles.banner__right}>
        <img
          className={styles.banner__image}
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
