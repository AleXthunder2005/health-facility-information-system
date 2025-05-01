import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          Свяжись <span className="text-gray-700 font-semibold">с нами</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className=" font-semibold text-lg text-gray-600">Наш Офис</p>
          <p className=" text-gray-500">
            Богдановича 29, <br /> Минск, Беларусь
          </p>
          <p className=" text-gray-500">
            Tel: (25) 512-4477 <br /> Email: malyshev.pavel1414@gmail.com
          </p>
          <p className=" font-semibold text-lg text-gray-600">
            Карьера в ExtraCare
          </p>
          <p className=" text-gray-500">
            Узнайте, как вы можете стать частью нашей команды и внести свой
            вклад в наше стремление к совершенству в области технологий
            здравоохранения.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Присоединяйтесь к нам.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
