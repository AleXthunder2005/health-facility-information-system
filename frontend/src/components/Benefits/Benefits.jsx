import { assets } from "@assets/assets";
import styles from "./Benefits.module.scss";
import {Link} from "react-router-dom";

const Benefits = () => {
    const benefits = [
        {
            icon: assets.doctor_male,
            title: "Проверенные врачи",
            description: "Все специалисты проходят тщательную проверку и имеют необходимые сертификаты и лицензии"
        },
        {
            icon: assets.calendar,
            title: "Удобное расписание",
            description: "Выбирайте время приёма удобное именно для вас"
        },
        {
            icon: assets.chat,
            title: "Запись онлайн",
            description: "Выбирайте время приёма онлайн без звонков и очередей, 24/7"
        },
        {
            icon: assets.group_communication,
            title: "Положительные отзывы",
            description: "Тысячи пациентов уже оценили качество обслуживания"
        }
    ];

    return (
        <section className={`w-full py-5 px-6 md:px-10 lg:px-20 bg-white ${styles["benefits"]}`}>
            <div className={`max-w-7xl mx-auto ${styles["benefits__container"]}`}>
                {/* Section Header */}
                <div className={`text-center mb-8 ${styles["benefits__header"]}`}>
                    <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${styles["benefits__title"]}`}>
                        Почему следует выбрать нас?
                    </h2>
                    <p className={`text-gray-600 mx-auto ${styles["benefits__subtitle"]}`}>
                        У нас работают только опытные врачи, внимательный персонал и современное оборудование
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${styles["benefits__grid"]}`}>
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className={`bg-[#f8fafc] p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${styles["benefits__card"]}`}
                        >
                            <div className={`w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 ${styles["benefits__iconWrapper"]}`}>
                                <img
                                    src={benefit.icon}
                                    alt={benefit.title}
                                    className={`w-7 h-7 ${styles["benefits__icon"]}`}
                                />
                            </div>
                            <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${styles["benefits__cardTitle"]}`}>
                                {benefit.title}
                            </h3>
                            <p className={`text-sm text-gray-600 leading-relaxed ${styles["benefits__cardDescription"]}`}>
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className={`mt-5 grid grid-cols-2 md:grid-cols-4 gap-6 ${styles["benefits__stats"]}`}>
                    <div className={`text-center ${styles["benefits__stat"]}`}>
                        <div className={`text-3xl md:text-4xl font-bold text-primary mb-2 ${styles["benefits__statNumber"]}`}>1000+</div>
                        <div className={`text-sm text-gray-600 ${styles["benefits__statLabel"]}`}>Активных пациентов</div>
                    </div>
                    <div className={`text-center ${styles["benefits__stat"]}`}>
                        <div className={`text-3xl md:text-4xl font-bold text-primary mb-2 ${styles["benefits__statNumber"]}`}>40+</div>
                        <div className={`text-sm text-gray-600 ${styles["benefits__statLabel"]}`}>Врачей-специалистов</div>
                    </div>
                    <div className={`text-center ${styles["benefits__stat"]}`}>
                        <div className={`text-3xl md:text-4xl font-bold text-primary mb-2 ${styles["benefits__statNumber"]}`}>15+</div>
                        <div className={`text-sm text-gray-600 ${styles["benefits__statLabel"]}`}>Специализаций</div>
                    </div>
                    <div className={`text-center ${styles["benefits__stat"]}`}>
                        <div className={`text-3xl md:text-4xl font-bold text-primary mb-2 ${styles["benefits__statNumber"]}`}>24/7</div>
                        <div className={`text-sm text-gray-600 ${styles["benefits__statLabel"]}`}>Онлайн-запись</div>
                    </div>
                </div>

                {/* CTA Banner */}
                <div className={`mt-10 bg-primary rounded-2xl p-8 md:p-12 ${styles["benefits__ctaBanner"]}`}>
                    <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${styles["benefits__ctaContainer"]}`}>
                        <div className={styles["benefits__ctaText"]}>
                            <h3 className={`text-2xl md:text-3xl font-semibold text-white mb-2 ${styles["benefits__ctaTitle"]}`}>
                                Готовы записаться на приём?
                            </h3>
                            <p className={`text-blue-100 ${styles["benefits__ctaDescription"]}`}>
                                Начните заботу о своём здоровье прямо сейчас
                            </p>
                        </div>
                        <Link
                            to="/doctors"
                            onClick={() => window.scrollTo(0, 0)}
                            className={`bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition whitespace-nowrap ${styles["benefits__ctaButton"]}`}
                        >
                            Выбрать врача
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Benefits;