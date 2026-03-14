import { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const inputStyle =
        "border rounded px-2 py-2 focus:outline-none focus:border-primary focus:border-2 transition"

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1 }))

            const { data } = await axios.post(
                backendUrl + '/api/admin/add-doctor',
                formData,
                { headers: { aToken } }
            )

            if (data.success) {

                toast.success(data.message)

                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setDegree('')
                setAbout('')
                setFees('')

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    return (

        <div className="w-full p-6 space-y-6">

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                    Добавить врача
                </h2>
            </div>

            <form
                onSubmit={onSubmitHandler}
                className="bg-white rounded-xl shadow p-6 max-w-5xl"
            >

                {/* Upload */}
                <div className="flex items-center gap-4 mb-8 text-gray-500">

                    <label htmlFor="doc-img">
                        <div
                            className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition
        ${docImg ? '' : 'bg-primary hover:bg-primary-light'}`}
                        >
                            <img
                                src={docImg ? URL.createObjectURL(docImg) : assets.doctor_male}
                                className={docImg ? 'w-full h-full object-cover' : 'w-8'}
                                alt=""
                            />
                        </div>
                    </label>

                    <input
                        onChange={(e) => setDocImg(e.target.files[0])}
                        type="file"
                        id="doc-img"
                        hidden
                    />

                    <p>Загрузить фотографию доктора</p>

                </div>

                <div className="flex flex-col lg:flex-row gap-10 text-gray-600">

                    {/* LEFT */}
                    <div className="w-full lg:flex-1 flex flex-col gap-4">

                        <div className="flex flex-col gap-1">
                            <p>Полное имя</p>
                            <input
                                onChange={e => setName(e.target.value)}
                                value={name}
                                className={inputStyle}
                                type="text"
                                placeholder="Имя"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p>Электронный адрес доктора</p>
                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                className={inputStyle}
                                type="email"
                                placeholder="Электронная почта"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p>Пароль</p>
                            <input
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                className={inputStyle}
                                type="password"
                                placeholder="Пароль"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p>Опыт</p>
                            <select
                                onChange={e => setExperience(e.target.value)}
                                value={experience}
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
                    <div className="w-full lg:flex-1 flex flex-col gap-4">

                        <div className="flex flex-col gap-1">
                            <p>Специализация</p>
                            <select
                                onChange={e => setSpeciality(e.target.value)}
                                value={speciality}
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
                                onChange={e => setDegree(e.target.value)}
                                value={degree}
                                className={inputStyle}
                                required
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
                                onChange={e => setAddress1(e.target.value)}
                                value={address1}
                                className={inputStyle}
                                type="text"
                                placeholder="Адрес"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Стоимость консультации</p>
                            <input
                                onChange={e => setFees(e.target.value)}
                                value={fees}
                                className={inputStyle}
                                type="number"
                                placeholder="Стоимость консультации"
                                required
                                min={0}
                                max={10000}
                            />
                        </div>
                    </div>

                </div>

                <div className="mt-4">
                    <p className="mb-2">О докторе</p>
                    <textarea
                        onChange={e => setAbout(e.target.value)}
                        value={about}
                        className={inputStyle + " w-full"}
                        rows={3}
                        placeholder="Напишите о докторе"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary w-full px-10 py-3 mt-2 text-white rounded-full hover:bg-primary-light transition"
                >
                    Добавить доктора
                </button>

            </form>

        </div>
    )
}

export default AddDoctor
