import { assets } from "@assets/assets";
import styles from "./Contact.module.scss";

const Contact = () => {
  return (
      <section className={`bg-gray-50 min-h-screen py-1 ${styles["contact"]}`}>

        {/* Заголовок */}
        <div className="text-center px-4 md:px-20 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Свяжитесь <span className="text-primary">с нами</span>
          </h1>
          <p className="text-gray-600 text-lg mt-1">
            Мы всегда готовы помочь с записью, вопросами или сотрудничеством.
            Просто выберите удобный способ связи.
          </p>
        </div>

        {/* Контент */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-4 px-4 md:px-20 max-w-6xl mx-auto">

          {/* Карточки информации */}
          <div className="flex flex-col gap-3">

            {/* Офис */}
            <div className="bg-white p-4 py-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
              <p className="font-semibold text-lg text-gray-900 mb-3">Наш офис</p>
              <p className="text-gray-600 leading-relaxed">
                Богдановича 29, <br /> Минск, Беларусь
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                Тел: (25) 512-4477 <br /> Email: contact@medical-service.com
              </p>
            </div>

            {/* Карьера */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex flex-col gap-4">
              <p className="font-semibold text-lg text-gray-900">Карьера</p>
              <p className="text-gray-600 leading-relaxed">
                Присоединяйтесь к нашей команде и помогайте улучшать сервис
                медицинских услуг, делая его удобным и доступным для всех пациентов.
              </p>
              <button className="self-start bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition">
                Присоединиться
              </button>
            </div>

          </div>
        </div>

        {/* Отступ перед футером */}
        <div className="flex-grow mt-16" />
      </section>
  );
};

export default Contact;