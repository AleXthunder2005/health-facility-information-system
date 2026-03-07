import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '@context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.scss'

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
    <form onSubmit={onSubmitHandler} className={styles.login__form}>
      <div className={styles.login__container}>
        <p className={styles.login__title}>{state === 'Sign Up' ? 'Создать аккаунт' : 'Войти'}</p>
        <p className={styles.login__subtitle}>Пожалуйста {state === 'Sign Up' ? 'зарегистрируйтесь' : 'войдите'} чтобы записаться на прием</p>
        
        {state === 'Sign Up'
          ? <div className={styles.login__field}>
            <p>Полное имя</p>
            <input 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              className={styles.login__input}
              type="text" 
              required 
            />
          </div>
          : null
        }
        
        <div className={styles.login__field}>
          <p>Электронный адрес</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className={styles.login__input}
            type="email" 
            required 
          />
        </div>
        <div className={styles.login__field}>
          <p>Пароль</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className={styles.login__input}
            type="password" 
            required 
          />
        </div>
        <button className={styles.login__button}>{state === 'Sign Up' ? 'Зарегистрироваться' : 'Войти'}</button>
        {state === 'Sign Up'
          ? <p>Уже есть аккаунт? <span onClick={() => setState('Login')} className={styles.login__link}>Войти</span></p>
          : <p>Создать новый аккаунт? <span onClick={() => setState('Sign Up')} className={styles.login__link}>Создать</span></p>
        }
      </div>
    </form>
  )
}

export default Login