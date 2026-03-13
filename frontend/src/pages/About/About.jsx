import { assets } from "@assets/assets";
import styles from "./About.module.scss";

const About = () => {
  return (
      <div className={styles["about"]}>
        <div className={`text-center text-2xl pt-1 text-gray-500 ${styles["about__subtitle"]}`}></div>
        <div className={`text-center text-2xl pt-10 text-gray-500 ${styles["about__header"]}`}>
          <p className={styles["about__headerText"]}>
            О <span className={`text-gray-700 font-medium ${styles["about__headerHighlight"]}`}>нас</span>
          </p>
        </div>
        <div className={`my-10 flex flex-col md:flex-row gap-12 ${styles["about__content"]}`}>
          <img
              className={`w-full md:max-w-[360px] ${styles["about__image"]}`}
              src={assets.about_image}
              alt=""
          />
          <div className={`flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 ${styles["about__text"]}`}>
            <p className={styles["about__paragraph"]}>
              Добро пожаловать в ExtraCare, вашего надежного партнера в управлении
              вашими Удобное и эффективное управление медицинскими потребностями.
              В ExtraCare мы понимаем, с какими трудностями сталкиваются люди,
              когда речь идет о Расписание визитов к врачу и ведение медицинской
              карты.
            </p>
            <p className={styles["about__paragraph"]}>
              ExtraCare стремится к совершенству в области технологий
              здравоохранения. Мы постоянно стремимся усовершенствовать нашу
              платформу, внедряя последние достижения, чтобы улучшить опыт
              пользователей и обеспечить превосходное обслуживание Бронируете ли
              вы свой первый прием или управляете или управлять текущим
              обслуживанием, ExtraCare поддержит вас на каждом шагу.
            </p>
            <b className={`text-gray-800 ${styles["about__visionTitle"]}`}>Наши взгляды</b>
            <p className={styles["about__visionText"]}>
              Наша задача в ExtraCare - создать бесперебойное медицинское
              обслуживание. опыт для каждого пользователя. Мы стремимся преодолеть
              разрыв между пациентами и поставщиками медицинских услуг, облегчая
              вам доступ к необходимым услугам. необходимую вам помощь, когда она
              вам нужна.
            </p>
          </div>
        </div>
        <div className={`text-xl my-4 ${styles["about__reasonsTitle"]}`}>
          <p className={styles["about__reasonsText"]}>
            Почему{" "}
            <span className={`text-gray-700 font-semibold ${styles["about__reasonsHighlight"]}`}>выбирают нас</span>
          </p>
        </div>
        <div className={`flex flex-col md:flex-row mb-20 ${styles["about__reasons"]}`}>
          <div className={`border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer ${styles["about__reasonCard"]}`}>
            <b className={styles["about__reasonTitle"]}>Эффективность:</b>
            <p className={styles["about__reasonDescription"]}>
              Упрощенное планирование посещений, которое вписывается в ваш
              напряженный образ жизни.
            </p>
          </div>
          <div className={`border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer ${styles["about__reasonCard"]}`}>
            <b className={styles["about__reasonTitle"]}>Удобство:</b>
            <p className={styles["about__reasonDescription"]}>
              Доступ к сети надежных медицинских специалистов в вашем регионе.
            </p>
          </div>
          <div className={`border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer ${styles["about__reasonCard"]}`}>
            <b className={styles["about__reasonTitle"]}>Персональный подход:</b>
            <p className={styles["about__reasonDescription"]}>
              Индивидуальные рекомендации и напоминания, которые помогут вам
              оставаться на высоте ваше здоровье.
            </p>
          </div>
        </div>
      </div>
  );
};

export default About;