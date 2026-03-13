import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import styles from "./Login.module.scss";

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {

      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
      <form onSubmit={onSubmitHandler} className={`min-h-[80vh] flex items-center ${styles["login"]}`}>
        <div className={`flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg ${styles["login__container"]}`}>
          <p className={`text-2xl font-semibold ${styles["login__title"]}`}>{state === 'Sign Up' ? 'Создать аккаунт' : 'Войти'}</p>
          <p className={styles["login__subtitle"]}>Пожалуйста {state === 'Sign Up' ? 'зарегистрируйтесь' : 'войдите'} чтобы записаться на прием</p>
          {state === 'Sign Up'
              ? <div className={`w-full ${styles["login__field"]}`}>
                <p className={styles["login__fieldLabel"]}>Полное имя</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className={`border border-[#DADADA] rounded w-full p-2 mt-1 ${styles["login__input"]}`} type="text" required />
              </div>
              : null
          }
          <div className={`w-full ${styles["login__field"]}`}>
            <p className={styles["login__fieldLabel"]}>Электронный адрес</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className={`border border-[#DADADA] rounded w-full p-2 mt-1 ${styles["login__input"]}`} type="email" required />
          </div>
          <div className={`w-full ${styles["login__field"]}`}>
            <p className={styles["login__fieldLabel"]}>Пароль</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className={`border border-[#DADADA] rounded w-full p-2 mt-1 ${styles["login__input"]}`} type="password" required />
          </div>
          <button className={`bg-primary text-white w-full py-2 my-2 rounded-md text-base ${styles["login__button"]}`}>{state === 'Sign Up' ? 'Зарегистрироваться' : 'Войти'}</button>
          {state === 'Sign Up'
              ? <p className={styles["login__toggle"]}>Уже есть аккаунт? <span onClick={() => setState('Login')} className={`text-primary underline cursor-pointer ${styles["login__toggleLink"]}`}>Войти</span></p>
              : <p className={styles["login__toggle"]}>Создать новый аккаунт? <span onClick={() => setState('Sign Up')} className={`text-primary underline cursor-pointer ${styles["login__toggleLink"]}`}>Создать</span></p>
          }
        </div>
      </form>
  )
}

export default Login