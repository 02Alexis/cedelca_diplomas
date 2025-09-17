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
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
  };

// login User: api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Se requieren correo electrónico y contraseña" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Se requiere un correo electrónico válido" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Correo electrónico o contraseña no válidos" });
        }

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
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// check auth: /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    return res.json({success: true, user});
          
  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message});
  }
}

// logout: /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }
    );
    return res.json({success: true, message: "Logout exitoso"});
  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message});
  }
}
