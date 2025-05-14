import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import "dotenv/config";

// Конфигурация транспорта для отправки электронной почты
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

/**
 * Отправка электронного письма с инвойсом пациенту
 * @param {Object} appointmentData - данные о записи на прием
 * @param {Buffer|String} invoiceBuffer - буфер с PDF-инвойсом или путь к файлу инвойса
 * @param {String} emailText - дополнительный текст сообщения
 * @returns {Promise<Object>} результат отправки
 */
export const sendInvoiceEmail = async (appointmentData, invoiceBuffer, emailText = '') => {
  try {
    const transporter = createTransporter();
    
    // Получаем email пациента из данных записи
    const patientEmail = appointmentData.userData.email;
    
    if (!patientEmail) {
      throw new Error('Email пациента не найден');
    }

    // Базовый текст письма
    const defaultText = `Уважаемый(ая) ${appointmentData.userData.name}!\n\nВаш прием у врача ${appointmentData.docData.name} от ${appointmentData.slotDate}, ${appointmentData.slotTime} успешно завершен.\n\nПожалуйста, оплатите счет за услуги. Инвойс прикреплен к этому письму.\n\nСумма к оплате: ${appointmentData.amount} руб.\n\nС уважением,\nКоманда ExtraCare`;

    // Объединяем базовый текст с дополнительным
    const emailContent = emailText ? `${defaultText}\n\n${emailText}` : defaultText;

    // Опции для отправки письма
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

    // Отправляем письмо
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

/**
 * Генерация простого PDF-инвойса
 * @param {Object} appointmentData - данные о записи на прием
 * @returns {Buffer} буфер с PDF-файлом
 */
export const generateSimpleInvoice = async (appointmentData) => {
  // Для простоты в этом примере возвращаем тестовый файл
  // В реальном приложении здесь должна быть логика генерации PDF
  
  // Создаем простой текстовый инвойс (в реальном приложении следует использовать библиотеку для генерации PDF)
  const invoiceText = `
ИНВОЙС #${appointmentData._id}
Дата: ${new Date().toLocaleDateString()}

Пациент: ${appointmentData.userData.name}
Врач: ${appointmentData.docData.name}
Дата приема: ${appointmentData.slotDate}, ${appointmentData.slotTime}

Сумма к оплате: ${appointmentData.amount} руб.

Спасибо за выбор ExtraCare!
`;

  // В реальной реализации здесь должна быть генерация PDF через библиотеку типа PDFKit
  return Buffer.from(invoiceText);
}; 