import { useContext, useEffect, useState } from "react";
import { AppContext } from "@context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { specialityData } from "@assets/assets";
import { toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import styles from "./Doctors.module.scss";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const navigate = useNavigate();
  const { doctors, patients } = useContext(AppContext);

  const getSpecialityLabel = (speciality) => {
    const foundSpeciality = specialityData.find(
        (item) => item.speciality === speciality
    );
    return foundSpeciality ? foundSpeciality.label : "Unknown";
  };

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  const [desiredTime, setDesiredTime] = useState("");
  const [isTimeEntered, setIsTimeEntered] = useState(false); // для контроля показа popup

  const handleOptimalBooking = () => {
    if (!desiredTime) {
      toast.error("Пожалуйста, введите желаемое время записи");
      return;
    }

    if (!filterDoc?.length) {
      toast.error("Нет доступных врачей");
      return;
    }

    const randomDoctor = filterDoc[Math.floor(Math.random() * filterDoc.length)];
    setSelectedDoctor({ doctor: randomDoctor, time: desiredTime });
    setShowPopup(true);
    setIsTimeEntered(true);
    setDesiredTime(""); // опционально — очищаем после использования
  };


  const confirmBooking = () => {
    toast.success(`Пациент записан к врачу ${selectedDoctor.doctor.name}`);
    setShowPopup(false);
  };

  const cancelBooking = () => {
    toast("Запись отменена");
    setShowPopup(false);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
      <div className={styles["doctors"]}>
        <div className={`my-4 flex flex-col sm:flex-row items-center gap-4 ${styles["doctors__booking"]}`}>
          <input
              type="datetime-local"
              value={desiredTime}
              onChange={(e) => setDesiredTime(e.target.value)}
              className={`border p-2 rounded text-sm ${styles["doctors__timeInput"]}`}
          />
          <button
              onClick={handleOptimalBooking}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${styles["doctors__bookingButton"]}`}
          >
            Записаться
          </button>
        </div>

        <p className={`text-gray-600 ${styles["doctors__subtitle"]}`}>Cписок врачей-специалистов.</p>

        <Dialog open={showPopup} onClose={() => setShowPopup(false)} className={`fixed z-10 inset-0 overflow-y-auto ${styles["doctors__dialog"]}`}>
          <div className={`flex items-center justify-center min-h-screen px-4 ${styles["doctors__dialogOverlay"]}`}>
            <div className={`fixed inset-0 bg-black opacity-30 ${styles["doctors__dialogBackdrop"]}`} aria-hidden="true" />
            <div className={`bg-white p-6 rounded-xl z-20 shadow-xl w-full max-w-md ${styles["doctors__dialogContent"]}`}>
              <Dialog.Title className={`text-lg font-bold mb-4 ${styles["doctors__dialogTitle"]}`}>Подтверждение записи</Dialog.Title>
              {selectedDoctor && (
                  <div className={`mb-4 ${styles["doctors__dialogDoctorInfo"]}`}>
                    <p className={styles["doctors__dialogDoctorName"]}>Врач: {selectedDoctor.doctor.name}</p>
                    <p className={styles["doctors__dialogDoctorSpeciality"]}>Специальность: {getSpecialityLabel(selectedDoctor.doctor.speciality)}</p>
                  </div>
              )}
              <div className={`flex justify-end gap-2 ${styles["doctors__dialogActions"]}`}>
                <button onClick={cancelBooking} className={`px-4 py-2 border rounded text-sm ${styles["doctors__dialogCancelButton"]}`}>Отмена</button>
                <button onClick={confirmBooking} className={`px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 ${styles["doctors__dialogConfirmButton"]}`}>Подтвердить</button>
              </div>
            </div>
          </div>
        </Dialog>


        <div className={`flex flex-col sm:flex-row items-start gap-5 mt-5 ${styles["doctors__content"]}`}>
          <button
              onClick={() => setShowFilter(!showFilter)}
              className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""} ${styles["doctors__filterToggle"]}`}
          >
            Filters
          </button>

          <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"} ${styles["doctors__filterSidebar"]}`}>
            {specialityData.map((item) => (
                <p
                    key={item.speciality}
                    onClick={() => navigate(speciality === item.speciality ? "/doctors" : `/doctors/${item.speciality}`)}
                    className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === item.speciality ? "bg-[#E2E5FF] text-black" : ""} ${styles["doctors__filterItem"]}`}
                >
                  {item.label}
                </p>
            ))}
          </div>

          <div className={`w-full grid grid-cols-auto gap-4 gap-y-6 ${styles["doctors__grid"]}`}>
            {filterDoc.map((item, index) => (
                <div
                    onClick={() => {
                      navigate(`/appointment/${item._id}`);
                      scrollTo(0, 0);
                    }}
                    className={`border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ${styles["doctors__card"]}`}
                    key={index}
                >
                  <img
                      className={`bg-[#EAEFFF] h-60 object-cover ${styles["doctors__cardImage"]}`}
                      src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
                      alt=""
                  />
                  <div className={`p-4 ${styles["doctors__cardContent"]}`}>
                    <div
                        className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-gray-500"} ${styles["doctors__availability"]}`}
                    >
                      <p className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-500"} ${styles["doctors__availabilityDot"]}`}></p>
                      <p className={styles["doctors__availabilityText"]}>{item.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className={`text-[#262626] text-lg font-medium ${styles["doctors__doctorName"]}`}>{item.name}</p>
                    <p className={`text-[#5C5C5C] text-sm ${styles["doctors__doctorSpeciality"]}`}>{getSpecialityLabel(item.speciality)}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Doctors;