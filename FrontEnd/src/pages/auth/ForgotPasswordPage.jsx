import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../../services/authService";
import { message } from "antd";

const SCREEN = {
  FORGOT: "forgot",
  OTP: "otp",
  SUCCESS: "success",
  RESET: "reset",
};

function getStrength(val) {
  let strength = 0;
  const hasLength = val.length >= 8;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);
  if (hasLength) strength += 50;
  if (hasSpecial) strength += 50;
  return { strength, hasLength, hasSpecial };
}

const ForgotPasswordPage = () => {
  const [screen, setScreen] = useState(SCREEN.FORGOT);
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passError, setPassError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const canResend = screen === SCREEN.OTP && timeLeft === 0;

  const { strength, hasLength, hasSpecial } = getStrength(newPassword);

  // TIMER OTP
  useEffect(() => {
    if (screen === SCREEN.OTP && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, screen]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  function strengthLabel() {
    if (strength === 0)
      return { text: "Enter a password", color: "text-outline" };
    if (strength === 50) return { text: "Moderate", color: "text-amber-600" };
    return { text: "Strong password", color: "text-emerald-600" };
  }

  function strengthBarColor() {
    if (strength === 0) return "bg-error";
    if (strength === 50) return "bg-amber-500";
    return "bg-emerald-500";
  }

  // GỬI OTP
  async function handleForgot(e) {
    e.preventDefault();
    setApiError("");
    setSubmitting(true);

    try {
      await forgotPassword(email);

      // SUCCESS
      message.success("Đã gửi mã OTP về email");

      setSentEmail(email);
      setScreen(SCREEN.OTP);
      setTimeLeft(120);
    } catch (err) {
      message.error("Gửi OTP thất bại");

      setApiError(err.response?.data?.message || "Gửi OTP thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  // Gửi lại OTP
  async function handleResendOtp() {
    try {
      await forgotPassword(email);

      message.success("Đã gửi lại OTP");

      setTimeLeft(120);
    } catch {
      message.error("Gửi lại OTP thất bại");

      setApiError("Gửi lại OTP thất bại");
    }
  }

  // Xác thực OTP
  async function handleVerifyOtp() {
    try {
      await verifyOtp(email, otp);

      message.success("Xác thực OTP thành công ✅");

      setScreen(SCREEN.RESET);
    } catch {
      message.error("OTP không đúng hoặc hết hạn ❌");

      setApiError("OTP không đúng hoặc hết hạn");
    }
  }

  // Đặt lại mật khẩu
  async function handleFinalSubmit(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPassError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(sentEmail, newPassword, confirmPassword);

      message.success("Đổi mật khẩu thành công 🎉");

      navigate("/login");
    } catch {
      message.error("Reset mật khẩu thất bại ❌");

      setApiError("Reset thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  function resetFlow() {
    setScreen(SCREEN.FORGOT);
    setEmail("");
    setOtp("");
    setTimeLeft(120);
  }

  const label = strengthLabel();
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <div className="grow flex items-center justify-center px-margin-mobile pt-20 pb-10">
        {/* Forgot Password Screen */}
        {screen === SCREEN.FORGOT && (
          <div className="w-full max-w-110">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm p-stack-lg flex flex-col gap-stack-lg">
              <div className="text-center space-y-stack-sm">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-stack-md">
                  <span className="material-symbols-outlined text-primary">
                    lock_reset
                  </span>
                </div>
                <h1 className="font-headline-md text-headline-md text-on-surface">
                  Quên mật khẩu?
                </h1>
                <p className="font-body-sm text-[13px] text-on-surface-variant">
                  Nhập địa chỉ email liên kết với tài khoản của bạn và chúng tôi
                  sẽ gửi cho bạn một đường dẫn để đặt lại mật khẩu.
                </p>
              </div>

              <form className="space-y-stack-md" onSubmit={handleForgot}>
                <div className="space-y-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="email"
                  >
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                      mail
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                      id="email"
                      placeholder="name@gmail.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="w-full py-3 px-4 rounded-lg gradient-primary text-white font-label-md text-label-md shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Xác nhận gửi"}
                </button>
                {apiError && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    {apiError}
                  </p>
                )}
              </form>

              <div className="text-center pt-stack-sm">
                <Link
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors group"
                  to="/login"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                    arrow_back
                  </span>
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {screen === SCREEN.SUCCESS && (
          <div className="w-full max-w-110">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm p-stack-lg flex flex-col gap-stack-lg text-center">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center mx-auto">
                <span
                  className="material-symbols-outlined text-secondary text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>

              <div className="space-y-stack-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Kiểm tra email của bạn
                </h2>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{" "}
                  <span className="font-semibold text-on-surface">
                    {sentEmail}
                  </span>
                  .
                </p>
              </div>

              <div className="bg-surface-container-low rounded-lg p-stack-md text-left flex gap-stack-md items-start">
                <span className="material-symbols-outlined text-outline text-[20px]">
                  info
                </span>

                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  Chưa nhận được email? Hãy kiểm tra thư mục Spam hoặc thử lại
                  sau khoảng 2 phút.
                </p>
              </div>

              <button
                className="w-full py-3 px-4 rounded-lg bg-surface border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-all active:scale-[0.98]"
                onClick={() => setScreen(SCREEN.RESET)}
              >
                Mở ứng dụng email
              </button>

              <div className="text-center pt-stack-sm">
                <button
                  className="font-label-md text-label-md text-primary hover:underline"
                  onClick={resetFlow}
                >
                  Gửi lại liên kết
                </button>
              </div>
            </div>
          </div>
        )}
        {/* OTP Screen */}
        {screen === SCREEN.OTP && (
          <div className="w-full max-w-110">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm p-stack-lg flex flex-col gap-stack-lg text-center">
              <h2 className="font-headline-md text-on-surface">Nhập mã OTP</h2>

              <p className="font-body-sm text-on-surface-variant">
                Mã đã được gửi tới <b>{email}</b>
              </p>

              {/* Input OTP */}
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center text-xl tracking-[8px] py-3 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="______"
              />

              {/* Timer */}
              <p className="text-sm text-outline">
                Thời gian còn lại:{" "}
                <span className="text-primary font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </p>

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 px-4 rounded-lg gradient-primary text-white"
              >
                Xác nhận OTP
              </button>

              {/* Resend */}
              {canResend ? (
                <button
                  onClick={() => {
                    setTimeLeft(120);
                    handleResendOtp();
                  }}
                  className="text-primary hover:underline"
                >
                  Gửi lại mã OTP
                </button>
              ) : (
                <p className="text-sm text-outline">
                  Có thể gửi lại sau khi hết thời gian
                </p>
              )}

              {apiError && <p className="text-red-400 text-sm">{apiError}</p>}
            </div>
          </div>
        )}
        {/* Reset Password Screen */}
        {screen === SCREEN.RESET && (
          <div className="w-full max-w-110">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm p-stack-lg flex flex-col gap-stack-lg">
              <div className="text-center space-y-stack-sm">
                <h1 className="font-headline-md text-headline-md text-on-surface">
                  Đặt lại mật khẩu mới
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng
                  trước đây.
                </p>
              </div>

              <form className="space-y-stack-md" onSubmit={handleFinalSubmit}>
                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="new-password"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                      lock
                    </span>
                    <input
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                      id="new-password"
                      placeholder="••••••••"
                      required
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                      onClick={() => setShowNewPass((v) => !v)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showNewPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>

                  {/* Strength Meter */}
                  <div className="pt-2 space-y-2">
                    <div className="h-1.5 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                      <div
                        className={`strength-bar h-full ${strengthBarColor()}`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-label-sm text-label-sm ${label.color}`}
                      >
                        {label.text}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        {strength}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="confirm-password"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                      lock
                    </span>
                    <input
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                      id="confirm-password"
                      placeholder="••••••••"
                      required
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                      onClick={() => setShowConfirmPass((v) => !v)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showConfirmPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Requirements */}
                <ul className="space-y-2 py-2">
                  <li
                    className={`flex items-center gap-2 text-label-sm ${
                      hasLength ? "text-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        hasLength ? "text-emerald-500" : "text-outline"
                      }`}
                      style={
                        hasLength
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      {hasLength ? "check_circle" : "circle"}
                    </span>
                    Ít nhất 8 ký tự
                  </li>

                  <li
                    className={`flex items-center gap-2 text-label-sm ${
                      hasSpecial ? "text-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        hasSpecial ? "text-emerald-500" : "text-outline"
                      }`}
                      style={
                        hasSpecial
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      {hasSpecial ? "check_circle" : "circle"}
                    </span>
                    Chứa ít nhất một ký tự đặc biệt
                  </li>
                </ul>

                {passError && (
                  <p className="font-body-sm text-body-sm text-error">
                    {passError}
                  </p>
                )}

                <button
                  className="w-full py-3 px-4 rounded-lg gradient-primary text-white font-label-md text-label-md shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Resetting..." : "Reset password"}
                </button>
              </form>

              <div className="text-center pt-stack-sm">
                <button
                  className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                  onClick={resetFlow}
                >
                  Cancel and go back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
