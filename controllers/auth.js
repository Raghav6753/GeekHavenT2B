import { User } from "../models/models.js";
import crypto from "crypto";
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const findEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) return res.json({ exists: true });
  return res.json({ exists: false });
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Email not found" });
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();
  return res.json({ otp });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  user.otp = null;
  user.otpExpires = null;
  await user.save();
  return res.json({ success: true });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Email not found" });
  if (user.password !== password) return res.status(401).json({ error: "Invalid password" });
  return res.json({ success: true, user: { email: user.email } });
};

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already exists" });
  const user = new User({ email, password });
  await user.save();
  return res.json({ success: true, user: { email: user.email } });
};
