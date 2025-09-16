import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register User: api/user/register
export const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.json({ success: false, message: "Detalles faltantes" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, message: "El usuario ya existe" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });

      res.cookie("token", token, {
        httpOnly: true, // prevent js to access cookie
        secure: process.env.NODE_ENV === "production", // use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // prevent CSRF attacks
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days cookies expiration time
      });

      return res.json({ success: true, user: {email: user.email, name: user.name} });
    } catch (err) {
        console.log({ success: false, message: err.message });
        res.json({ success: false, message: err.message });
    }
  };