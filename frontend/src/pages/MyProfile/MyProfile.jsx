import { useContext, useState } from "react";
import { AppContext } from "@context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "@assets/assets";
import styles from "./MyProfile.module.scss";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [image, setImage] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
      useContext(AppContext);

  // Function to update user profile data using API
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
          backendUrl + "/api/user/update-profile",
          formData,
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

  return userData ? (
      <div className={`max-w-lg flex flex-col gap-2 text-sm pt-5 ${styles["myProfile"]}`}>
        {isEdit ? (
            <label htmlFor="image" className={styles["myProfile__imageLabel"]}>
              <div className={`inline-block relative cursor-pointer ${styles["myProfile__imageContainer"]}`}>
                <img
                    className={`w-36 rounded opacity-75 ${styles["myProfile__image"]}`}
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt=""
                />
                <img
                    className={`w-10 absolute bottom-12 right-12 ${styles["myProfile__uploadIcon"]}`}
                    src={image ? "" : assets.upload_icon}
                    alt=""
                />
              </div>
              <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
              />
            </label>
        ) : (
            <img className={`w-36 rounded ${styles["myProfile__image"]}`} src={userData.image} alt="" />
        )}

        {isEdit ? (
            <input
                className={`bg-gray-50 text-3xl font-medium max-w-60 ${styles["myProfile__nameInput"]}`}
                type="text"
                onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                value={userData.name}
            />
        ) : (
            <p className={`font-medium text-3xl text-[#262626] mt-4 ${styles["myProfile__name"]}`}>
              {userData.name}
            </p>
        )}

        <hr className={`bg-[#ADADAD] h-[1px] border-none ${styles["myProfile__divider"]}`} />

        <div className={styles["myProfile__contactSection"]}>
          <p className={`text-gray-600 underline mt-3 ${styles["myProfile__sectionTitle"]}`}>Котактная информация</p>
          <div className={`grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636] ${styles["myProfile__infoGrid"]}`}>
            <p className={`font-medium ${styles["myProfile__infoLabel"]}`}>Электронная почта:</p>
            <p className={`text-blue-500 ${styles["myProfile__email"]}`}>{userData.email}</p>
            <p className={`font-medium ${styles["myProfile__infoLabel"]}`}>Телефон:</p>

            {isEdit ? (
                <input
                    className={`bg-gray-50 max-w-52 ${styles["myProfile__phoneInput"]}`}
                    type="text"
                    onChange={(e) =>
                        setUserData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    value={userData.phone}
                />
            ) : (
                <p className={`text-blue-500 ${styles["myProfile__phone"]}`}>{userData.phone}</p>
            )}

            <p className={`font-medium ${styles["myProfile__infoLabel"]}`}>Адрес:</p>

            {isEdit ? (
                <p className={styles["myProfile__addressInputs"]}>
                  <input
                      className={`bg-gray-50 ${styles["myProfile__addressLineInput"]}`}
                      type="text"
                      onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                      }
                      value={userData.address.line1}
                  />
                  <br />
                  <input
                      className={`bg-gray-50 ${styles["myProfile__addressLineInput"]}`}
                      type="text"
                      onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                      }
                      value={userData.address.line2}
                  />
                </p>
            ) : (
                <p className={`text-gray-500 ${styles["myProfile__address"]}`}>
                  {userData.address.line1} <br /> {userData.address.line2}
                </p>
            )}
          </div>
        </div>
        <div className={styles["myProfile__basicSection"]}>
          <p className={`text-[#797979] underline mt-3 ${styles["myProfile__sectionTitle"]}`}>Базовая информация</p>
          <div className={`grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600 ${styles["myProfile__infoGrid"]}`}>
            <p className={`font-medium ${styles["myProfile__infoLabel"]}`}>Пол:</p>

            {isEdit ? (
                <select
                    className={`max-w-20 bg-gray-50 ${styles["myProfile__genderSelect"]}`}
                    onChange={(e) =>
                        setUserData((prev) => ({ ...prev, gender: e.target.value }))
                    }
                    value={userData.gender}
                >
                  <option value="Not Selected">Не выбран</option>
                  <option value="Male">Мужчина</option>
                  <option value="Female">Женщина</option>
                </select>
            ) : (
                <p className={`text-gray-500 ${styles["myProfile__gender"]}`}>{userData.gender}</p>
            )}

            <p className={`font-medium ${styles["myProfile__infoLabel"]}`}>Дата рождения:</p>

            {isEdit ? (
                <input
                    className={`max-w-28 bg-gray-50 ${styles["myProfile__dobInput"]}`}
                    type="date"
                    onChange={(e) =>
                        setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    value={userData.dob}
                />
            ) : (
                <p className={`text-gray-500 ${styles["myProfile__dob"]}`}>{userData.dob}</p>
            )}
          </div>
        </div>
        <div className={`mt-10 ${styles["myProfile__actions"]}`}>
          {isEdit ? (
              <button
                  onClick={updateUserProfileData}
                  className={`border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all ${styles["myProfile__saveButton"]}`}
              >
                Сохранить изменения
              </button>
          ) : (
              <button
                  onClick={() => setIsEdit(true)}
                  className={`border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all ${styles["myProfile__editButton"]}`}
              >
                Изменить
              </button>
          )}
        </div>
      </div>
  ) : null;
};

export default MyProfile;