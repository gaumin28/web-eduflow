import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { Form, Input, Button, message } from "antd";

function getStrength(password) {
  let strength = 0;
  if (password.length > 5) strength += 25;
  if (password.length > 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
  return strength;
}

function StrengthBar({ strength }) {
  if (strength === 0)
    return (
      <p className="font-label-sm text-label-sm text-on-surface-variant">
        Ít nhất 8 ký tự được khuyến nghị.
      </p>
    );
  if (strength <= 50)
    return (
      <p className="font-label-sm text-label-sm text-error">Mật khẩu yếu</p>
    );
  if (strength <= 75)
    return (
      <p className="font-label-sm text-label-sm text-secondary">Mật khẩu tốt</p>
    );
  return (
    <p className="font-label-sm text-label-sm text-[#02e102]">Mật khẩu mạnh</p>
  );
}

function strengthBarColor(strength) {
  if (strength === 0) return "";
  if (strength <= 50) return "bg-error";
  if (strength <= 75) return "bg-secondary";
  return "bg-[#02e102]";
}

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    const { email, password, username, confirmPassword } = values;

    setSubmitting(true);
    try {
      await register({ email, password, username, confirmPassword });

      message.success("Đăng ký thành công ✅");

      navigate("/login");
    } catch (err) {
      console.log("REGISTER ERROR:", err); // debug

      message.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const strength = getStrength(password);

  return (
    <div className="bg-background mesh-gradient min-h-screen flex flex-col">
      <div className="grow flex items-center justify-center py-stack-lg px-margin-mobile">
        <div className="w-full max-w-250 grid md:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden border border-outline-variant/20">
          {/* Branding Side */}
          <div className="hidden md:flex flex-col justify-between p-stack-lg bg-primary-container text-on-primary-container relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZufuli37g8IzSxrqEszEuUDpYQ5GGRu0pVHz1fOamHDZODrxg2OtibfaG2DFDzDtyQ-4oZVBzimBRjLt_74wrJF7Sj5jrfEy9rmR2eH-Izr-u9SihFWUw6HCg5zLQys_ZZSix0Kwpm-4uuCHaisDv5J91AYjtritQNdYf8fTTCXVDT5jDqgNWIUidjK_yloPWztS3czV0nLf--rrj4UfEwn8ZKTcAHg3nlgkCrB4TzkUd4dNKIJAsLhsdjVshJkCWRS6xmrzTqr8" // Replace with actual hero image URL
                alt="Students collaborating in a modern library"
              />
            </div>
            <div className="relative z-10">
              <span className="font-label-md text-label-md px-3 py-1 bg-on-primary-container/10 rounded-full inline-block mb-stack-md">
                Chào mừng bạn gia nhập EduFlow
              </span>
              <h1 className="font-bold text-[34px] leading-tight mb-stack-md">
                Làm Chủ Tương Lai, Khóa Học Từng Bước.
              </h1>
              <p className="font-body-lg text-body-lg opacity-90 max-w-sm">
                Gia nhập hơn 50.000+ học viên, phát triển kỹ năng với sự hướng
                dẫn của các chuyên gia.
              </p>
            </div>

            <div className="relative z-10 space-y-stack-md">
              {[
                {
                  icon: "verified",
                  title: "Giảng Viên Đã Xác Minh",
                  desc: "Chỉ học từ những chuyên gia giỏi nhất.",
                },
                {
                  icon: "history_edu",
                  title: "Quyền Truy Cập Trọn Đời",
                  desc: "Khóa học của bạn sẽ không bao giờ hết hạn.",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-center gap-stack-md p-stack-md bg-white/5 rounded-lg border border-white/10 glass-card"
                >
                  <span className="material-symbols-outlined text-on-primary-container bg-primary/20 p-2 rounded-lg">
                    {icon}
                  </span>
                  <div>
                    <p className="font-label-md text-label-md">{title}</p>
                    <p className="font-body-sm text-body-sm opacity-80">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="p-stack-lg md:p-12 flex flex-col justify-center">
            <div className="mb-stack-lg">
              <h2 className="font-display text-headline-lg text-on-surface mb-2">
                Tạo tài khoản
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Nhập thông tin chi tiết để bắt đầu hành trình học tập.
              </p>
            </div>

            <Form
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              className="space-y-4"
            >
              {/* USERNAME */}
              <Form.Item
                name="username"
                label={<span className="text-[12px]">Tên người dùng</span>}
                rules={[{ required: true, message: "Vui lòng nhập username!" }]}
              >
                <Input
                  autoComplete="new-password"
                  placeholder="vd: phu123"
                  className="h-12! rounded-xl!"
                />
              </Form.Item>

              {/* EMAIL */}
              <Form.Item
                name="email"
                label={<span className="text-[12px]">Địa chỉ Email</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  autoComplete="new-password"
                  placeholder="vd: abc@gmail.com"
                  className="h-12! rounded-xl!"
                />
              </Form.Item>

              {/* PASSWORD */}
              <Form.Item
                name="password"
                label={<span className="text-[12px]">Mật khẩu</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Tối thiểu 6 ký tự!" },
                ]}
              >
                <Input.Password
                  autoComplete="new-password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12! rounded-xl!"
                />
              </Form.Item>

              {password && (
                <>
                  <div className="flex gap-1 h-1.5 w-full bg-surface-container rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-300 ${strengthBarColor(strength)}`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>

                  <StrengthBar strength={strength} />
                </>
              )}

              {/* CONFIRM PASSWORD */}
              <Form.Item
                name="confirmPassword"
                label={<span className="text-[12px]">Xác nhận mật khẩu</span>}
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className="h-12! rounded-xl!"
                />
              </Form.Item>

              {/* BUTTON */}
              <Button
                htmlType="submit"
                loading={submitting}
                className="w-full! h-12! rounded-xl! bg-primary! text-white!"
              >
                Đăng ký
              </Button>

              {/* LOGIN */}
              <p className="text-center text-sm">
                Đã có tài khoản?
                <span
                  className="text-blue-600 hover:underline ml-1 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </span>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
