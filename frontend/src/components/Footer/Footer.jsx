import { assets } from "@assets/assets";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
      <div className={` border-t ${styles["footer"]}`}>
        <div className={`flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-1  mt-3 text-sm ${styles["footer__container"]}`}>
          <div className={styles["footer__logoContainer"]}>
            <img className={`mb-3 w-20 ${styles["footer__logo"]}`} src={assets.logo} alt="" />
          </div>

          <div className={styles["footer__company"]}>
            <p className={`text-lg font-medium mb-2 ${styles["footer__companyTitle"]}`}>Учреждение</p>
            <ul className={`flex flex-col gap-0.5 text-gray-600 ${styles["footer__companyList"]}`}>
              <li className={styles["footer__companyItem"]}>Главная страница</li>
              <li className={styles["footer__companyItem"]}>О нас</li>
            </ul>
          </div>

          <div className={styles["footer__contact"]}>
            <p className={`text-lg font-medium mb-2 ${styles["footer__contactTitle"]}`}>Свяжись с нами</p>
            <ul className={`flex flex-col gap-0.5 text-gray-600 ${styles["footer__contactList"]}`}>
              <li className={styles["footer__contactItem"]}>+375293458786</li>
              <li className={styles["footer__contactItem"]}>katerina280508@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className={` bg-gradient-to-b from-blue-50 to-blue-100 ${styles["footer__bottom"]}`}>
          <hr className={styles["footer__divider"]} />
          <p className={`py-2 text-sm text-center ${styles["footer__copyright"]}`}>
            Copyright 2026 @ BSUIR-hms.com - All rights are reserved.
          </p>
        </div>
      </div>
  );
};

export default Footer;