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
    if (aToken) getDashData()
  }, [aToken])

  const getAppDate = (slotDate) => {
    const [day, month, year] = slotDate.split('_')
    return new Date(`${year}-${month}-${day}`)
  }

  const today = new Date()
  const todayAppointments = useMemo(() => {
    if (!dashData?.allAppointments) return []
    return dashData.allAppointments.filter(app => {
      const appDate = getAppDate(app.slotDate)
      return appDate.toDateString() === today.toDateString() && !app.cancelled
    })
  }, [dashData])

  const todayIncome = useMemo(() => todayAppointments.reduce((sum, app) => sum + app.amount, 0), [todayAppointments])

  const totalIncome = useMemo(() => {
    if (!dashData?.allAppointments) return 0
    return dashData.allAppointments.filter(app => !app.cancelled).reduce((sum, app) => sum + app.amount, 0)
  }, [dashData])

  const chartData = useMemo(() => {
    if (!dashData?.allAppointments) return { labels: [], datasets: [] }
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const filtered = dashData.allAppointments.filter(app => {
      const date = getAppDate(app.slotDate)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && !app.cancelled
    })
    const dailyIncome = {}
    filtered.forEach(app => {
      const day = getAppDate(app.slotDate).getDate()
      dailyIncome[day] = (dailyIncome[day] || 0) + app.amount
    })
    const labels = Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1)
    const data = labels.map((day, idx) => labels.slice(0, idx + 1).reduce((sum, d) => sum + (dailyIncome[d] || 0), 0))
    return {
      labels,
      datasets: [
        {
          label: 'Доход за месяц (BYN)',
          data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.2)',
          tension: 0.4
        }
      ]
    }
  }, [dashData])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Доход за текущий месяц' }
    }
  }

  const exportToExcel = () => {
    if (!dashData?.allAppointments) return
    const exportData = dashData.allAppointments.map(app => ({
      'Имя пациента': app.userData.name,
      'Имя доктора': app.docData.name,
      'Специальность': app.docData.speciality,
      'Дата записи': app.slotDate.split('_').reverse().join('.'),
      'Время записи': app.slotTime,
      'Возраст': app.userData.age,
      'Email': app.userData.email,
      'Был ли на приеме': app.isCompleted ? 'Да' : 'Нет',
      'Стоимость': app.amount + ' BYN'
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments')
    XLSX.writeFile(workbook, 'appointments.xlsx')
  }

  if (!dashData) return null

  return (
      <div className="p-6 space-y-6 w-full">

        {/* Верхняя сетка: 4 дашборда */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card icon={assets.notice} title="Записи за сегодня" value={todayAppointments.length} />
          <Card icon={assets.money_bag} title="Доход за сегодня" value={`${todayIncome} BYN`} />
          <Card icon={assets.notice} title="Все записи" value={dashData.appointments} />
          <Card icon={assets.money_bag} title="Суммарный доход" value={`${totalIncome} BYN`} />
        </div>

        {/* Нижняя сетка: 2 дашборда */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card icon={assets.white_user} title="Все пациенты" value={dashData.patients} />
          <Card icon={assets.doctor_male} title="Все врачи" value={dashData.doctors} />
        </div>

        {/* График дохода за месяц */}
        <div className="bg-white rounded-xl shadow w-full" style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Экспорт */}
        <div className="flex justify-center">
          <button onClick={exportToExcel} className="px-6 py-2 bg-primary w-full text-white rounded-full hover:bg-primary-light transition-all">
            Экспортировать в Excel
          </button>
        </div>
      </div>
  )
}

// Универсальная карточка
const Card = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-4">
      <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
        <img src={icon} alt="icon" className="w-7 h-7" />
      </div>
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
)

export default Dashboard