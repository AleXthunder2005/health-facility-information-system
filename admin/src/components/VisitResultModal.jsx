import { useState } from "react";
import { assets } from "../assets/assets.js";

const mockServices = [
    { name: "Первичный прием", price: 2500 },
    { name: "ЭКГ", price: 900 },
    { name: "Анализ крови", price: 700 },
    { name: "Консультация", price: 1500 },
];

const formatSlotDate = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};

const VisitResultModal = ({ appointment, currency, onClose, onComplete }) => {

    const [complaints, setComplaints] = useState("");
    const [notes, setNotes] = useState("");
    const [recommendations, setRecommendations] = useState("");
    const [services, setServices] = useState([]);

    const toggleService = (service) => {

        if (services.includes(service)) {
            setServices(services.filter((s) => s !== service));
        } else {
            setServices([...services, service]);
        }

    };

    const totalPrice = services.reduce((acc, s) => acc + s.price, 0);

    const submitVisit = () => {

        const result = {
            complaints,
            notes,
            recommendations,
            services,
            totalPrice,
        };

        if (onComplete) {
            onComplete(result);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl relative  max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} className="absolute right-4 top-4">
                    <img src={assets.cross_icon} className="w-6" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                        <img src={assets.doctor_male} className="w-10" />
                    </div>

                    <div>
                        <p className="font-semibold">{appointment.userData.name}</p>
                        <p className="text-gray-500 text-sm">
                            {formatSlotDate(appointment.slotDate)} • {appointment.slotTime}
                        </p>
                    </div>
                </div>

                {/* Жалобы */}

                <textarea
                    placeholder="Жалобы пациента"
                    className="w-full border border-gray-200 rounded-xl p-3 mb-1 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                    rows={1}
                />

                {/* Пометки */}

                <textarea
                    placeholder="Пометки врача"
                    className="w-full border border-gray-200 rounded-xl p-3 mb-1 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    value={notes}
                    rows={1}
                    onChange={(e) => setNotes(e.target.value)}
                />

                {/* Рекомендации */}

                <textarea
                    placeholder="Рекомендации"
                    className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    rows={1}
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                />

                <p className="font-semibold mb-2">Оказанные услуги</p>

                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto mb-4">

                    {mockServices.map((service, index) => (

                        <div
                            key={index}
                            className={`flex justify-between border rounded-lg px-3 py-1 cursor-pointer transition
                            ${services.includes(service)
                                ? "bg-primary text-white"
                                : "hover:bg-gray-50"}`}
                            onClick={() => toggleService(service)}
                        >

                            <span>{service.name}</span>
                            <span>{service.price} {currency}</span>

                        </div>

                    ))}

                </div>

                <div className="flex justify-between border-t pt-4 mb-4">

                    <p className="font-semibold">Итог</p>
                    <p className="font-semibold text-primary">
                        {totalPrice} {currency}
                    </p>

                </div>

                <button
                    onClick={submitVisit}
                    className="w-full bg-primary text-white py-1 rounded-xl hover:bg-primary-light transition"
                >
                    Завершить прием
                </button>

            </div>

        </div>
    );
};

export default VisitResultModal;
