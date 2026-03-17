import visitModel from "../models/visitModel.js";

// визиты пользователя
const getUserVisits = async (req, res) => {
    try {
        const userId = req.body.userId; // вместо req.userId
        console.log("userId from body:", userId);

        const visits = await visitModel
            .find({ userId })       // визиты конкретного пользователя
            .populate("docId", "name speciality address") // подтянуть данные врача
            .sort({ createdAt: -1 });
        console.log("visits found:", visits.length);

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

        const visits = await visitModel
            .find({ docId })
            .populate("userId", "name dob")
            .sort({ createdAt: -1 });

        res.json({ success: true, visits });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getUserVisits, getDoctorVisits };