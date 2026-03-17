import serviceModel from "../models/serviceModel.js";

// Получить все услуги
const getServices = async (req, res) => {
    try {
        const services = await serviceModel.find().sort({ createdAt: -1 });
        res.json({ success: true, services });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Добавить услугу
const addService = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.json({ success: false, message: "Заполните все поля" });
        }

        const newService = new serviceModel({ name, price });
        await newService.save();

        res.json({ success: true, message: "Услуга добавлена" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Обновить услугу
const updateService = async (req, res) => {
    try {
        const { serviceId, name, price } = req.body;

        await serviceModel.findByIdAndUpdate(serviceId, { name, price });

        res.json({ success: true, message: "Услуга обновлена" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Удалить услугу
const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.body;

        await serviceModel.findByIdAndDelete(serviceId);

        res.json({ success: true, message: "Услуга удалена" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export {
    getServices,
    addService,
    updateService,
    deleteService
};