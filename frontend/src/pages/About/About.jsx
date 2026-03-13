import { assets } from "@assets/assets";
import styles from "./About.module.scss";
import Benefits from "@components/Benefits/Benefits.jsx";

const About = () => {
  return (
      <div className={`flex flex-col min-h-screen ${styles["about"]}`}>
        {/* Основной контент */}
        <div className="flex flex-col mb-4 md:flex-row items-center gap-10 mt-5 px-4 md:px-20">
          <img
              src={assets.about_image}
              alt="medical"
              className="w-full md:w-1/3 rounded-xl shadow-lg"
          />
          <div className="flex flex-col gap-3 md:w-2/3 text-gray-600 text-sm">
            <b className="text-gray-800 text-4xl">О нас</b>
            <p>
              Наш сервис позволяет пациентам легко находить нужных специалистов и
              записываться на прием в удобное время. Мы стремимся сделать процесс
              записи максимально быстрым и прозрачным, чтобы сэкономить ваше время.
            </p>
            <p>
              Пользователи могут просматривать расписание врачей, получать
              уведомления о записи и управлять своими визитами онлайн. Наша цель —
              создать удобный доступ к медицинским услугам для каждого.
            </p>
            <b className="text-gray-800 text-2xl">Наша цель</b>
            <p>
              Сделать медицинские услуги доступными, эффективными и удобными, чтобы
              пациенты могли легко планировать визиты и получать своевременную помощь.
            </p>
          </div>
        </div>

        <Benefits/>

        <div className="flex-grow" />
      </div>
  );
};

export default About;