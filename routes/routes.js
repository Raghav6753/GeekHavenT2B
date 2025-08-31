import express from "express";
import { findEmail, sendOtp, verifyOtp, signin, signup } from "../controllers/controllers.js";

const router = express.Router();

router.post("/find-email", findEmail);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signin", signin);
router.post("/signup", signup);

export default router;
