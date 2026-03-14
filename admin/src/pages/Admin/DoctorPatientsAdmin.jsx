import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorPatientsAdmin = () => {
  const {
    aToken,
    doctors,
    getAllDoctors,
    getDoctorPatients,
    doctorPatients,
    selectedDoctor
  } = useContext(AdminContext);

  const { calculateAge, slotDateFormat } = useContext(AppContext);

  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("completedAppointments");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  const handleDoctorSelect = async (doctorId) => {
    if (!doctorId) return;
    setIsLoading(true);
    setSelectedDoctorId(doctorId);
    await getDoctorPatients(doctorId);
    setIsLoading(false);
    setPatientSearchTerm("");
  };

  const filteredDoctors = doctors.filter(
      doctor =>
          doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
          doctor.label?.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  const filteredPatients = doctorPatients.filter(
      patient =>
          patient.userData.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
          (patient.userData.email && patient.userData.email.toLowerCase().includes(patientSearchTerm.toLowerCase()))
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
      <div className="w-full p-6 space-y-6">
        {/* Выбор врача */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Выберите врача для просмотра его пациентов</h2>
          <div className="bg-white rounded-xl shadow p-4">
            <input
                type="text"
                placeholder="Поиск врача..."
                value={doctorSearchTerm}
                onChange={(e) => setDoctorSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-4"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredDoctors.map(doctor => (
                  <div
                      key={doctor._id}
                      onClick={() => handleDoctorSelect(doctor._id)}
                      className={`border p-4 rounded-lg cursor-pointer transition-all hover:border-primary ${
                          selectedDoctorId === doctor._id ? "border-primary bg-[#F2F3FF]" : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                          src={import.meta.env.VITE_BACKEND_URL + "/images/" + doctor.image}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.label || doctor.speciality}</p>
                      </div>
                    </div>
                  </div>
              ))}
              {filteredDoctors.length === 0 && (
                  <div className="col-span-3 py-6 text-center text-gray-500">Врачи не найдены</div>
              )}
            </div>
          </div>
        </div>

        {/* Список пациентов выбранного врача */}
        {selectedDoctor && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Пациенты врача: {selectedDoctor.name}</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                      type="text"
                      placeholder="Поиск пациентов..."
                      value={patientSearchTerm}
                      onChange={(e) => setPatientSearchTerm(e.target.value)}
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

              <div className="bg-white rounded-xl shadow overflow-hidden">
                {/* Заголовок таблицы */}
                <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] px-6 py-3 border-b text-sm font-medium text-gray-500 bg-gray-50">
                  <p></p>
                  <p>Пациент</p>
                  <p>Возраст</p>
                  <p>Завершено</p>
                  <p>Общее количество</p>
                  <p>Последний прием</p>
                </div>

                {/* Список пациентов */}
                {isLoading ? (
                    <div className="py-10 text-center text-gray-500">Загрузка данных...</div>
                ) : sortedPatients.length > 0 ? (
                    <div className="max-h-[62vh] overflow-y-auto divide-y">
                      {sortedPatients.map((patient, index) => (
                          <div
                              key={patient.userId}
                              className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] px-6 py-4 items-center text-sm text-gray-600 hover:bg-gray-50 transition"
                          >
                            <p className="hidden md:block">{index + 1}</p>

                            {/* Пациент */}
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                                <img src={assets.white_user} className="w-6" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{patient.userData.name}</p>
                                <p className="text-xs text-gray-500">{patient.userData.email || "Нет email"}</p>
                              </div>
                            </div>

                            {/* Возраст */}
                            <p className="hidden md:block">{!isNaN(calculateAge(patient.userData.dob)) ? calculateAge(patient.userData.dob) : '-'}</p>

                            {/* Завершенные */}
                            <p className="font-medium text-primary">{patient.completedAppointments}</p>

                            {/* Общее */}
                            <p>{patient.totalAppointments}</p>

                            {/* Последний прием */}
                            <p>{slotDateFormat(patient.appointments[0]?.slotDate) || "Н/Д"}</p>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-500">
                      {patientSearchTerm ? "Пациенты не найдены" : "Список пациентов пуст"}
                    </div>
                )}
              </div>

              {/* Статистика */}
              <div className="mt-2 text-sm text-gray-500">
                <p>Всего пациентов: <span className="font-medium">{doctorPatients.length}</span></p>
              </div>
            </div>
        )}
      </div>
  );
};

export default DoctorPatientsAdmin;
