import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  // Универсальные классы для NavLink
  const navItemClasses = ({ isActive }) =>
      `flex items-center gap-2 py-2 px-5 rounded-xl cursor-pointer transition-colors w-full ${
          isActive
              ? "bg-[#F2F3FF] text-primary font-semibold"
              : "text-gray-600 hover:bg-gray-100"
      }`;

  const navTextClasses = "hidden md:block truncate"; // текст скрыт на маленьких экранах, длинные строки обрезаются
  const iconClasses = "w-5 h-5 mr-2 flex-shrink-0"; // фиксированный размер иконки

  return (
      <div className="w-80 bg-white border-r p-4 flex flex-col">
        {/* Admin Menu */}
        {aToken && (
            <ul className="flex flex-col gap-1 mt-5">
                <NavLink to="/admin-dashboard" className={navItemClasses}>
                    <img className={iconClasses} src={assets.home_icon} alt="" />
                    <p className={navTextClasses}>О системе</p>
                </NavLink>
                <NavLink to="/all-appointments" className={navItemClasses}>
                    <img className={iconClasses} src={assets.appointment_icon} alt="" />
                    <p className={navTextClasses}>Все записи</p>
                </NavLink>
                <NavLink to="/doctor-list" className={navItemClasses}>
                    <img className={iconClasses} src={assets.people_icon} alt="" />
                    <p className={navTextClasses}>Все врачи</p>
                </NavLink>
                <NavLink to="/add-doctor" className={navItemClasses}>
                    <img className={iconClasses} src={assets.add_icon} alt="" />
                    <p className={navTextClasses}>Добавить врача</p>
                </NavLink>
                <NavLink to="/patient-list" className={navItemClasses}>
                    <img className={iconClasses} src={assets.people_icon} alt="" />
                    <p className={navTextClasses}>Все пациенты</p>
                </NavLink>
                <NavLink to="/service-list" className={navItemClasses}>
                    <img className={`${iconClasses} w-10`} src={assets.service} alt="" />
                    <p className={navTextClasses}>Все услуги</p>
                </NavLink>
                <NavLink to="/doctor-patients-admin" className={navItemClasses}>
                    <img className={iconClasses} src={assets.patient_icon} alt="" />
                    <p className={navTextClasses}> Врачи и пациенты</p>
                </NavLink>
            </ul>
        )}

        {/* Doctor Menu */}
        {dToken && (
            <ul className="flex flex-col gap-2 mt-5">
              <NavLink to="/doctor-dashboard" className={navItemClasses}>
                <img className={iconClasses} src={assets.home_icon} alt="" />
                <p className={navTextClasses}>Личный кабинет</p>
              </NavLink>
              <NavLink to="/doctor-appointments" className={navItemClasses}>
                <img className={iconClasses} src={assets.appointment_icon} alt="" />
                <p className={navTextClasses}>Записи</p>
              </NavLink>
              <NavLink to="/doctor-patients" className={navItemClasses}>
                <img className={iconClasses} src={assets.people_icon} alt="" />
                <p className={navTextClasses}>Пациенты</p>
              </NavLink>
              <NavLink to="/doctor-profile" className={navItemClasses}>
                <img className={iconClasses} src={assets.patient_icon} alt="" />
                <p className={navTextClasses}>Профиль</p>
              </NavLink>
            </ul>
        )}
      </div>
  );
};

export default Sidebar;