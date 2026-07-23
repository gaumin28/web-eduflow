import http from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import routerUser from "./routes/user.js";
import routerLogin from "./routes/auth/login.js";
import routerRegister from "./routes/auth/register.js";
import routerChangePassword from "./routes/auth/changePassword.js";
import routerCategory from "./routes/category.js";
import routerProvider from "./routes/provider.js";
import routerCourse from "./routes/course.js";
import routerCart from "./routes/cart.js";
import routerRefreshToken from "./routes/auth/refreshToken.js";
import routerForgotPassword from "./routes/auth/forgotPassword.js";
import routerLogout from "./routes/auth/logout.js";
import routerDashboard from "./routes/dashboard.js";
import routerQuizCourse from "./routes/quiz.js";
import routerNotification from "./routes/notification.js";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const PORT = process.env.PORT || 8080;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = new Set([
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [...allowedOrigins],
    credentials: true,
  },
});

// Lắng nghe Admin join room
io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  // Khi Client yêu cầu vào phòng (Ví dụ: admin-room)
  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} đã tham gia phòng: ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("Thiếu MONGODB_URI trong file .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Kết nối MongoDB thành công!");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
    process.exit(1);
  });

// Tài khoản
app.use("/", routerUser);

// Đăng nhập
app.use("/", routerLogin);

// Đăng ký
app.use("/", routerRegister);

// Đăng xuất
app.use("/", routerLogout);

// Đổi mật khẩu
app.use("/", routerChangePassword);

// Quên mật khẩu
app.use("/", routerForgotPassword);

// Danh mục
app.use("/", routerCategory);

// Nhà cung cấp
app.use("/", routerProvider);

// Khóa học
app.use("/", routerCourse);

// Câu hỏi
app.use("/", routerQuizCourse);

// Giỏ hàng + Checkout
app.use("/", routerCart);

// Thông báo
app.use("/", routerNotification);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Refresh token
app.use("/", routerRefreshToken);

app.use("/", routerDashboard);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
