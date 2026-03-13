import { specialityData } from "@assets/assets";
import { Link } from "react-router-dom";
import styles from "./SpecialityMenu.module.scss";

const SpecialityMenu = () => {
    return (
        <div
            id="speciality"
            className={`flex flex-col items-center gap-6 py-16 px-4 bg-gradient-to-b from-blue-50 to-blue-100 ${styles["specialityMenu"]}`}
        >
            {/* Декоративный элемент сверху */}
            <div className="w-20 h-1 bg-blue-400 rounded-full mb-2"></div>

            <h1 className={`text-4xl font-bold text-gray-800 mb-2 ${styles["specialityMenu__title"]}`}>
                Наши специалисты
            </h1>

            <p className="text-gray-600 text-lg mb-4 text-center max-w-2xl">
                Выберите нужную специальность и запишитесь на приём к лучшим врачам
            </p>

            <div className={`flex sm:justify-center gap-4 pt-5 w-full flex-wrap justify-center ${styles["specialityMenu__list"]}`}>
                {specialityData.map((item, index) => (
                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => scrollTo(0, 0)}
                        className={`px-6 py-3 rounded-full text-sm font-medium bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-primary hover:text-white border border-blue-200 transition-all duration-300 transform hover:-translate-y-1 ${styles["specialityMenu__item"]}`}
                        key={index}
                    >
                        <span className={styles["specialityMenu__itemLabel"]}>{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Декоративный элемент снизу */}
            <div className="mt-8 text-center">
                <Link
                    to="/doctors"
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors"
                >
                    <span>Все специалисты</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default SpecialityMenu;