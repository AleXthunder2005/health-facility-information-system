import React, { useContext, useEffect, useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import CancelModal from "../../components/CancelModal";
import VisitResultModal from "../../components/VisitResultModal";

const DoctorDashboard = () => {
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

  const today = new Date();

  const todaySlotDate = `${today.getDate().toString()}_${(today.getMonth() + 1).toString()}_${today.getFullYear()}`;

  const allAppointments = useMemo(
      () => appointments || [],
      [appointments]
  );

  const completedAppointments = useMemo(
      () => allAppointments.filter((a) => a.isCompleted && !a.cancelled),
      [allAppointments]
  );

  const todayAppointments = useMemo(() => {
    return allAppointments
        .filter((a) => a.slotDate === todaySlotDate)
        .slice()
        .sort((a, b) => {
          const [h1, m1] = a.slotTime.split(":").map(Number);
          const [h2, m2] = b.slotTime.split(":").map(Number);

          const t1 = h1 * 60 + m1;
          const t2 = h2 * 60 + m2;

          return t1 - t2;
        });
  }, [allAppointments, todaySlotDate]);

  const todayCompleted = useMemo(
      () => todayAppointments.filter((a) => a.isCompleted && !a.cancelled),
      [todayAppointments]
  );

  const todayIncome = useMemo(
      () => todayCompleted.reduce((sum, a) => sum + a.amount, 0),
      [todayCompleted]
  );

  const totalIncome = useMemo(
      () => completedAppointments.reduce((sum, a) => sum + a.amount, 0),
      [completedAppointments]
  );

  return (
      <div className="w-full p-6 space-y-6">

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
              icon={assets.notice}
              title="Приёмы сегодня"
              value={`${todayCompleted.length} / ${todayAppointments.length}`}
          />
          <Card
              icon={assets.money_bag}
              title="Доход за сегодня"
              value={`${todayIncome} ${currency}`}
          />
          <Card
              icon={assets.notice}
              title="Все приёмы"
              value={`${completedAppointments.length} / ${allAppointments.length}`}
          />
          <Card
              icon={assets.money_bag}
              title="Суммарный доход"
              value={`${totalIncome} ${currency}`}
          />
        </div>

        {/* Таблица сегодняшних записей */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Сегодняшние записи
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

          <div className="max-h-[37vh] overflow-y-auto divide-y">

            {todayAppointments.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  Сегодня записей нет
                </div>
            )}

            {todayAppointments.map((item, index) => (
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

const Card = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-4">
        <div className="w-14 h-14 min-w-[56px] min-h-[56px] bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <img src={icon} className="w-7 h-7" />
        </div>
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
);

export default DoctorDashboard;
