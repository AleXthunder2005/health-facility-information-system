import { useContext, useState, useRef, useEffect } from "react";
import { assets } from "@assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import styles from "./Navbar.module.scss";
import ui_user_profile from "@assets/ui_user_profile.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const menuRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, isMobileMenuOpen]);

  const navClass = ({ isActive }) =>
      `${styles["navbar__link"]} ${
          isActive
              ? "border-b-2 border-primary pb-1"
              : "hover:border-b-2 hover:border-gray-300 pb-1"
      }`;

  const handleNavigate = (path) => {
    setShowMenu(false);
    navigate(path);
  };

  return (
      <div className={`flex items-center justify-between text-sm py-2 mb-3 border-b ${styles["navbar"]}`}>

        {/* Логотип */}
        <img
            onClick={() => navigate("/")}
            className={`w-20 cursor-pointer ${styles["navbar__logo"]}`}
            src={assets.logo}
            alt=""
        />

        {/* Десктопное меню */}
        <ul className={`md:flex items-start gap-7 whitespace-nowrap font-medium hidden ${styles["navbar__menu"]}`}>

          <NavLink to="/" className={navClass}>
            <li className={`py-0.5 ${styles["navbar__linkItem"]}`}>Главная</li>
          </NavLink>

          <NavLink to="/doctors" className={navClass}>
            <li className={`py-0.5 ${styles["navbar__linkItem"]}`}>Запись на приём</li>
          </NavLink>

          <NavLink to="/about" className={navClass}>
            <li className={`py-0.5 ${styles["navbar__linkItem"]}`}>О нас</li>
          </NavLink>

          <NavLink to="/contact" className={navClass}>
            <li className={`py-0.5 ${styles["navbar__linkItem"]}`}>Контакты</li>
          </NavLink>

        </ul>

        {/* Правая часть */}
        <div className={`flex items-center gap-4 ${styles["navbar__actions"]}`}>

          {token && userData ? (
              <div className="relative" ref={menuRef}>

                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowMenu(!showMenu)}
                >
                  <img
                      className="w-12 rounded-full"
                      src={userData.image || ui_user_profile}
                      alt=""
                  />
                  <img className="w-2.5" src={assets.dropdown_icon} alt="" />
                </div>

                {showMenu && !isMobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-sm border border-gray-200 z-30">

                      <div className="flex flex-col p-4 gap-3">

                        <p
                            onClick={() => handleNavigate("/my-profile")}
                            className="cursor-pointer transition hover:text-primary-light text-gray-700 font-medium"
                        >
                          Мой профиль
                        </p>

                        <p
                            onClick={() => handleNavigate("/my-appointments")}
                            className="cursor-pointer transition hover:text-primary-light text-gray-700 font-medium"
                        >
                          Мои записи
                        </p>

                        <p
                            onClick={() => handleNavigate("/my-analyses")}
                            className="cursor-pointer transition hover:text-primary-light text-gray-700 font-medium"
                        >
                          Мои анализы
                        </p>

                        <p
                            onClick={() => handleNavigate("/my-history")}
                            className="cursor-pointer transition hover:text-primary-light text-gray-700 font-medium"
                        >
                          Моя история
                        </p>

                        <p
                            onClick={() => {
                              setShowMenu(false);
                              logout();
                            }}
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
                Войти
              </button>
          )}

          {/* Иконка мобильного меню */}
          <img
              onClick={() => setIsMobileMenuOpen(true)}
              className={`w-6 md:hidden ${styles["navbar__menuIcon"]}`}
              src={assets.menu_icon}
              alt=""
          />

          {/* Mobile Menu */}
          <div
              className={`md:hidden ${
                  isMobileMenuOpen ? "fixed w-full" : "h-0 w-0"
              } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all ${styles["navbar__mobileMenu"]}`}
          >

            <div className={`flex items-center justify-between px-5 py-6 ${styles["navbar__mobileMenuHeader"]}`}>

              <img src={assets.logo} className={`w-36 ${styles["navbar__mobileLogo"]}`} alt="" />

              <img
                  onClick={() => setIsMobileMenuOpen(false)}
                  src={assets.cross_icon}
                  className={`w-7 ${styles["navbar__mobileCloseIcon"]}`}
                  alt=""
              />

            </div>

            <ul className={`flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium ${styles["navbar__mobileMenuList"]}`}>

              <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>Главная</p>
              </NavLink>

              <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/doctors" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>Запись на приём</p>
              </NavLink>

              <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/about" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>О нас</p>
              </NavLink>

              <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/contact" className={styles["navbar__mobileLink"]}>
                <p className={`px-4 py-2 rounded full inline-block ${styles["navbar__mobileLinkItem"]}`}>Контакты</p>
              </NavLink>

            </ul>

          </div>

        </div>

      </div>
  );
};

export default Navbar;