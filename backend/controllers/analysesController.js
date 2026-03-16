import analysesModel from "../models/analysisModel.js";
import analysisTypeModel from "../models/analysisTypeModel.js";
import userModel from "../models/userModel.js";

// загрузка анализа
const uploadAnalysis = async (req, res) => {
    try {
        const { patientId, analysisType, analysisDate, analysisTime } = req.body;
        const pdfFile = req.file;

        if (!pdfFile) return res.json({ success: false, message: "PDF файл не загружен" });

        const pdfUrl = `/uploads/${pdfFile.filename}`;

        // проверка и конвертация даты
        const analysisDateTime = analysisDate && analysisTime ? new Date(`${analysisDate}T${analysisTime}`) : new Date();

        const analysis = new analysesModel({
            patientId,
            analysisType,
            pdf: pdfUrl,
            date: analysisDateTime,
            time: analysisTime || analysisDateTime.toTimeString().slice(0, 5),
        });

        await analysis.save();
        res.json({ success: true, message: "Анализ успешно загружен" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// получить анализы конкретного пациента
const getPatientAnalyses = async (req, res) => {
    try {
        const { patientId } = req.query; // GET запрос
        if (!patientId) return res.json({ success: false, message: "Не указан patientId" });

        const analyses = await analysesModel
            .find({ patientId })
            .populate("analysisType")
            .populate("patientId", "name")
            .sort({ date: -1 });

        res.json({ success: true, analyses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// остальные контроллеры без изменений
const getAllAnalyses = async (req, res) => {
    try {
        const analyses = await analysesModel.find({}).populate("analysisType").populate("patientId", "name");
        res.json({ success: true, analyses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const addAnalysisType = async (req, res) => {
    try {
        const { name } = req.body;
        const newType = new analysisTypeModel({ name });
        await newType.save();
        res.json({ success: true, message: "Тип анализа добавлен" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAnalysisTypes = async (req, res) => {
    try {
        const types = await analysisTypeModel.find({});
        res.json({ success: true, types });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await userModel.find({}).select("name");
        res.json({ success: true, patients });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export {
    uploadAnalysis,
    getPatientAnalyses,
    getAllAnalyses,
    addAnalysisType,
    getAnalysisTypes,
    getPatients,
};