import mongoose from "mongoose";

const analysesSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    analysisType: { type: mongoose.Schema.Types.ObjectId, ref: "analysisType", required: true },
    pdf: { type: String, required: true },
    date: { type: Date, required: true }, // дата анализа
    time: { type: String, required: true }, // время анализа в формате "HH:mm"
});

const analysesModel = mongoose.models.analyses || mongoose.model("analyses", analysesSchema);

export default analysesModel;