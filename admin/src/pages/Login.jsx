import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setDToken, dToken } = useContext(DoctorContext);
  const { setAToken, aToken } = useContext(AdminContext);

  useEffect(() => {
    if ((role === "Admin" && aToken) || (role === "Doctor" && dToken)) {
      navigate("/");
    }
  }, [aToken, dToken, role]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let data;
      if (role === "Admin") {
        const response = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        data = response.data;
        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        data = response.data;
        if (data.success) {
          setDToken(data.token);
          localStorage.setItem("dToken", data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Ошибка сервера. Попробуйте позже.");
    }
  };

  return (
      <section className="flex items-center justify-center min-h-screen bg-gray-50">
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
        >
          {/* Заголовок */}
          <div className="text-center">
            <p className="text-3xl font-semibold text-gray-900">
              Вход как {role === "Admin" ? "Админ" : "Врач"}
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Пожалуйста войдите, чтобы продолжить
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-sm">Электронный адрес</label>
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-sm">Пароль</label>
            <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Button */}
          <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white py-2.5 rounded-full font-medium transition mt-2"
          >
            Войти
          </button>

          {/* Switch Role */}
          <p className="text-sm text-gray-600 text-center">
            {role === "Admin" ? "Доктор?" : "Админ?"}{" "}
            <span
                onClick={() => setRole(role === "Admin" ? "Doctor" : "Admin")}
                className="text-primary cursor-pointer underline"
            >
      {role === "Admin" ? "Войти как доктор" : "Войти как админ"}
    </span>
          </p>
        </form>
      </section>
  );
};

export default Login;