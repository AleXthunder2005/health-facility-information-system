import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AddAnalysis = () => {
    const { backendUrl } = useContext(AppContext);

    const [patients, setPatients] = useState([]);
    const [types, setTypes] = useState([]);

    const [patientId, setPatientId] = useState("");
    const [analysisType, setAnalysisType] = useState("");
    const [analysisDate, setAnalysisDate] = useState("");
    const [analysisTime, setAnalysisTime] = useState("");
    const [pdf, setPdf] = useState(null);
    const [newType, setNewType] = useState("");

    const fileRef = useRef(null);

    // загрузка пациентов и типов анализа
    const loadData = async () => {
        try {
            const p = await axios.get(`${backendUrl}/api/analyses/patients`);
            const t = await axios.get(`${backendUrl}/api/analyses/types`);
            setPatients(p.data.patients);
            setTypes(t.data.types);
        } catch (err) {
            toast.error("Ошибка загрузки данных");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // отправка формы загрузки анализа
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!pdf) return toast.error("Выберите PDF файл");

        try {
            const formData = new FormData();
            formData.append("patientId", patientId);
            formData.append("analysisType", analysisType);
            formData.append("analysisDate", analysisDate);
            formData.append("analysisTime", analysisTime);
            formData.append("pdf", pdf);

            const { data } = await axios.post(
                `${backendUrl}/api/analyses/upload-analysis`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (data.success) {
                toast.success(data.message);
                setPatientId("");
                setAnalysisType("");
                setAnalysisDate("");
                setAnalysisTime("");
                setPdf(null);
                if (fileRef.current) fileRef.current.value = "";
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Ошибка загрузки анализа");
        }
    };

    // добавление нового типа анализа
    const addType = async () => {
        if (!newType.trim()) return;

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/analyses/add-type`,
                { name: newType }
            );
            if (data.success) {
                toast.success(data.message);
                setNewType("");
                loadData();
            }
        } catch (err) {
            toast.error("Ошибка добавления типа");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Управление анализами</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
                {/* Основная колонка */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-4 h-fit shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Загрузка анализа</h2>

                    <form onSubmit={submitHandler} className="flex flex-col gap-3">
                        <select
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            required
                            className="border border-gray-200 rounded-xl p-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        >
                            <option value="">Выберите пациента</option>
                            {patients.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={analysisType}
                            onChange={(e) => setAnalysisType(e.target.value)}
                            required
                            className="border border-gray-200 rounded-xl p-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        >
                            <option value="">Выберите анализ</option>
                            {types.map((t) => (
                                <option key={t._id} value={t._id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={analysisDate}
                            onChange={(e) => setAnalysisDate(e.target.value)}
                            required
                            className="border border-gray-200 rounded-xl p-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />

                        <input
                            type="time"
                            value={analysisTime}
                            onChange={(e) => setAnalysisTime(e.target.value)}
                            required
                            className="border border-gray-200 rounded-xl p-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />

                        <input
                            ref={fileRef}
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setPdf(e.target.files[0])}
                            className="border border-gray-200 rounded-xl p-3 text-sm
                file:mr-3 file:px-3 file:py-1 file:border-0
                file:rounded-lg file:bg-primary file:text-white"
                        />

                        {pdf && (
                            <p className="text-sm text-gray-500">Выбран файл: {pdf.name}</p>
                        )}

                        <button
                            className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-light transition"
                        >
                            Загрузить анализ
                        </button>
                    </form>
                </div>

                {/* Правая колонка */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 h-fit shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Добавить тип анализа</h2>
                    <div className="flex flex-col gap-2">
                        <input
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            placeholder="Название анализа"
                            className="border border-gray-200 rounded-xl p-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                        <button
                            onClick={addType}
                            className="bg-primary text-white py-2 rounded-xl hover:bg-primary-light transition"
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAnalysis;