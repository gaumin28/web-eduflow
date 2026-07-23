import api from "../lib/api";

export const login = (email, password) =>
  api.post("/login", { email, password });

export const register = (data) => api.post("/register", data);

export const logout = () => api.post("/logout");

export const forgotPassword = (email) =>
  api.post("/forgot-password", { email });

// Verify OTP
export const verifyOtp = (email, otp) =>
  api.post("/verify-otp", { email, otp });

// Reset password
export const resetPassword = (email, newPassword, confirmPassword) =>
  api.post("/reset-password", {
    email,
    newPassword,
    confirmPassword,
});


export const verifyEmail = (token) => api.post("/auth/verify-email", { token });

export const resendVerification = (email) =>
  api.post("/auth/resend-verification", { email });
