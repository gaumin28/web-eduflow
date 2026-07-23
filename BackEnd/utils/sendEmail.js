import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"EduFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mã OTP đặt lại mật khẩu",
    html: `
      <div style="font-family: Arial; dis">
        <h2>Đặt lại mật khẩu</h2>
        <p>Mã OTP của bạn là:</p>
        <h1 style="color:#1677ff">${otp}</h1>
        <p>Mã có hiệu lực trong 2 phút.</p>
      </div>
    `,
  });
};