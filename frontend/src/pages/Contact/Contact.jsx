import React from "react";
import { assets } from "@assets/assets";
import styles from "./Contact.module.scss";

const Contact = () => {
  return (
    <div>
      <div className={styles.contact__header}>
        <p>
          Свяжись <span className={styles["contact__header--accent"]}>с нами</span>
        </p>
      </div>

      <div className={styles.contact__container}>
        <img
          className={styles.contact__image}
          src={assets.contact_image}
          alt=""
        />
        <div className={styles.contact__content}>
          <p className={styles.contact__title}>Наш Офис</p>
          <p className={styles.contact__text}>
            Богдановича 29, <br /> Минск, Беларусь
          </p>
          <p className={styles.contact__text}>
            Tel: (25) 512-4477 <br /> Email: malyshev.pavel1414@gmail.com
          </p>
          <p className={styles.contact__title}>
            Карьера в ExtraCare
          </p>
          <p className={styles.contact__text}>
            Узнайте, как вы можете стать частью нашей команды и внести свой
            вклад в наше стремление к совершенству в области технологий
            здравоохранения.
          </p>
          <button className={styles.contact__button}>
            Присоединяйтесь к нам.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
