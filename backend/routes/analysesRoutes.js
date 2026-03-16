import express from "express";
import upload from "../middleware/multer.js";
import {
    uploadAnalysis,
    getPatientAnalyses,
    getAllAnalyses,
    addAnalysisType,
    getAnalysisTypes,
    getPatients,
} from "../controllers/analysesController.js";

const analysesRouter = express.Router();

analysesRouter.post("/upload-analysis", upload.single("pdf"), uploadAnalysis);
analysesRouter.get("/patient-analyses", getPatientAnalyses); // теперь GET с query
analysesRouter.get("/all", getAllAnalyses);
analysesRouter.post("/add-type", addAnalysisType);
analysesRouter.get("/types", getAnalysisTypes);
analysesRouter.get("/patients", getPatients);

export default analysesRouter;