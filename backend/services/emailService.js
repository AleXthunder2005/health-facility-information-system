import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import "dotenv/config";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendInvoiceEmail = async (appointmentData, invoiceBuffer, emailText = '') => {
  try {
    const transporter = createTransporter();
    const patientEmail = appointmentData.userData.email;
    if (!patientEmail) {
      throw new Error('Email пациента не найден');
    }
    const defaultText = `Уважаемый(ая) ${appointmentData.userData.name}!\n\nВаш прием у врача ${appointmentData.docData.name} от ${appointmentData.slotDate}, ${appointmentData.slotTime} успешно завершен.\n\nПожалуйста, оплатите счет за услуги. Инвойс прикреплен к этому письму.\n\nСумма к оплате: ${appointmentData.amount} руб.\n\nС уважением,\nКоманда ExtraCare`;
    const emailContent = emailText ? `${defaultText}\n\n${emailText}` : defaultText;
    const mailOptions = {
      from: `"ExtraCare" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: 'Счет за медицинские услуги',
      text: emailContent,
      attachments: [
        {
          filename: `invoice_${appointmentData._id}.pdf`,
          content: invoiceBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      info
    };
  } catch (error) {
    console.error('Ошибка при отправке email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const generateSimpleInvoice = async (appointmentData) => {
  const invoiceText = `
ИНВОЙС #${appointmentData._id}
Дата: ${new Date().toLocaleDateString()}

Пациент: ${appointmentData.userData.name}
Врач: ${appointmentData.docData.name}
Дата приема: ${appointmentData.slotDate}, ${appointmentData.slotTime}

Сумма к оплате: ${appointmentData.amount} руб.

Спасибо за выбор ExtraCare!
`;
  return Buffer.from(invoiceText);
}; 
