import { useState } from "react";
import { assets } from "@assets/assets";

const mockHistory = [
    {
        id: 1,
        doctor: "Иванов Сергей Петрович",
        specialization: "Кардиолог",
        clinic: "Городская клиника №12",
        date: "10.03.2026",
        time: "10:30",
        complaints: "Боли в груди, повышенное давление",
        notes: "Проведён осмотр, измерено давление, выполнена ЭКГ.",
        recommendations: "Снизить потребление соли, контроль давления, повторный приём через 2 недели.",
        services: [
            { name: "Первичный приём врача", price: 2500 },
            { name: "ЭКГ", price: 900 },
            { name: "Измерение давления", price: 300 },
            { name: "Первичный приём врача", price: 2500 },
            { name: "ЭКГ", price: 900 },
            { name: "Измерение давления", price: 300 },
        ],
    },
    {
        id: 2,
        doctor: "Петрова Анна Викторовна",
        specialization: "Терапевт",
        clinic: "Медцентр Здоровье",
        date: "02.03.2026",
        time: "14:00",
        complaints: "Слабость, температура",
        notes: "Проведён осмотр, назначены анализы.",
        recommendations: "Постельный режим, обильное питьё.",
        services: [
            { name: "Консультация терапевта", price: 2000 },
            { name: "Осмотр", price: 500 },
        ],
    },
];

const MyHistory = () => {
    const [selectedVisit, setSelectedVisit] = useState(null);

    const totalPrice = (services) =>
        services.reduce((acc, s) => acc + s.price, 0);

    return (
        <section className="w-full px-2 md:px-10 lg:px-20 py-3">
            <div className="max-w-7xl mx-auto">

                {/* Header */}

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

                    {mockHistory.map((visit) => (

                        <div
                            key={visit.id}
                            onClick={() => setSelectedVisit(visit)}
                            className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                hover:shadow-lg
                cursor-pointer
                transition
              "
                        >

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                        <img src={assets.doctor_male} className="w-10" />
                                    </div>

                                    <div>

                                        <p className="font-semibold text-gray-900">
                                            {visit.doctor}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {visit.specialization}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {visit.date} • {visit.time}
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

                        {/* Close */}

                        <button
                            onClick={() => setSelectedVisit(null)}
                            className="absolute right-4 top-4"
                        >
                            <img src={assets.cross_icon} className="w-6" />
                        </button>

                        {/* Doctor */}

                        {/* Doctor */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                                <img src={assets.doctor_male} className="w-12" />
                            </div>

                            <div>
                                <p className="text-lg font-semibold">{selectedVisit.doctor}</p>
                                <p className="text-gray-500 text-sm">{selectedVisit.specialization}</p>
                                <p className="text-gray-500 text-sm">
                                    {selectedVisit.date} • {selectedVisit.time}
                                </p>
                            </div>
                        </div>

                        {/* Complaints */}

                        <div className="mb-4">

                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.virus_research} className="w-6"/>
                                Жалобы пациента
                            </p>

                            <p className="text-gray-600 text-sm">
                                {selectedVisit.complaints}
                            </p>

                        </div>

                        {/* Doctor notes */}

                        <div className="mb-4">

                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.notice_icon} className="w-6"/>
                                Пометки врача
                            </p>

                            <p className="text-gray-600 text-sm">
                                {selectedVisit.notes}
                            </p>

                        </div>

                        {/* Recommendations */}

                        <div className="mb-6">

                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <img src={assets.recomendations_icon} className="w-6"/>
                                Рекомендации
                            </p>

                            <p className="text-gray-600 text-sm">
                                {selectedVisit.recommendations}
                            </p>

                        </div>

                        {/* Services */}

                        <div className="mb-6">

                            <p className="font-semibold mb-3 flex items-center gap-2">
                                <img src={assets.heart_cardiogram} className="w-6"/>
                                Оказанные услуги
                            </p>

                            <div className="flex flex-col gap-1 max-h-20 scrollbar-thin overflow-y-auto pr-1">

                                {selectedVisit.services.map((service, index) => (

                                    <div
                                        key={index}
                                        className="flex justify-between text-sm rounded-lg px-2 py-1"
                                    >

                                        <span>{service.name}</span>

                                        <span className="font-medium">
                                          {service.price} BYN
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* Total */}

                        <div className="flex justify-between items-center border-t pt-4">

                            <p className="font-semibold">
                                Итоговая стоимость
                            </p>

                            <p className="text-lg font-semibold text-primary">
                                {totalPrice(selectedVisit.services)} BYN
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
};

export default MyHistory;