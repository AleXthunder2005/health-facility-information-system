import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorsList = () => {
    const { doctors, aToken, getAllDoctors } = useContext(AdminContext);
    const { backendUrl } = useContext(AppContext);

    const [selectedDoctor, setSelectedDoctor] = useState(null); // доктор для редактирования
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("1 Year");
    const [fees, setFees] = useState("");
    const [about, setAbout] = useState("");
    const [speciality, setSpeciality] = useState("General physician");
    const [degree, setDegree] = useState("");
    const [address1, setAddress1] = useState("");

    const inputStyle =
        "border rounded px-2 py-1 focus:outline-none focus:border-primary focus:border-2 transition";

    useEffect(() => {
        if (aToken) getAllDoctors();
    }, [aToken]);

    // открыть модальное окно и заполнить данные
    const openModal = (doctor) => {
        setSelectedDoctor(doctor);
        setDocImg(false); // по умолчанию не менять изображение
        setName(doctor.name);
        setEmail(doctor.email);
        setPassword("");
        setExperience(doctor.experience || "1 Year");
        setFees(doctor.fees || "");
        setAbout(doctor.about || "");
        setSpeciality(doctor.speciality || "General physician");
        setDegree(doctor.degree || "");
        setAddress1(doctor.address?.line1 || "");
    };

    // сохранить изменения
    const saveChanges = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) return;

        try {
            const formData = new FormData();
            if (docImg) formData.append("image", docImg); // если новое фото
            formData.append("name", name);
            formData.append("email", email);
            if (password) formData.append("password", password);
            formData.append("experience", experience);
            formData.append("fees", Number(fees));
            formData.append("about", about);
            formData.append("speciality", speciality);
            formData.append("degree", degree);
            formData.append("address", JSON.stringify({ line1: address1 }));

            const { data } = await axios.put(
                `${backendUrl}/api/admin/update-doctor/${selectedDoctor._id}`,
                formData,
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setSelectedDoctor(null);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err);
        }
    };

    return (
        <div className="w-full p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Все врачи</h2>

            {/* Сетка карточек */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doc) => (
                    <div
                        key={doc._id}
                        className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
                        onClick={() => openModal(doc)}
                    >
                        <div className="w-full h-44 rounded-xl overflow-hidden mb-3 bg-white">
                            <img
                                src={import.meta.env.VITE_BACKEND_URL + "/images/" + doc.image}
                                className="w-full h-full object-contain"
                                alt={doc.name}
                            />
                        </div>

                        <h3 className="text-lg font-semibold">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{doc.label}</p>
                        <p className="text-sm text-gray-500">{doc.degree}</p>
                    </div>
                ))}
            </div>

            {/* Модальное окно */}
            {selectedDoctor && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl px-6 py-4 relative"> {/* уменьшил py-6 -> py-4 */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                            onClick={() => setSelectedDoctor(null)}
                        >
                            ×
                        </button>

                        <h2 className="text-2xl font-semibold mb-2">Редактировать врача</h2>

                        <form className="space-y-3" onSubmit={saveChanges}>
                            {/* Upload */}
                            <div className="flex items-center gap-4 text-gray-500 mb-2">
                                <label htmlFor="doc-img">
                                    <div
                                        className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition ${
                                            docImg || selectedDoctor.image ? "" : "bg-primary hover:bg-primary-light"
                                        }`}
                                    >
                                        <img
                                            src={
                                                docImg
                                                    ? URL.createObjectURL(docImg)
                                                    : selectedDoctor.image
                                                        ? import.meta.env.VITE_BACKEND_URL + "/images/" + selectedDoctor.image
                                                        : assets.doctor_male
                                            }
                                            className="w-full h-full object-cover"
                                            alt=""
                                        />
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="doc-img"
                                    hidden
                                    onChange={(e) => setDocImg(e.target.files[0])}
                                />
                                <p>Загрузить фотографию доктора</p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-6 text-gray-600">
                                {/* LEFT */}
                                <div className="w-full lg:flex-1 flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <p>Полное имя</p>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={inputStyle}
                                            type="text"
                                            placeholder="Имя"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p>Электронный адрес</p>
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={inputStyle}
                                            type="email"
                                            placeholder="Электронная почта"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p>Пароль</p>
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={inputStyle}
                                            type="password"
                                            placeholder="- изменен пользователем -"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p>Опыт</p>
                                        <select
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className={inputStyle}
                                        >
                                            <option value="Less than 1">&lt; 1 Года</option>
                                            <option value="1 Year">1 Год</option>
                                            <option value="2 Year">2 Года</option>
                                            <option value="3 Year">3 Года</option>
                                            <option value="4 Year">4 Года</option>
                                            <option value="5 Year">5 Лет</option>
                                            <option value="6 Year">6 Лет</option>
                                            <option value="7 Year">7 Лет</option>
                                            <option value="8 Year">8 Лет</option>
                                            <option value="9 Year">9 Лет</option>
                                            <option value="10 Year">10 Лет</option>
                                            <option value="More than 10">&gt; 10 лет</option>
                                        </select>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="w-full lg:flex-1 flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <p>Специализация</p>
                                        <select
                                            value={speciality}
                                            onChange={(e) => setSpeciality(e.target.value)}
                                            className={inputStyle}
                                        >
                                            <option value="General physician">Терапевт</option>
                                            <option value="Gynecologist">Гинеколог</option>
                                            <option value="Dermatologist">Дерматолог</option>
                                            <option value="Pediatricians">Педиатр</option>
                                            <option value="Neurologist">Невролог</option>
                                            <option value="Gastroenterologist">Гастроэнтеролог</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p>Степень</p>
                                        <select
                                            value={degree}
                                            onChange={(e) => setDegree(e.target.value)}
                                            className={inputStyle}
                                        >
                                            <option value="">Выберите степень</option>
                                            <option>Фельдшер</option>
                                            <option>Медицинская сестра</option>
                                            <option>Медицинский брат</option>
                                            <option>Врач общей практики</option>
                                            <option>Врач-специалист</option>
                                            <option>Интерн</option>
                                            <option>Ординатор</option>
                                            <option>Аспирант</option>
                                            <option>Кандидат медицинских наук</option>
                                            <option>Доктор медицинских наук</option>
                                            <option>Доцент</option>
                                            <option>Профессор</option>
                                            <option>Заведующий отделением</option>
                                            <option>Главный врач</option>
                                            <option>Научный сотрудник</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p>Адрес</p>
                                        <input
                                            value={address1}
                                            onChange={(e) => setAddress1(e.target.value)}
                                            className={inputStyle}
                                            type="text"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p>Стоимость консультации</p>
                                        <input
                                            value={fees}
                                            onChange={(e) => setFees(e.target.value)}
                                            className={inputStyle}
                                            type="number"
                                            min={0}
                                            max={10000}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2">
                                <p className="mb-1">О докторе</p>
                                <textarea
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    className={`${inputStyle} w-full`}
                                    rows={2}
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-primary w-full px-10 py-2 mt-3 text-white rounded-full hover:bg-primary-light transition"
                            >
                                Сохранить изменения
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorsList;
