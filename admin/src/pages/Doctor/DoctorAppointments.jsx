import React, { useContext, useEffect, useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import CancelModal from "../../components/CancelModal";
import VisitResultModal from "../../components/VisitResultModal";

const DoctorAppointments = () => {

  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment
  } = useContext(DoctorContext);

  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [cancelAppointmentTarget, setCancelAppointmentTarget] = useState(null);
  const [visitResultTarget, setVisitResultTarget] = useState(null);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const allAppointments = useMemo(
      () => appointments || [],
      [appointments]
  );

  const sortedAppointments = useMemo(() => {
    return [...allAppointments].sort((a, b) => {

      const [d1, m1, y1] = a.slotDate.split("_").map(Number);
      const [d2, m2, y2] = b.slotDate.split("_").map(Number);

      const [h1, min1] = a.slotTime.split(":").map(Number);
      const [h2, min2] = b.slotTime.split(":").map(Number);

      const dateA = new Date(y1, m1 - 1, d1, h1, min1);
      const dateB = new Date(y2, m2 - 1, d2, h2, min2);

      return dateB - dateA;
    });
  }, [allAppointments]);

  return (
      <div className="w-full p-6 space-y-6">

        <div className="bg-white rounded-xl shadow max-h-[78vh] overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Все записи
            </h2>
          </div>

          <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr] px-6 py-4 border-b text-sm font-medium text-gray-500 bg-gray-50">
            <p></p>
            <p>Пациент</p>
            <p>Возраст</p>
            <p>Дата и время</p>
            <p>Стоимость</p>
            <p className="text-center">Статус</p>
          </div>

          <div className="max-h-[70vh] overflow-y-auto divide-y">

            {sortedAppointments.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  Записей нет
                </div>
            )}

            {sortedAppointments.map((item, index) => (

                <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr] px-6 py-4 items-center text-sm text-gray-600 hover:bg-gray-50 transition"
                >

                  <p className="hidden md:block">{index + 1}</p>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                      <img src={assets.white_user} className="w-6" />
                    </div>
                    <p className="font-medium text-gray-800">
                      {item.userData.name}
                    </p>
                  </div>

                  <p className="hidden md:block">
                    {!isNaN(calculateAge(item.userData.dob))
                        ? calculateAge(item.userData.dob)
                        : "-"}
                  </p>

                  <p>
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>

                  <p className="font-medium text-gray-800">
                    {item.isCompleted ? `${item.amount} ${currency}` : "-"}
                  </p>

                  <div className="flex justify-center">

                    {item.cancelled ? (

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Отменен
                  </span>

                    ) : item.isCompleted ? (

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    Завершен
                  </span>

                    ) : (

                        <div className="flex gap-2">

                          <img
                              onClick={() => setCancelAppointmentTarget(item)}
                              className="w-8 cursor-pointer"
                              src={assets.cancel_icon}
                          />

                          <img
                              onClick={() => setVisitResultTarget(item)}
                              className="w-8 cursor-pointer"
                              src={assets.tick_icon}
                          />

                        </div>

                    )}

                  </div>

                </div>

            ))}

          </div>
        </div>

        {cancelAppointmentTarget && (
            <CancelModal
                appointment={cancelAppointmentTarget}
                onClose={() => setCancelAppointmentTarget(null)}
                onConfirm={() => {
                  cancelAppointment(cancelAppointmentTarget._id);
                  setCancelAppointmentTarget(null);
                }}
            />
        )}

        {visitResultTarget && (
            <VisitResultModal
                appointment={visitResultTarget}
                currency={currency}
                onClose={() => setVisitResultTarget(null)}
                onComplete={(visitData) => {
                  console.log("Visit data:", visitData);
                  completeAppointment(visitResultTarget._id);
                  setVisitResultTarget(null);
                }}
            />
        )}

      </div>
  );
};

export default DoctorAppointments;
