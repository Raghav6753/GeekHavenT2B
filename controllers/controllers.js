import { User } from "../models/models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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
  const otp = (Math.floor(1000 + Math.random() * 9000)).toString();
  user.otp = otp;
  await user.save();

  return res.json({ otp });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (user && user.otp === otp) {
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token, user: { email: user.email } });
  }
  return res.status(400).json({ success: false, error: "Invalid OTP" });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Email not found" });
  if (user.password !== password) return res.status(401).json({ error: "Invalid password" });
  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ success: true, token, user: { email: user.email } });
};

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already exists" });
  const user = new User({ email, password });
  await user.save();
  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ success: true, token, user: { email: user.email } });
};
