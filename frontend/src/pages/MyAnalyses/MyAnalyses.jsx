import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "@assets/assets";

const MyAnalyses = () => {
    const { analyses, loadUserAnalyses, userData } = useContext(AppContext); // берем данные и метод из контекста
    const [openId, setOpenId] = useState(null);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    useEffect(() => {
        if (userData?._id) {
            loadUserAnalyses();
        }
    }, [userData]);

    // форматирование даты и времени
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("ru-RU");
    };
    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <section className="w-full px-2 md:px-10 lg:px-20 py-3">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Мои анализы</h1>
                    <p className="text-gray-600 mt-2">Результаты анализов</p>
                </div>

                {/* Analyses list */}
                {analyses.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        У вас ещё нет выполненных анализов.
                    </p>
                ) : (
                    <div className="flex flex-col gap-5">
                        {analyses.map((analysis) => (
                            <div
                                key={analysis._id}
                                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition"
                            >
                                {/* Верх карточки */}
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggle(analysis._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                            <img src={assets.test_icon} className="w-6" />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-900">{analysis.analysisType.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(analysis.date)} • {analysis.time || formatTime(analysis.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-primary text-sm">
                    {openId === analysis._id ? "Скрыть" : "Подробнее"}
                  </span>
                                </div>

                                {/* Collapsed часть */}
                                {openId === analysis._id && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            Результаты анализа доступны для скачивания
                                        </p>

                                        <a
                                            href={analysis.pdf.startsWith("http") ? analysis.pdf : `${import.meta.env.VITE_BACKEND_URL}${analysis.pdf}`}
                                            className="bg-primary text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition"
                                            download
                                        >
                                            Скачать PDF
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyAnalyses;