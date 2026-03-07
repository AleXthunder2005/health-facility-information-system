import React, { useContext, useState } from "react";
import { assets } from "@assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import styles from './Navbar.module.scss';

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
    <div className={styles.navbar__container}>
      <img
        onClick={() => navigate("/")}
        className={styles.navbar__logo}
        src={assets.logo}
        alt=""
      />
      <ul className={styles.navbar__menu}>
        <NavLink to="/">
          <li className={styles.navbar__item}>Главная страница</li>
          <hr className={styles.navbar__underline} />
        </NavLink>
        <NavLink to="/doctors">
          <li className={styles.navbar__item}>Список докторов</li>
          <hr className={styles.navbar__underline} />
        </NavLink>
        <NavLink to="/about">
          <li className={styles.navbar__item}>О нас</li>
          <hr className={styles.navbar__underline} />
        </NavLink>
        <NavLink to="/contact">
          <li className={styles.navbar__item}>Свяжись с нами</li>
          <hr className={styles.navbar__underline} />
        </NavLink>
      </ul>

      <div className={styles.navbar__userSection}>
        {token && userData ? (
          <div className={styles.navbar__user}>
            <img className={styles.navbar__userImage} src={userData.image} alt="" />
            <img className={styles.navbar__dropdownIcon} src={assets.dropdown_icon} alt="" />
            <div className={styles.navbar__dropdownMenu}>
              <div className={styles.navbar__dropdownContent}>
                <p
                  onClick={() => navigate("/my-profile")}
                  className={styles.navbar__dropdownItem}
                >
                  Мой профиль
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className={styles.navbar__dropdownItem}
                >
                  Мои записи
                </p>
                <p onClick={logout} className={styles.navbar__dropdownItem}>
                  Выйти
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className={styles.navbar__loginButton}
          >
            Создать аккаунт
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className={styles.navbar__menuIcon}
          src={assets.menu_icon}
          alt=""
        />

        {/* ---- Mobile Menu ---- */}
        <div
          className={`${styles.navbar__mobileMenu} ${showMenu ? styles["navbar__mobileMenu--open"] : ""}`}
        >
          <div className={styles.navbar__mobileHeader}>
            <img src={assets.logo} className={styles.navbar__mobileLogo} alt="" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className={styles.navbar__mobileClose}
              alt=""
            />
          </div>
          <ul className={styles.navbar__mobileList}>
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className={styles.navbar__mobileItem}>Главная</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className={styles.navbar__mobileItem}>Все доктора</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className={styles.navbar__mobileItem}>О нас</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className={styles.navbar__mobileItem}>
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
