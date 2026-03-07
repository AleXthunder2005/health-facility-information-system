import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "@assets/assets";
import styles from './MyProfile.module.scss';

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
    <div className={styles.myprofile__container}>
      {isEdit ? (
        <label htmlFor="image">
          <div className={styles.myprofile__imageEdit}>
            <img
              className={styles.myprofile__image}
              src={image ? URL.createObjectURL(image) : userData.image}
              alt=""
            />
            <img
              className={styles.myprofile__uploadIcon}
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
        <img className={styles.myprofile__image} src={userData.image} alt="" />
      )}

      {isEdit ? (
        <input
          className={styles.myprofile__nameInput}
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userData.name}
        />
      ) : (
        <p className={styles.myprofile__name}>
          {userData.name}
        </p>
      )}

      <hr className={styles.myprofile__divider} />

      <div className={styles.myprofile__section}>
        <p className={styles.myprofile__sectionTitle}>Котактная информация</p>
        <div className={styles.myprofile__grid}>
          <p className={styles.myprofile__label}>Электронная почта:</p>
          <p className={styles.myprofile__value}>{userData.email}</p>
          <p className={styles.myprofile__label}>Телефон:</p>

          {isEdit ? (
            <input
              className={styles.myprofile__input}
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className={styles.myprofile__value}>{userData.phone}</p>
          )}

          <p className={styles.myprofile__label}>Адрес:</p>

          {isEdit ? (
            <p>
              <input
                className={styles.myprofile__input}
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
                className={styles.myprofile__input}
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
            <p className={styles.myprofile__value}>
              {userData.address.line1} <br /> {userData.address.line2}
            </p>
          )}
        </div>
      </div>
      <div className={styles.myprofile__section}>
        <p className={styles.myprofile__sectionTitle}>Базовая информация</p>
        <div className={styles.myprofile__grid}>
          <p className={styles.myprofile__label}>Пол:</p>

          {isEdit ? (
            <select
              className={styles.myprofile__select}
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
            <p className={styles.myprofile__value}>{userData.gender}</p>
          )}

          <p className={styles.myprofile__label}>Дата рождения:</p>

          {isEdit ? (
            <input
              className={styles.myprofile__input}
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className={styles.myprofile__value}>{userData.dob}</p>
          )}
        </div>
      </div>
      <div className={styles.myprofile__actions}>
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className={styles.myprofile__button}
          >
            Сохранить изменения
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className={styles.myprofile__button}
          >
            Изменить
          </button>
        )}
      </div>
    </div>
  ) : null;
};

export default MyProfile;
