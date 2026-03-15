import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorProfile = () => {

    const { dToken, profileData, getProfileData } = useContext(DoctorContext);
    const { currency } = useContext(AppContext);

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken]);

    if (!profileData) return null;

    const registrationDate = new Date(profileData.date).toLocaleDateString("ru-RU");

    return (
        <section className="w-full px-4 md:px-10 lg:px-20 py-5">

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Фото врача */}

                <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center lg:w-80">

                    <img
                        src={profileData.image ? import.meta.env.VITE_BACKEND_URL + "/images/" + profileData.image : assets.doctor_male}
                        className="w-40 h-40 object-cover rounded-xl mb-4"
                        alt=""
                    />

                    <p className="text-xl font-semibold text-gray-900 text-center">
                        {profileData.name}
                    </p>

                    <p className="text-gray-500 text-sm text-center mt-1">
                        {profileData.label}
                    </p>

                    {profileData.label && (
                        <span className="mt-2 text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
              {profileData.label}
            </span>
                    )}

                    <div className="mt-4 text-sm text-gray-600 text-center">
                        <p>{profileData.degree}</p>
                        <p className="mt-1">Стаж: {profileData.experience}</p>
                    </div>

                </div>

                {/* Основная информация */}

                <div className="flex-1 space-y-6">

                    {/* О враче */}

                    <div className="bg-white rounded-2xl shadow p-6">
                        <p className="text-lg font-semibold text-gray-900 mb-3">
                            О враче
                        </p>

                        <p className="text-gray-600 leading-relaxed">
                            {profileData.about}
                        </p>
                    </div>

                    {/* Информация о работе */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-lg font-semibold text-gray-900 mb-4">
                            Информация о приёме
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">

                            <div>
                                <p className="text-gray-500">Стоимость приёма</p>
                                <p className="font-medium text-gray-900">
                                    {currency} {profileData.fees}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Статус</p>
                                <p className={`font-medium ${profileData.available ? "text-green-600" : "text-red-500"}`}>
                                    {profileData.available ? "Ведёт приём" : "Приём недоступен"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Электронная почта</p>
                                <p className="font-medium text-gray-900">
                                    {profileData.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Дата регистрации</p>
                                <p className="font-medium text-gray-900">
                                    {registrationDate}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Адрес */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-lg font-semibold text-gray-900 mb-3">
                            Адрес приёма
                        </p>

                        <p className="text-gray-600 text-sm">
                            {profileData.address.line1}
                            <br />
                            {profileData.address.line2}
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default DoctorProfile;
