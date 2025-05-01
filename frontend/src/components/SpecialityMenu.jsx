import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 pt-14 text-[#262626]"
    >
      <h1 className="text-3xl font-medium">Найти специолиста</h1>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll ">
        {specialityData.map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-base cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img
              className="w-16 sm:w-24 mb-2 "
              src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
              alt=""
            />
            <p>{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
