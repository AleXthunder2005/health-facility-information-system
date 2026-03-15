import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const PatientHistory = () => {
    const { patientId } = useParams();
    const { getPatientHistory } = useContext(DoctorContext);
    const { slotDateFormat } = useContext(AppContext);

    const [history, setHistory] = useState([]);
    const [selectedVisit, setSelectedVisit] = useState(null);

    useEffect(() => {
        // Получаем историю конкретного пациента
        getPatientHistory(patientId).then((res) => setHistory(res));
    }, [patientId]);

    const totalPrice = (services) => services.reduce((sum, s) => sum + s.price, 0);

    return (
        <section className="w-full px-4 md:px-10 lg:px-20 py-5">
            <h1 className="text-3xl font-semibold">История приёмов пациента</h1>
            {history.length > 0 ? (
                <div className="flex flex-col gap-5">
                    {history.map((visit) => (
                        <div
                            key={visit.id}
                            onClick={() => setSelectedVisit(visit)}
                            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg cursor-pointer transition"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                        <img src={assets.doctor_male} className="w-10" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{visit.doctor}</p>
                                        <p className="text-sm text-gray-500">{visit.specialization}</p>
                                        <p className="text-sm text-gray-500">{visit.date} • {visit.time}</p>
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

            {/* Модалка выбранного визита */}
            {selectedVisit && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-xl">
                        <button onClick={() => setSelectedVisit(null)} className="absolute top-4 right-4">
                            <img src={assets.cross_icon} className="w-6" />
                        </button>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{selectedVisit.doctor}</h2>

                        <p className="font-semibold mb-1 flex items-center gap-2">
                            <img src={assets.virus_research} className="w-5" /> Жалобы пациента
                        </p>
                        <p className="text-gray-600 text-sm mb-2">{selectedVisit.complaints}</p>

                        <p className="font-semibold mb-1 flex items-center gap-2">
                            <img src={assets.notice_icon} className="w-5" /> Пометки врача
                        </p>
                        <p className="text-gray-600 text-sm mb-2">{selectedVisit.notes}</p>

                        <p className="font-semibold mb-1 flex items-center gap-2">
                            <img src={assets.recommendations_icon} className="w-5" /> Рекомендации
                        </p>
                        <p className="text-gray-600 text-sm mb-2">{selectedVisit.recommendations}</p>

                        <p className="font-semibold mb-2 flex items-center gap-2">
                            <img src={assets.heart_cardiogram} className="w-5" /> Оказанные услуги
                        </p>
                        <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                            {selectedVisit.services.map((s, idx) => (
                                <div key={idx} className="flex justify-between text-sm px-2 py-1">
                                    <span>{s.name}</span>
                                    <span className="font-medium">{s.price} BYN</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center border-t pt-3 mt-3">
                            <p className="font-semibold">Итоговая стоимость</p>
                            <p className="text-primary font-semibold">{totalPrice(selectedVisit.services)} BYN</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PatientHistory;
