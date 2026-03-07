import React from "react";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import InvoiceModal from "../../components/InvoiceModal";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  const handleSendInvoice = (appointment) => {
    setSelectedAppointment(appointment);
    setShowInvoiceModal(true);
  };

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency} {dashData.earnings}
              </p>
              <p className="text-gray-400">Заработок</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Записи</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Пациенты</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Последние записи</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <div className="w-[5%]">{index + 1}.</div>
                <div className="w-[15%]">
                  <img
                    src={item.userData.image}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                </div>
                <div className="w-[25%]">
                  <p>{item.userData.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.userData.email}
                  </p>
                </div>
                <div className="w-[20%]">
                  {/* <p className="border border-primary max-w-max px-2 rounded-full text-xs">
                    {item.payment ? "Online" : "CASH"}
                  </p> */}
                </div>
                <div className="w-[20%]">
                  <p>
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                </div>
                <div className="w-[15%]">
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Отменено</p>
                  ) : item.isCompleted ? (
                    <div className="flex items-center">
                      <p className="text-green-500 text-xs font-medium mr-2">Завершено</p>
                      <img
                        onClick={() => handleSendInvoice(item)}
                        className="w-6 cursor-pointer"
                        src={assets.invoice_icon}
                        alt="Отправить инвойс"
                        title="Отправить инвойс"
                      />
                    </div>
                  ) : (
                    <div className="flex">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 cursor-pointer"
                        src={assets.cancel_icon}
                        alt=""
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-8 cursor-pointer"
                        src={assets.tick_icon}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {showInvoiceModal && (
          <InvoiceModal
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            appointmentData={selectedAppointment}
          />
        )}
      </div>
    )
  );
};

export default DoctorDashboard;
