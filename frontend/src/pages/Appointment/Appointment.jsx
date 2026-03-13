import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import RelatedDoctors from "@components/RelatedDoctors/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {

  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
      useContext(AppContext);

  const [docInfo, setDocInfo] = useState(false);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [recommendedSlots, setRecommendedSlots] = useState([]);

  const scrollRef = useRef(null);

  const daysOfWeek = ["ВС","ПН","ВТ","СР","ЧТ","ПТ","СБ"];

  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getRecommendedSlots = async () => {
    try {

      const { data } = await axios.post(
          backendUrl + "/api/user/doctor-recommended-slots",
          { docId }
      );

      if (data.success) {
        setRecommendedSlots(data.recommendedSlots.map((slot) => slot.time));
      }

    } catch (error) {
      console.log(error);
    }
  };

  const getAvailableSolts = () => {

    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 30; i++) {

      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

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

        const isSlotAvailable =
            docInfo.slots_booked[slotDate] &&
            docInfo.slots_booked[slotDate].includes(formattedTime)
                ? false
                : true;

        if (isSlotAvailable) {

          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });

        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);

      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const bookAppointment = async () => {

    if (!token) {
      toast.warning("Войдите в систему");
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

      toast.error(error.message);

    }

  };

  useEffect(() => {
    if (doctors.length > 0) fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
      getRecommendedSlots();
    }
  }, [docInfo]);

  const isRecommendedSlot = (timeSlot) => {
    return recommendedSlots.includes(timeSlot);
  };

  return docInfo ? (

      <section className="w-full px-4 md:px-10 lg:px-20 py-6">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

          {/* Doctor Card */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm h-fit">

            <div className="w-full h-56 rounded-xl overflow-hidden bg-white flex items-center justify-center mb-4">

              <img
                  src={
                      import.meta.env.VITE_BACKEND_URL +
                      "/images/" +
                      docInfo.image
                  }
                  className="max-h-full object-contain"
              />

            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              {docInfo.name}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {docInfo.speciality}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {docInfo.degree}
            </p>

            <p className="text-sm text-gray-500">
              {docInfo.experience}
            </p>

            <p className="text-sm mt-3 text-gray-600">
              Стоимость: {docInfo.fees} {currencySymbol}
            </p>

            <p className="text-sm text-gray-500 mt-4">
              {docInfo.about}
            </p>

          </div>

          {/* Booking */}

          <div className="lg:col-span-2">

            <h2 className="text-2xl font-semibold mb-4">
              Выберите дату
            </h2>

            {/* Date slider */}

            <div className="flex items-center gap-2 mb-6">

              <button
                  onClick={scrollLeft}
                  className="border rounded-lg px-3 py-2 bg-white hover:bg-gray-50"
              >
                ←
              </button>

              <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide"
              >

                {docSlots.length &&
                    docSlots.map((item, index) => (

                        <button
                            key={index}
                            onClick={() => setSlotIndex(index)}
                            className={`min-w-[70px] border rounded-lg py-3 text-sm transition
                    ${
                                slotIndex === index
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >

                          <div className="font-medium">
                            {daysOfWeek[item[0]?.datetime.getDay()]}
                          </div>

                          <div className="text-xs">
                            {item[0]?.datetime.getDate()}
                          </div>

                        </button>

                    ))}

              </div>

              <button
                  onClick={scrollRight}
                  className="border rounded-lg px-3 py-2 bg-white hover:bg-gray-50"
              >
                →
              </button>

            </div>

            <h2 className="text-2xl font-semibold mb-4">
              Доступное время
            </h2>

            {/* Time */}

            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">

              {docSlots.length &&
                  docSlots[slotIndex].map((item, index) => (

                      <button
                          key={index}
                          onClick={() => setSlotTime(item.time)}
                          className={`border rounded-lg py-2 text-sm transition
                  ${
                              item.time === slotTime
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white hover:bg-gray-50"
                          }
                  ${
                              isRecommendedSlot(item.time)
                                  ? "border-primary"
                                  : ""
                          }`}
                      >
                        {item.time}
                      </button>

                  ))}

            </div>

            {recommendedSlots.length > 0 && (
                <p className="text-xs text-primary mt-2">
                  * Рекомендуемое время выделено рамкой
                </p>
            )}

            <button
                onClick={bookAppointment}
                className="mt-8 bg-primary text-white px-8 py-3 rounded-full hover:opacity-90 transition"
            >
              Записаться на прием
            </button>

          </div>

        </div>

        {/* Related Doctors */}

        <div className="mt-16">

          <RelatedDoctors
              speciality={docInfo.speciality}
              docId={docId}
          />

        </div>

      </section>

  ) : null;
};

export default Appointment;