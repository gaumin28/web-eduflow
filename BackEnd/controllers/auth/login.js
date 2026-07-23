import userModel from "../../models/user.js";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // tìm user bằng email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Account is locked",
      });
    }

    // access token (ngắn hạn)
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      ACCESS_SECRET,
      { expiresIn: "30m" },
    );

    // refresh token (dài hạn)
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // lưu refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // trả data cho frontend
    //local
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false, // true nếu deploy HTTPS
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    // });
    // deploy
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
