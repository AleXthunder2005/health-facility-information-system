import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { sendInvoiceEmail, generateSimpleInvoice } from "../services/emailService.js";

// API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    }

    res.json({ success: false, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    }

    res.json({ success: false, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to send invoice via email
const sendInvoice = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_app_password",
      },
    });

    const mailOptions = {
      from: "create",
      to: "recipient@example.com",
      subject: "Hello from Node.js",
      text: "This is a test email sent using Nodemailer!",
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error:", error);
      }
      console.log("Email sent:", info.response);
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Отправка инвойса по электронной почте пациенту
const sendInvoiceToPatient = async (req, res) => {
  try {
    const { appointmentId, additionalText } = req.body;
    
    // Находим запись о приеме в базе данных
    const appointment = await appointmentModel.findById(appointmentId);
    
    if (!appointment) {
      return res.json({ success: false, message: "Запись на прием не найдена" });
    }
    
    // Проверяем наличие email в данных пользователя
    if (!appointment.userData.email) {
      return res.json({ success: false, message: "Email пациента не найден" });
    }
    
    // Генерируем инвойс (в простом формате)
    const invoiceBuffer = await generateSimpleInvoice(appointment);
    
    // Отправляем email с инвойсом
    const emailResult = await sendInvoiceEmail(appointment, invoiceBuffer, additionalText);
    
    if (emailResult.success) {
      return res.json({ 
        success: true, 
        message: "Инвойс успешно отправлен пациенту", 
        emailInfo: emailResult.info 
      });
    } else {
      return res.json({ 
        success: false, 
        message: "Ошибка при отправке инвойса", 
        error: emailResult.error 
      });
    }
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API для получения списка пациентов с количеством их приемов
const getDoctorPatients = async (req, res) => {
  try {
    // Получаем ID доктора из токена, а не из тела запроса
    const docId = req.docId;
    
    // Получаем все приемы данного врача
    const appointments = await appointmentModel.find({ docId });
    
    // Создаем мапу для хранения информации о пациентах
    const patientsMap = new Map();
    
    // Проходим по всем приемам и группируем информацию по пациентам
    appointments.forEach(appointment => {
      const { userId, userData } = appointment;
      
      if (!patientsMap.has(userId)) {
        // Если пациент встречается впервые, создаем запись
        patientsMap.set(userId, {
          userId,
          userData,
          totalAppointments: 1,
          completedAppointments: appointment.isCompleted ? 1 : 0,
          cancelledAppointments: appointment.cancelled ? 1 : 0,
          lastAppointmentDate: appointment.date,
          appointments: [appointment],
        });
      } else {
        // Иначе обновляем существующую запись
        const patientData = patientsMap.get(userId);
        patientData.totalAppointments += 1;
        if (appointment.isCompleted) patientData.completedAppointments += 1;
        if (appointment.cancelled) patientData.cancelledAppointments += 1;
        if (appointment.date > patientData.lastAppointmentDate) {
          patientData.lastAppointmentDate = appointment.date;
        }
        patientData.appointments.push(appointment);
      }
    });
    
    // Преобразуем мапу в массив и сортируем по количеству завершенных приемов (по убыванию)
    let patientsList = Array.from(patientsMap.values())
      .sort((a, b) => b.completedAppointments - a.completedAppointments);
    
    res.json({ 
      success: true, 
      patients: patientsList,
      totalPatients: patientsList.length
    });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  sendInvoiceToPatient,
  getDoctorPatients,
};
