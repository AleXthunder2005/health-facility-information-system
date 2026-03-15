import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorPatients = () => {
  const { dToken, patients, getPatients } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("completedAppointments");

  useEffect(() => {
    if (dToken) getPatients();
  }, [dToken]);

  const filteredPatients = patients.filter(
      (p) =>
          p.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.userData.email &&
              p.userData.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortOption) {
      case "completedAppointments":
        return b.completedAppointments - a.completedAppointments;
      case "totalAppointments":
        return b.totalAppointments - a.totalAppointments;
      case "lastAppointment":
        return new Date(b.lastAppointmentDate) - new Date(a.lastAppointmentDate);
      case "name":
        return a.userData.name.localeCompare(b.userData.name);
      default:
        return b.completedAppointments - a.completedAppointments;
    }
  });

  return (
      <div className="w-full max-w-6xl m-5 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Пациенты</h1>
          <div className="flex gap-3">
            <input
                type="text"
                placeholder="Поиск пациентов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="completedAppointments">Завершённые приёмы</option>
              <option value="totalAppointments">Общее количество приёмов</option>
              <option value="lastAppointment">Последний приём</option>
              <option value="name">Имя</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPatients.length > 0 ? (
              sortedPatients.map((patient, index) => (
                  <div
                      key={patient.userId}
                      onClick={() => navigate(`/patient-history/${patient.userId}`)}
                      className="bg-white rounded-2xl shadow hover:shadow-lg p-5 cursor-pointer transition flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <img
                            src={patient.userData.image || assets.white_user}
                            alt="Пациент"
                            className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 truncate">{patient.userData.name}</p>
                        <p className="text-xs text-gray-500 truncate">{patient.userData.email || "Нет email"}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <p>Возраст: {calculateAge(patient.userData.dob) ? calculateAge(patient.userData.dob) : "-"}</p>
                      <p className="font-medium text-primary">Завершено: {patient.completedAppointments}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Приёмов: {patient.totalAppointments}</p>
                      <p>Последний: {slotDateFormat(patient.appointments[0]?.slotDate) || "Н/Д"}</p>
                    </div>
                  </div>
              ))
          ) : (
              <p className="text-center text-gray-500 col-span-full">
                {searchTerm ? "Пациенты не найдены" : "Список пациентов пуст"}
              </p>
          )}
        </div>
      </div>
  );
};

export default DoctorPatients;
