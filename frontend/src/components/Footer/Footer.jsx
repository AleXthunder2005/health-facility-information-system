import React from "react";
import { assets } from "@assets/assets";
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footer__container}>
      <div className={styles.footer__content}>
        <div className={styles.footer__logo}>
          <img className={styles.footer__logoImage} src={assets.logo} alt="" />
          {/* <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p> */}
        </div>

        <div className={styles.footer__company}>
          <p className={styles.footer__title}>Компания</p>
          <ul className={styles.footer__list}>
            <li className={styles.footer__item}>Главная страница</li>
            <li className={styles.footer__item}>О нас</li>
          </ul>
        </div>

        <div className={styles.footer__contact}>
          <p className={styles.footer__title}>Свяжись с нами</p>
          <ul className={styles.footer__list}>
            <li className={styles.footer__item}>+375255124477</li>
            <li className={styles.footer__item}>malyshev.pavel1414@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className={styles.footer__bottom}>
        <hr className={styles.footer__divider} />
        <p className={styles.footer__copyright}>
          Copyright 2025 @ BSUIR_Best.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
