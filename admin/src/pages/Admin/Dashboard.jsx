import React, { useContext, useEffect, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import * as XLSX from 'xlsx'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  const getAppDate = (slotDate) => {
    const [day, month, year] = slotDate.split('_')
    const appDate = new Date(`${year}-${month}-${day}`)
    return new Date(appDate)
  }

  const currentMonthIncomeData = useMemo(() => {
    if (!dashData?.allAppointments) return { labels: [], data: [] }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const filteredAppointments = dashData.allAppointments.filter(appointment => {
      const appointmentDate = getAppDate(appointment.slotDate)
      return (
        appointmentDate.getMonth() === currentMonth &&
        appointmentDate.getFullYear() === currentYear &&
        !appointment.cancelled
      )
    })

    const dailyIncome = {}

    filteredAppointments.forEach(appointment => {
      const date = getAppDate(appointment.slotDate).getDate()
      dailyIncome[date] = (dailyIncome[date] || 0) + appointment.amount
    })

    const labels = Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1)
    const data = labels.map((day, index) => {
      const cumulativeIncome = labels.slice(0, index + 1).reduce((sum, d) => sum + (dailyIncome[d] || 0), 0)
      return cumulativeIncome
    })

    return { labels, data }
  }, [dashData])

  const chartData = {
    labels: currentMonthIncomeData.labels,
    datasets: [
      {
        label: 'Доход за текущий месяц (BYN)',
        data: currentMonthIncomeData.data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Доход за текущий месяц',
      },
    },
  }

  const exportToExcel = () => {
    if (!dashData?.allAppointments) return

    console.log(dashData.allAppointments);
    const exportData = dashData.allAppointments.map(appointment => ({
      'Имя пациента': appointment.userData.name,
      'Имя доктора': appointment.docData.name,
      'Специальность': appointment.docData.speciality,
      'Дата записи': appointment.slotDate.split('_').reverse().join('.'),
      'Время записи': appointment.slotTime,
      'Возраст': appointment.userData.age,
      'Email': appointment.userData.email,
      'Был ли на приеме': appointment.isCompleted ? 'Да' : 'Нет',
      'Стоимость': appointment.amount + ' BYN',
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments')

    XLSX.writeFile(workbook, 'appointments.xlsx')
  }

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Доктора</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Записи</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Пациенты</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Последние записи</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              {/* <img className='rounded-full w-10' src={item.docData.image} alt="" /> */}
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600 '>Запись на {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Отмена</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Завершен</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white p-5 mt-10 rounded border'>

        <Line data={chartData} options={chartOptions} />
        <div className='flex justify-center mt-5'>
          <button 
            onClick={exportToExcel} 
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all'
          >
            Выгрузить данные в Excel
          </button>
        </div>
      </div>

    </div>
  )
}

export default Dashboard