import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  await clearDB();
  // await appointmentModel.deleteMany({});
  await addDoctors();
  await addAppointments();

  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

const addDoctors = async () => {
  const newDoctors = generateDoctors();
  await doctorModel.insertMany(newDoctors);
  console.log("Doctors Added");
};

// Месяцы для форматирования (используются в твоей функции)
const months = [
  "", "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
];

// Формат даты в "dd_mm_yyyy"
const formatSlotDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}_${month}_${year}`;
};

// Возраст по дате рождения (в формате dd_mm_yyyy)
const calculateAge = (dob) => {
  const [day, month, year] = dob.split("_");
  const birthDate = new Date(`${year}-${month}-${day}`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Случайная дата рождения в формате dd_mm_yyyy
const generateDob = (index) => {
  const year = 1985 + index;
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index % 28) + 1).padStart(2, "0");
  return `${day}_${month}_${year}`;
};

const doctorIds = [
  "6829b83368c3972f1feee772",
  "6829b83368c3972f1feee773",
  "6829b83368c3972f1feee774",
  "6829b83368c3972f1feee775",
  "6829b83368c3972f1feee776",
  "6829b83368c3972f1feee777",
  "6829b83368c3972f1feee778",
  "6829b83368c3972f1feee779",
  "6829b83368c3972f1feee77a",
  "6829b83368c3972f1feee77b",
];

const appointments = doctorIds.map((docId, index) => {
  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + index); // разные дни

  const slotDate = formatSlotDate(appointmentDate);
  const dob = generateDob(index);
  const age = calculateAge(dob);

  return {
    userId: `user${index + 1}`,
    docId: '682ba1334de7c43aa1794485',
    slotDate: slotDate, // "20_01_2000"
    slotTime: "10:30",
    userData: {
      name: `Пациент ${index + 10}`,
      dob: dob, // сохраняем как строку
      age: age,
      gender: index % 2 === 0 ? "Мужчина" : "Женщина",
      email: `user${index + 1}@mail.ru`,
    },
    docData: {
      name: `Доктор ${index + 1}`,
      speciality: "Терапевт",
    },
    amount: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
    date: Date.now(),
    cancelled: false,
    payment: true,
    isCompleted: false,
  };
});


const addAppointments = async () => {
  await appointmentModel.insertMany(appointments);
  console.log("Appointments Added");
}


const clearDB = async () => {
  await appointmentModel.deleteMany({});
  await doctorModel.deleteMany({});
  await userModel.deleteMany({});
  console.log("Database Cleared");
};

const specialities = [
  { speciality: "General physician", label: "Терапевт" },
  { speciality: "Gynecologist", label: "Гинеколог" },
  { speciality: "Dermatologist", label: "Дерматолог" },
  { speciality: "Pediatricians", label: "Педиатр" },
  { speciality: "Neurologist", label: "Невролог" },
  { speciality: "Gastroenterologist", label: "Гастроэнтеролог" },
];

const russianNames = [
  "Алексей Смирнов",
  "Борис Иванов",
  "Иван Кузнецов",
  "Павел Соколов",
  "Дмитрий Попов",
  "Елена Лебедева",
  "Анастасия Морозова",
  "Светлана Новикова",
  "Наталья Федорова",
  "Юлия Павлова",
];

const getRandomSpeciality = (index) => specialities[index % specialities.length];

const generateDoctors = () => {
  const doctors = [];

  for (let i = 1; i <= 10; i++) {
    const { speciality, label } = getRandomSpeciality(i - 1);

    doctors.push({
      name: russianNames[i - 1],
      email: `doc${i}@mail.ru`,
      password: "123", // На проде, конечно, надо хэшировать
      image: `doc${i}.jpg`,
      speciality,
      degree: `Кандидат медицинских наук, ${label}`,
      experience: `${3 + i} лет опыта`,
      about: `Специалист в области ${label.toLowerCase()}.`,
      available: true,
      fees: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
      slots_booked: {},
      address: {
        city: "Москва",
        street: `Улица Доктора №${i}`,
        building: `${i}А`,
      },
      date: Date.now(),
    });
  }

  return doctors;
};

export default connectDB;
