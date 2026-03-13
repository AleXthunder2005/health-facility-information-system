import { useContext, useEffect, useState } from "react";
import { AppContext } from "@context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { specialityData } from "@assets/assets";
import { toast } from "react-hot-toast";
import styles from "./Doctors.module.scss";

const Doctors = () => {

  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const getSpecialityLabel = (speciality) => {
    const found = specialityData.find(
        (item) => item.speciality === speciality
    );
    return found ? found.label : "Unknown";
  };

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
      <section className="w-full px-2 md:px-10 lg:px-20 py-3">

        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-5">

            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Подберите врача
            </h1>

            <p className="text-gray-600 mt-2 ">
              Выберите специализацию и запишитесь на приём
            </p>

          </div>

          {/* Filters (перенесены наверх) */}
          <div className="flex flex-wrap gap-3 mb-5">

            <button
                onClick={() => navigate("/doctors")}
                className={`px-4 py-2 rounded-full border text-sm transition
            ${!speciality ? "bg-primary text-white border-primary" : "bg-white hover:bg-gray-100"}
            `}
            >
              Все
            </button>

            {specialityData.map((item) => (

                <button
                    key={item.speciality}
                    onClick={() =>
                        navigate(`/doctors/${item.speciality}`)
                    }
                    className={`px-4 py-2 rounded-full border text-sm transition
              ${
                        speciality === item.speciality
                            ? "bg-primary text-white border-primary"
                            : "bg-white hover:bg-gray-100"
                    }
              `}
                >
                  {item.label}
                </button>

            ))}

          </div>


          {/* Doctors List */}
          <div className="flex flex-col gap-6">

            {filterDoc.map((item, index) => (

                <div
                    key={index}
                    className="
              flex
              flex-col
              md:flex-row
              items-center
              gap-2
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-5
              hover:shadow-lg
              transition
              "
                >

                  {/* Image */}
                  <div className="w-32 h-32 rounded-xl mr-6 overflow-hidden bg-white flex-shrink-0">

                    <img
                        src={
                            import.meta.env.VITE_BACKEND_URL +
                            "/images/" +
                            item.image
                        }
                        className="w-full h-full object-contain"
                    />

                  </div>


                  {/* Info */}
                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">

                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {getSpecialityLabel(item.speciality)}
                      </span>

                    </div>

                    <div className="flex items-center gap-2 text-sm mb-3">

                  <span
                      className={`w-2 h-2 rounded-full ${
                          item.available ? "bg-green-500" : "bg-gray-400"
                      }`}
                  ></span>

                      <span className="text-gray-600">
                    {item.available ? "Есть места сегодня" : "Нет записи"}
                  </span>

                    </div>

                    <p className="text-gray-500 text-sm">
                      Онлайн консультации и приём в клинике
                    </p>

                  </div>


                  {/* Action */}
                  <div className="flex flex-col items-center gap-3">

                    <button
                        onClick={() => {
                          navigate(`/appointment/${item._id}`);
                          window.scrollTo({ top: 0 });
                        }}
                        className="
                  bg-primary
                  text-white
                  px-6
                  py-2
                  rounded-full
                  text-sm
                  hover:opacity-90
                  transition
                  "
                    >
                      Записаться
                    </button>

                  </div>

                </div>

            ))}

          </div>

        </div>

      </section>
  );
};

export default Doctors;