import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },
}, { timestamps: true });

const serviceModel = mongoose.models.service || mongoose.model("service", serviceSchema);

export default serviceModel;