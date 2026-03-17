import express from "express";
import {
    getServices,
    addService,
    updateService,
    deleteService
} from "../controllers/serviceController.js";
import authDoctor from "../middleware/authDoctor.js";

const serviceRouter = express.Router();

serviceRouter.get("/", getServices);
serviceRouter.post("/add", addService);
serviceRouter.post("/update", updateService);
serviceRouter.post("/delete", deleteService);

export default serviceRouter;