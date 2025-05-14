import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorPatients = () => {
  const { dToken, patients, getPatients } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("completedAppointments");

  useEffect(() => {
    if (dToken) {
      getPatients();
    }
  }, [dToken]);

  // Фильтрация пациентов по поисковому запросу
  const filteredPatients = patients.filter(patient => 
    patient.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.userData.email && patient.userData.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Сортировка пациентов по выбранному критерию
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortOption) {
      case "completedAppointments":
        return b.completedAppointments - a.completedAppointments;
      case "totalAppointments":
        return b.totalAppointments - a.totalAppointments;
      case "lastAppointment":
        return b.lastAppointmentDate - a.lastAppointmentDate;
      case "name":
        return a.userData.name.localeCompare(b.userData.name);
      default:
        return b.completedAppointments - a.completedAppointments;
    }
  });

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex justify-between items-center mb-5">
        <p className="text-lg font-medium">Список пациентов</p>
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
            <option value="completedAppointments">По количеству завершенных приемов</option>
            <option value="totalAppointments">По общему количеству приемов</option>
            <option value="lastAppointment">По дате последнего приема</option>
            <option value="name">По имени</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded text-sm">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b font-medium">
          <p>№</p>
          <p>Пациент</p>
          <p>Возраст</p>
          <p>Завершенные приемы</p>
          <p>Общее кол-во</p>
          <p>Последний прием</p>
        </div>

        {sortedPatients.length > 0 ? (
          <div className="max-h-[70vh] overflow-y-auto">
            {sortedPatients.map((patient, index) => (
              <div
                key={patient.userId}
                className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              >
                <p>{index + 1}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={patient.userData.image}
                    className="w-8 h-8 rounded-full"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-gray-700">{patient.userData.name}</p>
                    <p className="text-xs text-gray-500">{patient.userData.email || "Нет email"}</p>
                  </div>
                </div>
                <p>{patient.userData.dob ? calculateAge(patient.userData.dob) : "Н/Д"}</p>
                <p className="font-medium text-primary">{patient.completedAppointments}</p>
                <p>{patient.totalAppointments}</p>
                <p>{slotDateFormat(patient.appointments[0]?.slotDate) || "Н/Д"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {searchTerm ? "Пациенты не найдены" : "Список пациентов пуст"}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Всего пациентов: <span className="font-medium">{patients.length}</span></p>
        <p>Отфильтровано: <span className="font-medium">{filteredPatients.length}</span></p>
      </div>
    </div>
  );
};

export default DoctorPatients; 