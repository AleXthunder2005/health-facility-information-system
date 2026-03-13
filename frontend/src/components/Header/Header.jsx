import { assets } from "@assets/assets";
import styles from "./Header.module.scss";
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <section className={`w-full py-10 px-2 md:py-7 md:px-10 lg:px-20 bg-[#ffffff] ${styles["header"]}`}>
            <div className={`max-w-7xl py-8 mx-auto flex flex-col md:flex-row items-center gap-10 ${styles["header__container"]}`}>

                {/* -------- Left -------- */}
                <div className={`md:w-1/2 flex flex-col gap-6 ${styles["header__left"]}`}>

                    <h1 className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight ${styles["header__title"]}`}>
                        Подберите врача <br />
                        и запишитесь на приём онлайн
                    </h1>

                    <p className={`text-gray-600 text-sm md:text-base max-w-lg ${styles["header__description"]}`}>
                        Просматривайте проверенных специалистов
                        и выбирайте удобное время для визита без очередей и звонков.
                    </p>

                    {/* Trust */}
                    <div className={`flex items-center gap-4 ${styles["header__trust"]}`}>
                        <img src={assets.group_profiles} className={`w-28 ${styles["header__groupProfiles"]}`} alt="" />
                        <p className={`text-sm text-gray-600 ${styles["header__trustText"]}`}>
                            Уже более <b>1 000 пациентов</b> нашли своего врача
                        </p>
                    </div>

                    <div className={`flex flex-wrap gap-4 mt-2 ${styles["header__cta"]}`}>
                        <a
                            href="#speciality"
                            className={`text-white px-8 py-3 rounded-full text-sm font-medium transition ${styles["header__ctaPrimary"]}`}
                        >
                            Найти врача
                        </a>

                        <Link
                            to="/doctors"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`px-8 py-3 rounded-full text-sm border border-gray-300 hover:bg-gray-100 transition ${styles["header__ctaSecondary"]}`}
                        >
                            Записаться на приём
                        </Link>
                    </div>

                </div>

                {/* -------- Right -------- */}
                <div className={`md:w-1/2 relative ${styles["header__right"]}`}>

                    {/* card background */}
                    <div className={`absolute inset-0 bg-white rounded-3xl ${styles["header__cardBackground"]}`}></div>

                    <img
                        src={assets.header_img}
                        alt="doctor"
                        className={`relative w-full max-w-md mx-auto p-0 ${styles["header__image"]}`}
                    />

                </div>

            </div>
        </section>
    );
};

export default Header;