import { useContext, useEffect, useState } from "react";
import { AppContext } from "@context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";

const Login = () => {

  const [state, setState] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === "Sign Up") {

      const { data } = await axios.post(
          backendUrl + "/api/user/register",
          { name, email, password }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }

    } else {

      const { data } = await axios.post(
          backendUrl + "/api/user/login",
          { email, password }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }

    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
      <section className={`min-h-[70vh] flex items-center justify-center bg-gray-50 py-1 ${styles["login"]}`}>

        <form
            onSubmit={onSubmitHandler}
            className={`flex flex-col gap-5 bg-white p-5 rounded-2xl shadow-lg w-full max-w-md ${styles["login__container"]}`}
        >

          {/* Заголовок */}
          <div className="text-center">
            <p className="text-3xl font-semibold text-gray-900">
              {state === "Sign Up" ? "Создать аккаунт" : "Войти"}
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Пожалуйста {state === "Sign Up" ? "зарегистрируйтесь" : "войдите"}, чтобы записаться на прием
            </p>
          </div>

          {/* Имя */}
          {state === "Sign Up" && (
              <div className={`flex flex-col gap-1 ${styles["login__field"]}`}>
                <label className="text-gray-600 text-sm">Полное имя</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
          )}

          {/* Email */}
          <div className={`flex flex-col gap-0.5 ${styles["login__field"]}`}>
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
          <div className={`flex flex-col gap-1 ${styles["login__field"]}`}>
            <label className="text-gray-600 text-sm">Пароль</label>
            <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Кнопка */}
          <button
              className="bg-primary text-white py-2.5 rounded-full font-medium hover:opacity-90 transition mt-2"
          >
            {state === "Sign Up" ? "Зарегистрироваться" : "Войти"}
          </button>

          {/* Переключение */}
          <p className="text-sm text-gray-600 text-center">
            {state === "Sign Up" ? "Уже есть аккаунт?" : "Создать новый аккаунт?"}{" "}
            <span
                onClick={() =>
                    setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
                className="text-primary cursor-pointer underline"
            >
            {state === "Sign Up" ? "Войти" : "Создать"}
          </span>
          </p>

        </form>
      </section>
  );
};

export default Login;