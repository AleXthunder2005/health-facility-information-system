import visitModel from "../models/visitModel.js";

// визиты пользователя
const getUserVisits = async (req, res) => {
    try {
        const userId = req.body.userId; // вместо req.userId

        const visits = await visitModel
            .find({ userId })       // визиты конкретного пользователя
            .populate("docId", "name speciality address image label") // подтянуть данные врача
            .sort({ createdAt: -1 });

        res.json({ success: true, visits });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// визиты врача
const getDoctorVisits = async (req, res) => {
    try {
        const docId = req.docId;
        const { patientId } = req.query;

        const query = { docId };

        if (patientId) {
            query.userId = patientId;
        }

        const visits = await visitModel
            .find(query)
            .populate("docId", "name speciality image")
            .populate("userId", "name dob")
            .sort({ createdAt: -1 });

        res.json({ success: true, visits });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
export { getUserVisits, getDoctorVisits };