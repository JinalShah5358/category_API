import express from "express";
import authRouter from "./auth.route";
import categoryRouter from "./category.route";
import { authCheck } from "../middleware/authCheck";
const router = express.Router();

// public routes
router.use("/auth", authRouter);

// private routes
router.use("/category", authCheck, categoryRouter);

export default router;
