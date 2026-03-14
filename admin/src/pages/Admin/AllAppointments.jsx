import React, { useEffect, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
      <div className="w-full p-6 space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Все записи</h2>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* Заголовок */}
          <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] px-6 py-4 border-b text-sm font-medium text-gray-500 bg-gray-50">
            <p></p>
            <p>Пациент</p>
            <p>Возраст</p>
            <p>Дата и время</p>
            <p>Доктор</p>
            <p>Стоимость</p>
            <p className="text-center">Статус</p>
          </div>

          {/* Список */}
          <div className="max-h-[62vh] overflow-y-auto divide-y">

            {appointments.map((item, index) => (

                <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] px-6 py-4 items-center text-sm text-gray-600 hover:bg-gray-50 transition"
                >

                  {/* номер */}
                  <p className="hidden md:block">{index + 1}</p>

                  {/* пациент */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                      <img src={assets.white_user} className="w-6" />
                    </div>
                    <p className="font-medium text-gray-800">{item.userData.name}</p>
                  </div>

                  {/* возраст */}
                  <p className="hidden md:block">
                    { !isNaN(calculateAge(item.userData.dob)) ? calculateAge(item.userData.dob) : '-'}
                  </p>

                  {/* дата */}
                  <p>
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>

                  {/* доктор */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                      <img src={assets.doctor_male} className="w-6" />
                    </div>
                    <p className="font-medium text-gray-800">{item.docData.name}</p>
                  </div>

                  {/* стоимость */}
                  <p className="font-medium text-gray-800">
                    {item.isCompleted ? `${item.amount} ${currency}` : '-'}
                  </p>

                  {/* статус */}
                  <div className="flex justify-center">

                    {item.cancelled ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          Отменен
                        </span>
                    ) : item.isCompleted ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                          Завершен
                        </span>
                    ) : (
                        <button
                            onClick={() => cancelAppointment(item._id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          <img src={assets.cancel_icon} className="w-8" />
                        </button>
                    )}

                  </div>

                </div>

            ))}

          </div>
        </div>

      </div>
  )
}

export default AllAppointments
