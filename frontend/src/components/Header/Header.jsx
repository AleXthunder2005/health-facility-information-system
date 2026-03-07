import React from "react";
import { assets } from "@assets/assets";
import styles from './Header.module.scss';

const Header = () => {
  return (
    <div className={styles.header__container}>
      {/* --------- Header Left --------- */}
      <div className={styles.header__left}>
        <p className={styles.header__title}>
          Записывайся на прием <br /> к проверенным докторам
        </p>
        <div className={styles.header__info}>
          <img className={styles.header__infoImage} src={assets.group_profiles} alt="" />
          <p>
            Просто просмотрите наш обширный список проверенных врачей и без
            лишних хлопот, <br className="hidden sm:block" /> запишитесь на
            приём.
          </p>
        </div>
        <a
          href="#speciality"
          className={styles.header__button}
        >
          Записаться на прием{" "}
          <img className={styles.header__buttonIcon} src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/* --------- Header Right --------- */}
      <div className={styles.header__right}>
        <img
          className={styles.header__image}
          src={assets.header_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
