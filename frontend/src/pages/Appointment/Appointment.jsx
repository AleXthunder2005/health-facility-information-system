import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import { assets } from "@assets/assets";
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
        setRecommendedSlots(data.recommendedSlots.map(slot => slot.time));
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
      <div className={`flex flex-col items-center ${styles["appointment"]}`}>
        {/* ---------- Doctor Details ----------- */}
        <div className={`flex flex-col sm:flex-row gap-4 w-full max-w-6xl ${styles["appointment__doctorDetails"]}`}>
          <div className={styles["appointment__imageContainer"]}>
            <img
                className={`bg-primary w-full sm:max-w-72 rounded-lg ${styles["appointment__doctorImage"]}`}
                src={docInfo.image}
                alt=""
            />
          </div>

          <div className={`flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 ${styles["appointment__doctorInfo"]}`}>
            {/* ----- Doc Info : name, degree, experience ----- */}

            <p className={`flex items-center gap-2 text-3xl font-medium text-gray-700 ${styles["appointment__doctorName"]}`}>
              {docInfo.name}{" "}
              <img className={`w-5 ${styles["appointment__verifiedIcon"]}`} src={assets.verified_icon} alt="" />
            </p>
            <div className={`flex items-center gap-2 mt-1 text-gray-600 ${styles["appointment__doctorCredentials"]}`}>
              <p className={styles["appointment__doctorDegree"]}>
                {docInfo.degree}
              </p>
              <button className={`py-0.5 px-2 border text-xs rounded-full ${styles["appointment__doctorExperience"]}`}>
                {docInfo.experience}
              </button>
            </div>

            {/* ----- Doc About ----- */}
            <div className={styles["appointment__aboutSection"]}>
              <p className={`flex items-center gap-1 text-sm font-medium text-[#262626] mt-3 ${styles["appointment__aboutTitle"]}`}>
                Информация о специолисте
                <img className={`w-3 ${styles["appointment__infoIcon"]}`} src={assets.info_icon} alt="" />
              </p>
              <p className={`text-sm text-gray-600 max-w-[700px] mt-1 ${styles["appointment__aboutText"]}`}>
                {docInfo.about}
              </p>
            </div>

            <p className={`text-gray-600 font-medium mt-4 ${styles["appointment__fees"]}`}>
              Стоимость посещения:{" "}
              <span className={`text-gray-800 ${styles["appointment__feesAmount"]}`}>
              {docInfo.fees} {currencySymbol}
            </span>{" "}
            </p>
          </div>
        </div>

        {/* Booking slots */}
        <div className={`flex flex-col items-center mt-8 font-medium text-[#565656] mx-4 w-full max-w-6xl ${styles["appointment__bookingSection"]}`}>
          <p className={styles["appointment__bookingTitle"]}>Досупное время записи</p>

          {recommendedSlots.length > 0 && (
              <div className={`text-sm text-primary font-medium mt-2 text-center ${styles["appointment__recommended"]}`}>
                <p className={styles["appointment__recommendedTitle"]}>Рекомендуемое время записи на прием:</p>
                <div className={`flex gap-2 mt-1 flex-wrap justify-center ${styles["appointment__recommendedList"]}`}>
                  {recommendedSlots.map((time, idx) => (
                      <span key={idx} className={`px-2 py-1 bg-blue-50 border border-primary rounded-full text-xs ${styles["appointment__recommendedTag"]}`}>
                  {time}
                </span>
                  ))}
                </div>
              </div>
          )}

          <div className={`flex gap-3 w-full max-w-xl overflow-x-scroll mt-4 justify-center ${styles["appointment__dateSlots"]}`}>
            {docSlots.length &&
                docSlots.map((item, index) => (
                    <div
                        onClick={() => setSlotIndex(index)}
                        key={index}
                        className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                            slotIndex === index ? "bg-primary text-white" : "border border-[#DDDDDD]"
                        } ${styles["appointment__dateSlot"]}`}
                    >
                      <p className={styles["appointment__dateDay"]}>{item[0]?.datetime && daysOfWeek[item[0].datetime.getDay()]}</p>
                      <p className={styles["appointment__dateNumber"]}>{item[0]?.datetime?.getDate()}</p>
                    </div>
                ))}
          </div>

          <div className={`flex gap-3 w-full overflow-x-scroll mt-5 justify-center ${styles["appointment__timeSlots"]}`}>
            {docSlots.length &&
                docSlots[slotIndex].map((item, index) => (
                    <p
                        key={index}
                        onClick={() => setSlotTime(item.time)}
                        className={`text-sm px-5 py-2 rounded-full cursor-pointer ${
                            item.time === slotTime ? "bg-primary text-white" : "text-[#949494] border border-[#B4B4B4]"
                        } ${isRecommendedSlot(item.time) ? "border-2 border-primary" : ""} ${styles["appointment__timeSlot"]}`}
                    >
                      {item.time.toLowerCase()}
                    </p>
                ))}
          </div>

          <button
              onClick={bookAppointment}
              className={`bg-primary text-white text-sm px-20 py-3 rounded-full my-6 ${styles["appointment__bookButton"]}`}
          >
            Записаться на прием
          </button>
        </div>
        <div className={`w-full max-w-6xl ${styles["appointment__relatedDoctors"]}`}>
          <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
      </div>
  ) : null;
};

export default Appointment;