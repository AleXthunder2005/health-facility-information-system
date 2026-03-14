import { useState } from "react";
import { assets } from "@assets/assets";

const mockAnalyses = [
    {
        id: 1,
        name: "Общий анализ крови",
        date: "12.03.2026",
        time: "09:30",
        pdf: "/mock/analysis1.pdf",
    },
    {
        id: 2,
        name: "Биохимический анализ крови",
        date: "04.03.2026",
        time: "11:15",
        pdf: "/mock/analysis2.pdf",
    },
    {
        id: 3,
        name: "Анализ мочи",
        date: "25.02.2026",
        time: "10:40",
        pdf: "/mock/analysis3.pdf",
    },
];

const MyAnalyses = () => {

    const [openId, setOpenId] = useState(null);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (

        <section className="w-full px-2 md:px-10 lg:px-20 py-3">

            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="mb-6">

                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                        Мои анализы
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Результаты анализов
                    </p>

                </div>

                {/* Analyses list */}

                <div className="flex flex-col gap-5">

                    {mockAnalyses.map((analysis) => (

                        <div
                            key={analysis.id}
                            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-5
              hover:shadow-lg
              transition
              "
                        >

                            {/* Верх карточки */}

                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggle(analysis.id)}
                            >

                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-xl bg-primary  flex items-center justify-center">
                                        <img src={assets.test_icon} className="w-6" />
                                    </div>

                                    <div>

                                        <p className="font-semibold text-gray-900">
                                            {analysis.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {analysis.date} • {analysis.time}
                                        </p>

                                    </div>

                                </div>

                                <span className="text-primary text-sm">
                {openId === analysis.id ? "Скрыть" : "Подробнее"}
              </span>

                            </div>

                            {/* Collapsed часть */}

                            {openId === analysis.id && (

                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">

                                    <p className="text-sm text-gray-600">
                                        Результаты анализа доступны для скачивания
                                    </p>

                                    <a
                                        href={analysis.pdf}
                                        className="
                    bg-primary
                    text-white
                    px-5
                    py-2
                    rounded-full
                    text-sm
                    hover:opacity-90
                    transition
                    "
                                        download
                                    >
                                        Скачать PDF
                                    </a>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

};

export default MyAnalyses;