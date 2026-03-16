import mongoose from "mongoose";

const analysisTypeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    }

})

const analysisTypeModel =
    mongoose.models.analysisType ||
    mongoose.model("analysisType", analysisTypeSchema)

export default analysisTypeModel