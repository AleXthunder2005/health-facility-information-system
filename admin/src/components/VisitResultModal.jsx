import { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext";
import { DoctorContext } from "../context/DoctorContext";

const VisitResultModal = ({ appointment, onClose, onComplete }) => {
    const { services: allServices, getServices, currency } = useContext(AppContext);
    const { profileData, getProfileData, dToken } = useContext(DoctorContext);

    const [complaints, setComplaints] = useState("");
    const [notes, setNotes] = useState("");
    const [recommendations, setRecommendations] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        if (!allServices.length) getServices();
        if (!profileData) getProfileData();
    }, []);

    const primaryPrice = profileData?.fees || 0;

    const toggleService = (service) => {
        setSelectedServices(prev =>
            prev.find(s => s._id === service._id)
                ? prev.filter(s => s._id !== service._id)
                : [...prev, service]
        );
    };

    const totalPrice =
        primaryPrice +
        selectedServices.reduce((acc, s) => acc + Number(s.price), 0);

    const formatDate = (date) => {
        const [d, m, y] = date.split("_");
        return `${d}.${String(m).padStart(2, "0")}.${y}`;
    };

    const submitVisit = async () => {
        const servicesForSave = selectedServices.map(s => ({
            name: s.name,
            price: s.price
        }));

        try {
            const res = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/doctor/complete-appointment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        dToken
                    },
                    body: JSON.stringify({
                        appointmentId: appointment._id,
                        services: servicesForSave,
                        primaryPrice,
                        totalPrice,
                        complaints,
                        notes,
                        recommendations
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                onComplete && onComplete(); // чтобы список обновился
                onClose();
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.error(err);
            alert("Ошибка при завершении приёма");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl relative max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} className="absolute right-4 top-4">
                    <img src={assets.cross_icon} className="w-6" />
                </button>

                <div className="flex items-center gap-2 mb-4">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                        <img src={assets.white_user} className="w-10" />
                    </div>
                    <div>
                        <p className="font-semibold">{appointment.userData.name}</p>
                        <p className="text-gray-500 text-sm">
                            {formatDate(appointment.slotDate)} • {appointment.slotTime}
                        </p>
                    </div>
                </div>

                {/* Textareas */}
                <textarea
                    placeholder="Жалобы пациента"
                    value={complaints}
                    onChange={e => setComplaints(e.target.value)}
                    rows={1}
                    className="w-full border border-gray-200 rounded-xl p-1 text-sm mb-2
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />

                <textarea
                    placeholder="Пометки врача"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={1}
                    className="w-full border border-gray-200 rounded-xl p-1 text-sm mb-2
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />

                <textarea
                    placeholder="Рекомендации"
                    value={recommendations}
                    onChange={e => setRecommendations(e.target.value)}
                    rows={1}
                    className="w-full border border-gray-200 rounded-xl p-1 text-sm mb-4
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />

                {/* Primary */}
                <p className="font-semibold mb-2">Первичный приём</p>
                <div className="border border-gray-200 rounded-xl px-3 py-2 mb-4 bg-gray-50 flex justify-between">
                    <span>Первичный приём</span>
                    <span className="font-medium">{currency} {primaryPrice}</span>
                </div>

                {/* Services */}
                <p className="font-semibold mb-2">Дополнительные услуги</p>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto mb-4">
                    {allServices.map(s => (
                        <div
                            key={s._id}
                            onClick={() => toggleService(s)}
                            className={`flex justify-between border border-gray-200 px-3 py-2 rounded-lg cursor-pointer text-sm transition
                            ${
                                selectedServices.find(sel => sel._id === s._id)
                                    ? "bg-primary text-white border-primary"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <span>{s.name}</span>
                            <span>{s.price} {currency}</span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between border-t pt-4 mb-4">
                    <p className="font-semibold">Итог</p>
                    <p className="font-semibold text-primary">
                        {currency} {totalPrice}
                    </p>
                </div>

                <button
                    onClick={submitVisit}
                    className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-light transition"
                >
                    Завершить приём
                </button>

            </div>
        </div>
    );
};

export default VisitResultModal;