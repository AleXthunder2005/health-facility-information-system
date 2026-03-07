import React, { useContext, useEffect, useState } from "react";
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
    <div>
      <div className={styles.doctors__booking}>
        <input
          type="datetime-local"
          value={desiredTime}
          onChange={(e) => setDesiredTime(e.target.value)}
          className={styles.doctors__input}
        />
        <button
          onClick={handleOptimalBooking}
          className={styles.doctors__bookButton}
        >
          Записаться
        </button>
      </div>

      <p className={styles.doctors__description}>Cписок врачей-специалистов.</p>

      <Dialog open={showPopup} onClose={() => setShowPopup(false)} className={styles.doctors__dialog}>
        <div className={styles.doctors__dialogOverlay}>
          <div className={styles.doctors__dialogBackdrop} aria-hidden="true" />
          <div className={styles.doctors__dialogContent}>
            <Dialog.Title className={styles.doctors__dialogTitle}>Подтверждение записи</Dialog.Title>
            {selectedDoctor && (
              <div className={styles.doctors__dialogInfo}>
                <p>Врач: {selectedDoctor.doctor.name}</p>
                <p>Специальность: {getSpecialityLabel(selectedDoctor.doctor.speciality)}</p>
              </div>
            )}
            <div className={styles.doctors__dialogActions}>
              <button onClick={cancelBooking} className={styles.doctors__dialogCancel}>Отмена</button>
              <button onClick={confirmBooking} className={styles.doctors__dialogConfirm}>Подтвердить</button>
            </div>
          </div>
        </div>
      </Dialog>

      <div className={styles.doctors__content}>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`${styles.doctors__filterButton} ${showFilter ? styles["doctors__filterButton--active"] : ""}`}
        >
          Filters
        </button>

        <div className={`${styles.doctors__filters} ${showFilter ? styles["doctors__filters--visible"] : styles["doctors__filters--hidden"]}`}>
          {specialityData.map((item) => (
            <p
              key={item.speciality}
              onClick={() => navigate(speciality === item.speciality ? "/doctors" : `/doctors/${item.speciality}`)}
              className={`${styles.doctors__filterItem} ${speciality === item.speciality ? styles["doctors__filterItem--active"] : ""}`}
            >
              {item.label}
            </p>
          ))}
        </div>

        <div className={styles.doctors__grid}>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className={styles.doctors__card}
              key={index}
            >
              <img
                className={styles.doctors__cardImage}
                src={import.meta.env.VITE_BACKEND_URL + "/images/" + item.image}
                alt=""
              />
              <div className={styles.doctors__cardBody}>
                <div className={`${styles.doctors__status} ${item.available ? styles["doctors__status--available"] : styles["doctors__status--unavailable"]}`}>
                  <p className={`${styles.doctors__statusDot} ${item.available ? styles["doctors__statusDot--available"] : styles["doctors__statusDot--unavailable"]}`}></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className={styles.doctors__cardName}>{item.name}</p>
                <p className={styles.doctors__cardSpeciality}>{getSpecialityLabel(item.speciality)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
