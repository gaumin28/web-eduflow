import jwt from "jsonwebtoken";
import userModel from "../../models/user.js";

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "NO_REFRESH_TOKEN" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    // check token trong DB 
    const user = await userModel.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "INVALID_REFRESH_TOKEN" });
    }

    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role, // ✅ fix: lấy từ DB
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "INVALID_REFRESH_TOKEN" });
  }
};

export default refreshToken;