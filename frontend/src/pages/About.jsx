import React from "react";
import { assets } from "../assets/assets";
const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-1 text-gray-500"></div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          О <span className="text-gray-700 font-medium">нас</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Добро пожаловать в ExtraCare, вашего надежного партнера в управлении
            вашими Удобное и эффективное управление медицинскими потребностями.
            В ExtraCare мы понимаем, с какими трудностями сталкиваются люди,
            когда речь идет о Расписание визитов к врачу и ведение медицинской
            карты.
          </p>
          <p>
            ExtraCare стремится к совершенству в области технологий
            здравоохранения. Мы постоянно стремимся усовершенствовать нашу
            платформу, внедряя последние достижения, чтобы улучшить опыт
            пользователей и обеспечить превосходное обслуживание Бронируете ли
            вы свой первый прием или управляете или управлять текущим
            обслуживанием, ExtraCare поддержит вас на каждом шагу.
          </p>
          <b className="text-gray-800">Наши взгляды</b>
          <p>
            Наша задача в ExtraCare - создать бесперебойное медицинское
            обслуживание. опыт для каждого пользователя. Мы стремимся преодолеть
            разрыв между пациентами и поставщиками медицинских услуг, облегчая
            вам доступ к необходимым услугам. необходимую вам помощь, когда она
            вам нужна.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          Почему{" "}
          <span className="text-gray-700 font-semibold">выбирают нас</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Эффективность:</b>
          <p>
            Упрощенное планирование посещений, которое вписывается в ваш
            напряженный образ жизни.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Удобство:</b>
          <p>
            Доступ к сети надежных медицинских специалистов в вашем регионе.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Персональный подход:</b>
          <p>
            Индивидуальные рекомендации и напоминания, которые помогут вам
            оставаться на высоте ваше здоровье.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
