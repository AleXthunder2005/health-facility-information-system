import { useContext, useState, useEffect } from "react";
import { AppContext } from "@context/AppContext";
import { assets } from "@assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./MyProfile.module.scss";

const MyProfile = () => {

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { token, backendUrl, userData, loadUserProfileData } =
      useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "Не указан",
    dob: "",
    address: {
      line1: "",
      line2: ""
    }
  });

  // Синхронизация с userData
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        gender: userData.gender || "Не указан",
        dob: userData.dob || "",
        address: {
          line1: userData.address?.line1 || "",
          line2: userData.address?.line2 || ""
        }
      });
    }
  }, [userData]);

  const updateUserProfileData = async () => {

    try {

      const form = new FormData();

      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("gender", formData.gender);
      form.append("dob", formData.dob);
      form.append("address", JSON.stringify(formData.address));

      if (image) form.append("image", image);

      const { data } = await axios.post(
          backendUrl + "/api/user/update-profile",
          form,
          { headers: { token } }
      );

      if (data.success) {

        toast.success(data.message);

        await loadUserProfileData();

        setIsEdit(false);
        setImage(false);

      } else {
        toast.error(data.message);
      }

    } catch (error) {

      console.log(error);
      toast.error(error.message);

    }

  };

  if (!userData) return null;

  const inputClass =
      "bg-transparent border-b border-gray-300 text-gray-800 text-sm focus:border-primary focus:outline-none py-1";

  return (
      <section className={`mx-auto bg-white rounded-2xl ${styles["profile"]}`}>

        {/* Header */}

        <div className="flex items-center gap-4 border-b border-gray-200 p-5">

          <div className="relative">

            <img
                src={image ? URL.createObjectURL(image) : userData.image || assets.ui_user_profile}
                alt=""
                className="w-24 h-24 rounded-full object-cover"
            />

            {isEdit && (

                <label htmlFor="image" className="absolute bottom-0 right-0 cursor-pointer">

                  <img src={assets.upload_icon} className="w-6 h-6" alt="upload" />

                  <input
                      id="image"
                      type="file"
                      hidden
                      onChange={(e) => setImage(e.target.files[0])}
                  />

                </label>

            )}

          </div>

          <div className="flex flex-col gap-1">

            {isEdit ? (

                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData(prev => ({ ...prev, name: e.target.value }))
                    }
                    className={`text-lg font-semibold ${inputClass}`}
                />

            ) : (

                <h2 className="text-lg font-semibold text-gray-900">
                  {formData.name || "Пользователь"}
                </h2>

            )}

            <p className="text-gray-500 text-sm">{userData.email}</p>

          </div>

        </div>


        {/* Info */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">

          {/* Контакты */}

          <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col gap-3">

            <h3 className="font-medium text-gray-700 text-sm">
              Контактная информация
            </h3>

            <div className="flex justify-between items-center text-sm">

              <span className="text-gray-600 font-medium">Телефон:</span>

              {isEdit ? (

                  <input
                      type="text"
                      value={formData.phone}
                      placeholder="+375"
                      onChange={(e) =>
                          setFormData(prev => ({ ...prev, phone: e.target.value }))
                      }
                      className={inputClass}
                  />

              ) : (

                  <span className="text-blue-500">
                {formData.phone || "Не указан"}
              </span>

              )}

            </div>

            <div className="flex flex-col gap-1 text-sm">

              <span className="text-gray-600 font-medium">Адрес:</span>

              {isEdit ? (

                  <input
                      type="text"
                      value={formData.address.line1}
                      placeholder="Введите адрес"
                      onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              line1: e.target.value
                            }
                          }))
                      }
                      className={inputClass}
                  />

              ) : (

                  <span className="text-gray-700">
                {formData.address.line1 || "Не указан"}
              </span>

              )}

            </div>

          </div>


          {/* Основная информация */}

          <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col gap-3">

            <h3 className="font-medium text-gray-700 text-sm">
              Базовая информация
            </h3>

            <div className="flex justify-between items-center text-sm">

              <span className="text-gray-600 font-medium">Пол:</span>

              {isEdit ? (

                  <select
                      value={formData.gender}
                      onChange={(e) =>
                          setFormData(prev => ({ ...prev, gender: e.target.value }))
                      }
                      className={inputClass}
                  >

                    <option value="Не указан">Не указан</option>
                    <option value="Мужской">Мужской</option>
                    <option value="Женский">Женский</option>

                  </select>

              ) : (

                  <span className="text-gray-700">
                {formData.gender || "Не указан"}
              </span>

              )}

            </div>

            <div className="flex justify-between items-center text-sm">

              <span className="text-gray-600 font-medium">
                Дата рождения:
              </span>

              {isEdit ? (

                  <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                          setFormData(prev => ({ ...prev, dob: e.target.value }))
                      }
                      className={inputClass}
                  />

              ) : (

                  <span className="text-gray-700">
                {formData.dob || "Не указана"}
              </span>

              )}

            </div>

          </div>

        </div>


        {/* Actions */}

        <div className="flex justify-end p-5">

          {isEdit ? (

              <button
                  onClick={updateUserProfileData}
                  className="bg-primary text-white px-5 py-1.5 rounded-full text-sm hover:opacity-90 transition"
              >
                Сохранить
              </button>

          ) : (

              <button
                  onClick={() => setIsEdit(true)}
                  className="border border-primary text-primary px-5 py-1.5 rounded-full text-sm hover:bg-primary hover:text-white transition"
              >
                Изменить
              </button>

          )}

        </div>

      </section>
  );
};

export default MyProfile;