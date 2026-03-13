import { assets } from "@assets/assets";
import styles from "./Contact.module.scss";

const Contact = () => {
  return (
      <div className={styles["contact"]}>
        <div className={`text-center text-2xl pt-10 text-[#707070] ${styles["contact__header"]}`}>
          <p className={styles["contact__headerText"]}>
            Свяжись <span className={`text-gray-700 font-semibold ${styles["contact__headerHighlight"]}`}>с нами</span>
          </p>
        </div>

        <div className={`my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm ${styles["contact__content"]}`}>
          <img
              className={`w-full md:max-w-[360px] ${styles["contact__image"]}`}
              src={assets.contact_image}
              alt=""
          />
          <div className={`flex flex-col justify-center items-start gap-6 ${styles["contact__info"]}`}>
            <p className={`font-semibold text-lg text-gray-600 ${styles["contact__officeTitle"]}`}>Наш Офис</p>
            <p className={`text-gray-500 ${styles["contact__officeAddress"]}`}>
              Богдановича 29, <br /> Минск, Беларусь
            </p>
            <p className={`text-gray-500 ${styles["contact__officeContacts"]}`}>
              Tel: (25) 512-4477 <br /> Email: malyshev.pavel1414@gmail.com
            </p>
            <p className={`font-semibold text-lg text-gray-600 ${styles["contact__careersTitle"]}`}>
              Карьера в ExtraCare
            </p>
            <p className={`text-gray-500 ${styles["contact__careersDescription"]}`}>
              Узнайте, как вы можете стать частью нашей команды и внести свой
              вклад в наше стремление к совершенству в области технологий
              здравоохранения.
            </p>
            <button className={`border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 ${styles["contact__careersButton"]}`}>
              Присоединяйтесь к нам.
            </button>
          </div>
        </div>
      </div>
  );
};

export default Contact;