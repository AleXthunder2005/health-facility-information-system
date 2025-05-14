import React, { useState, useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';

const InvoiceModal = ({ isOpen, onClose, appointmentData }) => {
  const { sendInvoice } = useContext(DoctorContext);
  const [additionalText, setAdditionalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendInvoice = async () => {
    if (!appointmentData || !appointmentData._id) return;
    
    setIsLoading(true);
    try {
      const result = await sendInvoice(appointmentData._id, additionalText);
      if (result.success) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Отправить инвойс пациенту</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Пациент: <span className="font-medium">{appointmentData?.userData?.name}</span>
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Email: <span className="font-medium">{appointmentData?.userData?.email}</span>
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Сумма: <span className="font-medium">{appointmentData?.amount} руб.</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дополнительное сообщение (необязательно)
          </label>
          <textarea
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            rows="4"
            placeholder="Введите дополнительный текст для письма..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            onClick={handleSendInvoice}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Отправить инвойс'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal; 