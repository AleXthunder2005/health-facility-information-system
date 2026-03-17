import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { assets, specialityData } from "@assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const MyHistory = () => {
    const { backendUrl, token, currencySymbol } = useContext(AppContext);

    const [history, setHistory] = useState([]);
    const [selectedVisit, setSelectedVisit] = useState(null);

    const loadHistory = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/visits/user`, {
                headers: { token },
            });

            if (data.success) {
                setHistory(data.visits);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Ошибка загрузки истории");
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    // 👇 ДОБАВИЛ
    const getSpecialityLabel = (speciality) => {
        const found = specialityData.find(
            (item) => item.speciality === speciality
        );
        return found ? found.label : "Специализация не указана";
    };

    // формат даты
    const formatDate = (rawDate) => {
        if (!rawDate) return "";
        const parts = rawDate.split("_");
        if (parts.length !== 3) return rawDate;
        const [day, month, year] = parts.map((p) => p.padStart(2, "0"));
        return `${day}.${month}.${year}`;
    };

    return (
        <section className="w-full px-2 md:px-10 lg:px-20 py-3">
            <div className="max-w-7xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                        История приёмов
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Все прошедшие визиты к врачам
                    </p>
                </div>

                {/* List */}
                <div className="flex flex-col gap-5">
                    {history.map((visit) => (
                        <div
                            key={visit._id}
                            onClick={() => setSelectedVisit(visit)}
                            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg cursor-pointer transition"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center">
                                        <img
                                            src={
                                                visit.docId?.image
                                                    ? import.meta.env.VITE_BACKEND_URL + "/images/" + visit.docId.image
                                                    : assets.doctor_male
                                            }
                                            className={
                                                visit.docId?.image
                                                    ? "w-full h-full object-cover"
                                                    : "w-10"
                                            }
                                        />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {visit.docId?.name || "Врач не указан"}
                                        </p>

                                        {/* 👇 ЗАМЕНЕНО */}
                                        <p className="text-sm text-gray-500">
                                            {getSpecialityLabel(visit.docId?.speciality)}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {formatDate(visit.slotDate)} • {visit.slotTime}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-primary text-sm">
                                    Подробнее
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedVisit && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative shadow-xl">

                        <button
                            onClick={() => setSelectedVisit(null)}
                            className="absolute right-4 top-4"
                        >
                            <img src={assets.cross_icon} className="w-6" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center">
                                <img
                                    src={
                                        selectedVisit.docId?.image
                                            ? import.meta.env.VITE_BACKEND_URL + "/images/" + selectedVisit.docId.image
                                            : assets.doctor_male
                                    }
                                    className={
                                        selectedVisit.docId?.image
                                            ? "w-full h-full object-cover"
                                            : "w-10"
                                    }
                                />
                            </div>

                            <div>
                                <p className="text-lg font-semibold">
                                    {selectedVisit.docId?.name || "Врач не указан"}
                                </p>

                                {/* 👇 ЗАМЕНЕНО */}
                                <p className="text-gray-500 text-sm">
                                    {getSpecialityLabel(selectedVisit.docId?.speciality)}
                                </p>

                                <p className="text-gray-500 text-sm">
                                    {formatDate(selectedVisit.slotDate)} • {selectedVisit.slotTime}
                                </p>
                            </div>
                        </div>

                        {/* Остальное без изменений */}
                        <div className="mb-4">
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.virus_research} className="w-6" />
                                Жалобы пациента
                            </p>
                            <p className="text-gray-600 text-sm">
                                {selectedVisit.complaints || "Не указано"}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.notice_icon} className="w-6" />
                                Пометки врача
                            </p>
                            <p className="text-gray-600 text-sm">
                                {selectedVisit.notes || "Приём успешно проведён"}
                            </p>
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.recomendations_icon} className="w-6" />
                                Рекомендации
                            </p>
                            <p className="text-gray-600 text-sm">
                                {selectedVisit.recommendations || "Следуйте рекомендациям врача"}
                            </p>
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold mb-3 flex items-center gap-2">
                                <img src={assets.heart_cardiogram} className="w-6" />
                                Оказанные услуги
                            </p>

                            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                                <div className="flex justify-between text-sm rounded-lg px-2 py-1 font-semibold bg-gray-100">
                                    <span>Первичный приём</span>
                                    <span>
                                        {selectedVisit.primaryPrice} {currencySymbol}
                                    </span>
                                </div>

                                {selectedVisit.services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm rounded-lg px-2 py-1"
                                    >
                                        <span>{service.name}</span>
                                        <span>
                                            {service.price} {currencySymbol}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4">
                            <p className="font-semibold">Итоговая стоимость</p>
                            <p className="text-lg font-semibold text-primary">
                                {selectedVisit.totalPrice} {currencySymbol}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyHistory;