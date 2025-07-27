import express from "express";
import { cors } from "../middleware/cors";

const router = express.Router();

router.use("/api", cors);

export default router;
