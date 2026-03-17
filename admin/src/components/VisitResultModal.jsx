import { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext";
import { DoctorContext } from "../context/DoctorContext";

const formatSlotDate = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};

const VisitResultModal = ({ appointment, onClose, onComplete }) => {
    const { services: allServices, getServices, currency } = useContext(AppContext);
    const { profileData, getProfileData } = useContext(DoctorContext);

    const [complaints, setComplaints] = useState("");
    const [notes, setNotes] = useState("");
    const [recommendations, setRecommendations] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);

    // 🔹 загрузка списка услуг и профиля врача при открытии модалки
    useEffect(() => {
        if (!allServices.length) getServices();
        if (!profileData) getProfileData();
    }, []);

    const primaryPrice = profileData?.fees || 0; // базовая стоимость приёма

    const toggleService = (service) => {
        const exists = selectedServices.find((s) => s._id === service._id);
        if (exists) {
            setSelectedServices(selectedServices.filter((s) => s._id !== service._id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const totalPrice = primaryPrice + selectedServices.reduce((acc, s) => acc + Number(s.price), 0);

    const submitVisit = () => {
        const result = {
            complaints,
            notes,
            recommendations,
            services: selectedServices,
            primaryPrice,
            totalPrice,
        };
        if (onComplete) onComplete(result);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl relative max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} className="absolute right-4 top-4">
                    <img src={assets.cross_icon} className="w-6" />
                </button>

                <div className="flex items-center gap-2 mb-3">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                        <img src={assets.white_user} className="w-10" />
                    </div>
                    <div>
                        <p className="font-semibold">{appointment.userData.name}</p>
                        <p className="text-gray-500 text-sm">
                            {formatSlotDate(appointment.slotDate)} • {appointment.slotTime}
                        </p>
                    </div>
                </div>

                <textarea
                    placeholder="Жалобы пациента"
                    className="w-full border border-gray-200 rounded-xl p-3 mb-1 text-sm
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                    rows={1}
                />

                <textarea
                    placeholder="Пометки врача"
                    className="w-full border border-gray-200 rounded-xl p-3 mb-1 text-sm
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={1}
                />

                <textarea
                    placeholder="Рекомендации"
                    className="w-full border border-gray-200 rounded-xl p-3 mb-1 text-sm
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    rows={1}
                />

                {/* 🔹 Основной приём */}
                <p className="font-semibold mb-2">Первичный приём</p>
                <div className="border rounded-xl px-3 py-2 mb-4 bg-gray-50 flex justify-between">
                    <span>Первичный приём</span>
                    <span className="font-medium text-gray-900">
                        {currency} {primaryPrice}
                    </span>
                </div>

                {/* 🔹 Дополнительные услуги */}
                <p className="font-semibold mb-2">Дополнительные услуги</p>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto mb-4">
                    {allServices.map((service) => (
                        <div
                            key={service._id}
                            className={`flex justify-between border rounded-lg px-3 py-1 cursor-pointer transition
                                ${selectedServices.find(s => s._id === service._id) ? "bg-primary text-white" : "hover:bg-gray-50"}`}
                            onClick={() => toggleService(service)}
                        >
                            <span>{service.name}</span>
                            <span>{service.price} {currency}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between border-t pt-4 mb-4">
                    <p className="font-semibold">Итог</p>
                    <p className="font-semibold text-primary">{currency} {totalPrice}</p>
                </div>

                <button
                    onClick={submitVisit}
                    className="w-full bg-primary text-white py-1 rounded-xl hover:bg-primary-light transition"
                >
                    Завершить приём
                </button>

            </div>
        </div>
    );
};

export default VisitResultModal;