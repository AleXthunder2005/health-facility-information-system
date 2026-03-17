import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },

    complaints: { type: String, default: "" },
    notes: { type: String, default: "" },
    recommendations: { type: String, default: "" },

    primaryPrice: { type: Number, default: 0 },

    services: { type: Array, default: [] },

    totalPrice: { type: Number, default: 0 },

    slotDate: { type: String },
    slotTime: { type: String },

    date: { type: Number },

}, { timestamps: true });

const visitModel =
    mongoose.models.visit || mongoose.model("visit", visitSchema);

export default visitModel;