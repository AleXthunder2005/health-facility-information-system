import { useContext, useState } from "react";
import { assets } from "@assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  return (
      <div
          className={`flex items-center justify-between text-sm py-2 mb-3 border-b ${styles["navbar"]}`}
      >
        <img
            onClick={() => navigate("/")}
            className={`w-20 cursor-pointer ${styles["navbar__logo"]}`}
            src={assets.logo}
            alt=""
        />

        <ul
            className={`md:flex items-start gap-7 whitespace-nowrap font-medium hidden ${styles["navbar__menu"]}`}
        >
          <NavLink to="/" className={styles["navbar__link"]}>
            <li className={`py-1 ${styles["navbar__linkItem"]}`}>Главная</li>
            <hr
                className={`border-none outline-none h-0.5 bg-primary m-auto hidden ${styles["navbar__linkIndicator"]}`}
            />
          </NavLink>
          <NavLink to="/doctors" className={styles["navbar__link"]}>
            <li className={`py-1 ${styles["navbar__linkItem"]}`}>Запись на приём</li>
            <hr
                className={`border-none outline-none h-0.5 bg-primary m-auto hidden ${styles["navbar__linkIndicator"]}`}
            />
          </NavLink>
          <NavLink to="/about" className={styles["navbar__link"]}>
            <li className={`py-1 ${styles["navbar__linkItem"]}`}>О нас</li>
            <hr
                className={`border-none outline-none h-0.5 bg-primary m-auto hidden ${styles["navbar__linkIndicator"]}`}
            />
          </NavLink>
          <NavLink to="/contact" className={styles["navbar__link"]}>
            <li className={`py-1 ${styles["navbar__linkItem"]}`}>Контакты</li>
            <hr
                className={`border-none outline-none h-0.5 bg-primary m-auto hidden ${styles["navbar__linkIndicator"]}`}
            />
          </NavLink>
        </ul>

        <div className={`flex items-center gap-4 ${styles["navbar__actions"]}`}>
          {token && userData ? (
              <div className="relative">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowMenu(!showMenu)}
                >
                  <img
                      className="w-8 rounded-full"
                      src={userData.image}
                      alt=""
                  />
                  <img
                      className="w-2.5"
                      src={assets.dropdown_icon}
                      alt=""
                  />
                </div>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-sm border border-gray-200 z-30">
                      <div className="flex flex-col p-4 gap-3">
                        <p
                            onClick={() => navigate("/my-profile")}
                            className="cursor-pointer transition hover:text-primary-light text-gray-700 font-medium"
                        >
                          Мой профиль
                        </p>
                        <p
                            onClick={() => navigate("/my-appointments")}
                            className="cursor-pointer transition hover:text-primary-light text-gray-700 font-medium"
                        >
                          Мои записи
                        </p>
                        <p
                            onClick={logout}
                            className="cursor-pointer transition hover:text-primary-light text-gray-700 font-medium"
                        >
                          Выйти
                        </p>
                      </div>
                    </div>
                )}
              </div>
          ) : (
              <button
                  onClick={() => navigate("/login")}
                  className={`bg-primary text-white px-8 py-3 rounded-full font-light hidden transition md:block ${styles["navbar__authButton"]}`}
              >
                Регистрация
              </button>
          )}

          <img
              onClick={() => setShowMenu(true)}
              className={`w-6 md:hidden ${styles["navbar__menuIcon"]}`}
              src={assets.menu_icon}
              alt=""
          />

          {/* ---- Mobile Menu ---- */}
          <div
              className={`md:hidden ${
                  showMenu ? "fixed w-full" : "h-0 w-0"
              } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all ${styles["navbar__mobileMenu"]}`}
          >
            <div className={`flex items-center justify-between px-5 py-6 ${styles["navbar__mobileMenuHeader"]}`}>
              <img src={assets.logo} className={`w-36 ${styles["navbar__mobileLogo"]}`} alt="" />
              <img
                  onClick={() => setShowMenu(false)}
                  src={assets.cross_icon}
                  className={`w-7 ${styles["navbar__mobileCloseIcon"]}`}
                  alt=""
              />
            </div>
            <ul className={`flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium ${styles["navbar__mobileMenuList"]}`}>
              <NavLink onClick={() => setShowMenu(false)} to="/" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>Главная</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/doctors" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>Все доктора</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/about" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>О нас</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/contact" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>
                  Свяжись с нами
                </p>
              </NavLink>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
