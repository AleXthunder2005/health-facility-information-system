import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "@context/AppContext.jsx";
import { assets } from "@assets/assets.js";
import RelatedDoctors from "@components/RelatedDoctors/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Appointment.module.scss";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
      useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(false);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [recommendedSlots, setRecommendedSlots] = useState([]);

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  // Получение рекомендуемых слотов на основе истории посещений
  const getRecommendedSlots = async () => {
    try {
      const { data } = await axios.post(
          backendUrl + "/api/user/doctor-recommended-slots",
          { docId }
      );
      console.log("Рекомендуемые слоты:", data);

      if (data.success) {
        setRecommendedSlots(data.recommendedSlots.map((slot) => slot.time));
      }
    } catch (error) {
      console.log("Ошибка при получении рекомендуемых слотов:", error);
    }
  };

  const getAvailableSolts = async () => {
    setDocSlots([]);

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
            currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
            docInfo.slots_booked[slotDate] &&
            docInfo.slots_booked[slotDate].includes(slotTime)
                ? false
                : true;

        if (isSlotAvailable) {
          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    const date = docSlots[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = day + "_" + month + "_" + year;

    try {
      const { data } = await axios.post(
          backendUrl + "/api/user/book-appointment",
          { docId, slotDate, slotTime },
          { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
      getRecommendedSlots();
    }
  }, [docInfo]);

  // Функция для проверки, является ли слот рекомендуемым
  const isRecommendedSlot = (timeSlot) => {
    return recommendedSlots.includes(timeSlot);
  };

  return docInfo ? (
      <div className={styles.appointment}>
        {/* ---------- Doctor Details ----------- */}
        <div className={styles.appointment__doctor}>
          <div>
            <img
                className={styles.appointment__image}
                src={docInfo.image}
                alt=""
            />
          </div>

          <div className={styles.appointment__card}>
            {/* ----- Doc Info : name, degree, experience ----- */}

            <p className={styles.appointment__name}>
              {docInfo.name}
              <img
                  className={styles.appointment__verified}
                  src={assets.verified_icon}
                  alt=""
              />
            </p>

            <div className={styles.appointment__degree}>
              <p>{docInfo.degree}</p>
              <button className={styles.appointment__experience}>
                {docInfo.experience}
              </button>
            </div>

            {/* ----- Doc About ----- */}
            <div>
              <p className={styles.appointment__aboutTitle}>
                Информация о специолисте
                <img
                    className={styles.appointment__infoIcon}
                    src={assets.info_icon}
                    alt=""
                />
              </p>

              <p className={styles.appointment__aboutText}>{docInfo.about}</p>
            </div>

            <p className={styles.appointment__price}>
              Стоимость посещения:
              <span>
              {docInfo.fees} {currencySymbol}
            </span>
            </p>
          </div>
        </div>

        {/* Booking slots */}
        <div className={styles.appointment__booking}>
          <p>Досупное время записи</p>

          {recommendedSlots.length > 0 && (
              <div className={styles.appointment__recommended}>
                <p>Рекомендуемое время записи на прием:</p>

                <div className={styles.appointment__recommendedList}>
                  {recommendedSlots.map((time, idx) => (
                      <span
                          key={idx}
                          className={styles.appointment__recommendedItem}
                      >
                  {time}
                </span>
                  ))}
                </div>
              </div>
          )}

          <div className={styles.appointment__days}>
            {docSlots.length &&
                docSlots.map((item, index) => (
                    <div
                        onClick={() => setSlotIndex(index)}
                        key={index}
                        className={`${styles.appointment__day} ${
                            slotIndex === index ? styles.active : ""
                        }`}
                    >
                      <p>
                        {item[0]?.datetime &&
                            daysOfWeek[item[0].datetime.getDay()]}
                      </p>
                      <p>{item[0]?.datetime?.getDate()}</p>
                    </div>
                ))}
          </div>

          <div className={styles.appointment__times}>
            {docSlots.length &&
                docSlots[slotIndex].map((item, index) => (
                    <p
                        key={index}
                        onClick={() => setSlotTime(item.time)}
                        className={`${styles.appointment__time} ${
                            item.time === slotTime ? styles.active : ""
                        } ${
                            isRecommendedSlot(item.time)
                                ? styles.recommended
                                : ""
                        }`}
                    >
                      {item.time.toLowerCase()}
                    </p>
                ))}
          </div>

          <button
              onClick={bookAppointment}
              className={styles.appointment__button}
          >
            Записаться на прием
          </button>
        </div>

        <div className={styles.appointment__related}>
          <RelatedDoctors
              speciality={docInfo.speciality}
              docId={docId}
          />
        </div>
      </div>
  ) : null;
};

export default Appointment;