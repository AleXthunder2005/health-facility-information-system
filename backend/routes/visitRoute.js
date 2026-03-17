import express from "express";
import { getUserVisits, getDoctorVisits } from "../controllers/visitController.js";
import authUser from "../middleware/authUser.js";
import authDoctor from "../middleware/authDoctor.js";

const visitRouter = express.Router();

visitRouter.get("/user", authUser, getUserVisits);
visitRouter.get("/doctor", authDoctor, getDoctorVisits);

export default visitRouter;