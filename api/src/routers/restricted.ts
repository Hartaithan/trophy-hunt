import express from "express";
import { cors } from "../middleware/cors";
import { checkHMAC } from "../middleware/hmac";

const router = express.Router();

router.use("/api", cors);
router.use("/api", checkHMAC);

export default router;
