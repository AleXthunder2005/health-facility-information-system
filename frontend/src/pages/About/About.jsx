import React from "react";
import { assets } from "@assets/assets.js";
import styles from "./About.module.scss";

const About = () => {
  return (
      <div className={styles.about}>
        <div className={styles.about__title}>
          <p>
            О <span>нас</span>
          </p>
        </div>

        <div className={styles.about__content}>
          <img
              className={styles.about__image}
              src={assets.about_image}
              alt="about"
          />

          <div className={styles.about__text}>
            <p>
              Добро пожаловать в ExtraCare, вашего надежного партнера в управлении
              вашими медицинскими потребностями. Удобное и эффективное управление
              расписанием визитов к врачу и ведение медицинской карты.
            </p>

            <p>
              ExtraCare стремится к совершенству в области технологий
              здравоохранения. Мы постоянно совершенствуем платформу, внедряя
              последние достижения, чтобы улучшить пользовательский опыт и
              обеспечить превосходное обслуживание.
            </p>

            <b className={styles.about__subtitle}>Наши взгляды</b>

            <p>
              Наша задача в ExtraCare — создать бесперебойный медицинский опыт для
              каждого пользователя. Мы стремимся преодолеть разрыв между
              пациентами и поставщиками медицинских услуг.
            </p>
          </div>
        </div>

        <div className={styles.about__whyTitle}>
          <p>
            Почему <span>выбирают нас</span>
          </p>
        </div>

        <div className={styles.about__features}>
          <div className={styles.about__feature}>
            <b>Эффективность:</b>
            <p>
              Упрощенное планирование посещений, которое вписывается в ваш
              напряженный образ жизни.
            </p>
          </div>

          <div className={styles.about__feature}>
            <b>Удобство:</b>
            <p>
              Доступ к сети надежных медицинских специалистов в вашем регионе.
            </p>
          </div>

          <div className={styles.about__feature}>
            <b>Персональный подход:</b>
            <p>
              Индивидуальные рекомендации и напоминания, которые помогут вам
              следить за своим здоровьем.
            </p>
          </div>
        </div>
      </div>
  );
};

export default About;