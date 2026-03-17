import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets, specialityData } from "../../assets/assets";

const PatientHistory = () => {
    const { patientId } = useParams();
    const { getPatientHistory } = useContext(DoctorContext);
    const { currency } = useContext(AppContext);

    const [history, setHistory] = useState([]);
    const [selectedVisit, setSelectedVisit] = useState(null);

    useEffect(() => {
        getPatientHistory(patientId).then((res) => setHistory(res));
    }, [patientId]);

    // Форматируем дату "18_3_2026" -> "18.03.2026"
    const formatDate = (slotDate) => {
        if (!slotDate) return "";
        const [day, month, year] = slotDate.split("_");
        const dd = day.padStart(2, "0");
        const mm = month.padStart(2, "0");
        return `${dd}.${mm}.${year}`;
    };

    // Название специализации
    const getSpecialityLabel = (speciality) => {
        const found = specialityData.find((item) => item.speciality === speciality);
        return found ? found.label : "Специализация не указана";
    };

    // Итоговая стоимость = primaryPrice + услуги
    const totalPrice = (primaryPrice, services) =>
        Number(primaryPrice) + services.reduce((sum, s) => sum + Number(s.price), 0);

    return (
        <section className="w-full px-4 md:px-10 lg:px-20 py-5">
            <h1 className="text-3xl font-semibold">История приёмов пациента</h1>

            {history.length > 0 ? (
                <div className="flex flex-col gap-5 mt-5">
                    {history.map((visit) => (
                        <div
                            key={visit._id}
                            onClick={() => setSelectedVisit(visit)}
                            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg cursor-pointer transition"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                                        <img
                                            src={
                                                visit.docId?.image
                                                    ? import.meta.env.VITE_BACKEND_URL + "/images/" + visit.docId.image
                                                    : assets.doctor_male
                                            }
                                            className={visit.docId?.image ? "w-full h-full object-cover" : "w-10"}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {visit.docId?.name || "Врач не указан"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {getSpecialityLabel(visit.docId?.speciality)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(visit.slotDate)} • {visit.slotTime}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-primary text-sm">Подробнее</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 py-10 text-center">История приёмов отсутствует</p>
            )}

            {/* Modal */}
            {selectedVisit && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-xl">
                        <button
                            onClick={() => setSelectedVisit(null)}
                            className="absolute top-4 right-4"
                        >
                            <img src={assets.cross_icon} className="w-6" />
                        </button>

                        {/* Header доктора */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                                <img
                                    src={
                                        selectedVisit.docId?.image
                                            ? import.meta.env.VITE_BACKEND_URL + "/images/" + selectedVisit.docId.image
                                            : assets.doctor_male
                                    }
                                    className={selectedVisit.docId?.image ? "w-full h-full object-cover" : "w-10"}
                                />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {selectedVisit.docId?.name || "Врач не указан"}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {getSpecialityLabel(selectedVisit.docId?.speciality)}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {formatDate(selectedVisit.slotDate)} • {selectedVisit.slotTime}
                                </p>
                            </div>
                        </div>

                        {/* Жалобы пациента */}
                        <div className="mb-4">
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.virus_research} className="w-6" />
                                Жалобы пациента
                            </p>
                            <p className="text-gray-600 text-sm">{selectedVisit.complaints || "Не указано"}</p>
                        </div>

                        {/* Пометки врача */}
                        <div className="mb-4">
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.notice_icon} className="w-6" />
                                Пометки врача
                            </p>
                            <p className="text-gray-600 text-sm">{selectedVisit.notes || "Приём успешно проведён"}</p>
                        </div>

                        {/* Рекомендации */}
                        <div className="mb-6">
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.recommendations_icon} className="w-6" />
                                Рекомендации
                            </p>
                            <p className="text-gray-600 text-sm">
                                {selectedVisit.recommendations || "Следуйте рекомендациям врача"}
                            </p>
                        </div>

                        {/* Услуги */}
                        <div className="mb-6">
                            <p className="font-semibold mb-3 flex items-center gap-2">
                                <img src={assets.heart_cardiogram} className="w-6" />
                                Оказанные услуги
                            </p>
                            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                                {/* Первичный приём */}
                                {selectedVisit.primaryPrice > 0 && (
                                    <div className="flex justify-between text-sm rounded-lg px-2 py-1 font-semibold bg-gray-100">
                                        <span>Первичный приём</span>
                                        <span>{selectedVisit.primaryPrice} {currency}</span>
                                    </div>
                                )}

                                {/* Остальные услуги */}
                                {selectedVisit.services.map((service, idx) => (
                                    <div key={idx} className="flex justify-between text-sm rounded-lg px-2 py-1">
                                        <span>{service.name}</span>
                                        <span>{service.price} {currency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Итоговая сумма */}
                        <div className="flex justify-between items-center border-t pt-4">
                            <p className="font-semibold">Итоговая стоимость</p>
                            <p className="text-lg font-semibold text-primary">
                                {totalPrice(selectedVisit.primaryPrice, selectedVisit.services)} {currency}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PatientHistory;