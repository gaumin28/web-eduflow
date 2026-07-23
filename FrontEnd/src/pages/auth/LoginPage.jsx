import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  // const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    const { email, password } = values;

    setSubmitting(true);
    try {
      const user = await login(email, password);

      message.success("Đăng nhập thành công ✅");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "provider") {
        navigate("/provider");
      } else if (user.role === "customer") {
        navigate("/"); // hoặc "/search" nếu bạn có page search
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      message.error(
        err.response?.data?.message || "Email hoặc mật khẩu không đúng",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const hero = document.querySelector(".hero-pattern");
      if (!hero) return;
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      hero.style.backgroundPosition = `${moveX}px ${moveY}px`;
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Hero Section */}
      <section className="hidden md:flex md:w-1/2 relative overflow-hidden hero-pattern items-center justify-center p-margin-desktop bg-[#4F46E5]">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZufuli37g8IzSxrqEszEuUDpYQ5GGRu0pVHz1fOamHDZODrxg2OtibfaG2DFDzDtyQ-4oZVBzimBRjLt_74wrJF7Sj5jrfEy9rmR2eH-Izr-u9SihFWUw6HCg5zLQys_ZZSix0Kwpm-4uuCHaisDv5J91AYjtritQNdYf8fTTCXVDT5jDqgNWIUidjK_yloPWztS3czV0nLf--rrj4UfEwn8ZKTcAHg3nlgkCrB4TzkUd4dNKIJAsLhsdjVshJkCWRS6xmrzTqr8" // Replace with actual hero image URL
            alt="Students collaborating in a modern library"
          />
        </div>
        <div className="relative z-10 text-center max-w-md">
          {/* Vietnamese Badge Text */}
          <div className="inline-flex items-center gap-stack-sm mb-stack-lg px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="font-label-md text-label-md text-white">
              Tham gia cùng hơn 50.000+ học viên tích cực
            </span>
          </div>

          {/* Vietnamese Main Headline */}
          <h1 className="font-display text-[40px] text-white mb-stack-md leading-tight">
            Học tập từ những chuyên gia hàng đầu.
          </h1>

          {/* Vietnamese Descriptive Text */}
          <p className="font-body-lg text-[16px] text-white/80">
            Khám phá hàng nghìn khóa học chất lượng cao từ nhiều nhà cung cấp
            khác nhau, giúp bạn làm chủ kỹ năng mới trên một nền tảng tập trung,
            thuận tiện.
          </p>

          {/* Vietnamese Stats Section */}
          <div className="mt-12 grid grid-cols-3 gap-stack-md">
            <div className="p-stack-md rounded-xl bg-white/5 border border-white/10">
              <span className="block font-headline-md text-headline-md text-white">
                1.5k+
              </span>
              <span className="block font-label-sm text-label-sm text-white/60">
                Giảng Viên Chuyên Nghiệp
              </span>
            </div>
            <div className="p-stack-md rounded-xl bg-white/5 border border-white/10">
              <span className="block font-headline-md text-headline-md text-white">
                4.8/5
              </span>
              <span className="block font-label-sm text-label-sm text-white/60">
                Điểm Đánh Giá Học Viên
              </span>
            </div>
            <div className="p-stack-md rounded-xl bg-white/5 border border-white/10">
              <span className="block font-headline-md text-headline-md text-white">
                Hỗ Trợ
              </span>
              <span className="block font-label-sm text-label-sm text-white/60">
                Toàn Diện 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="flex-1 flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop bg-surface">
        {/* Mobile brand logo */}
        <div className="md:hidden w-full flex justify-center mb-stack-lg">
          <span className="font-display text-[24px] font-bold text-primary">
            EduFlow
          </span>
        </div>

        <div className="w-full max-w-110">
          <div className="glass-panel p-stack-lg md:p-10 rounded-3xl shadow-xl">
            {/* Vietnamese Card Headline */}
            <div className="mb-stack-lg">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">
                Chào mừng bạn quay lại
              </h2>
              <p className="font-body-md text-[12px] text-center text-on-surface-variant">
                Nhập thông tin đăng nhập để truy cập vào trang web.
              </p>
            </div>

            {/* Social Login (keeping English names is standard) */}
            <div className="grid grid-cols-2 gap-stack-md mb-stack-lg">
              <button
                type="button"
                className="flex items-center justify-center gap-stack-sm px-stack-md py-3 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors duration-200"
              >
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                />
                <span className="font-label-md text-label-md text-on-surface">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-stack-sm px-stack-md py-3 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-label-md text-label-md text-on-surface">
                  Facebook
                </span>
              </button>
            </div>

            {/* Vietnamese Divider Text */}
            <div className="relative flex items-center mb-stack-lg">
              <div className="grow border-t border-outline-variant"></div>
              <span className="shrink mx-4 font-label-sm text-label-sm text-outline">
                HOẶC TIẾP TỤC BẰNG EMAIL
              </span>
              <div className="grow border-t border-outline-variant"></div>
            </div>

            {/* Login Form */}
            <Form
              onFinish={onFinish}
              autoComplete="off"
              className="space-y-4"
              layout="vertical"
            >
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
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  autoComplete="new-password"
                  placeholder="Nhập mật khẩu của bạn"
                  className="h-12! rounded-xl!"
                />
              </Form.Item>

              {/* BUTTON */}
              <Button
                htmlType="submit"
                loading={submitting}
                className="w-full! h-12! rounded-xl! bg-primary! text-white!"
              >
                Đăng nhập
              </Button>

              {/* REGISTER */}
              <div className="flex gap-1 items-center">
                <p
                  className="text-[#FF0000] hover:underline ml-1 cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Quên mật khẩu?
                </p>
                <div className="text-[#d0d0d0]">|</div>
                <p className="text-center text-sm">
                  Nếu bạn chưa có tài khoản?
                  <span
                    className="text-blue-600 hover:underline ml-1 cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Đăng ký
                  </span>
                </p>
              </div>
            </Form>
          </div>

          {/* Footer Links (standard Vietnamese transliteration or keeping English) */}
          <div className="mt-stack-lg flex justify-center gap-stack-md font-label-sm text-label-sm text-outline">
            <a className="hover:text-on-surface transition-colors" href="#">
              Privacy Policy
            </a>
            <span>•</span>
            <a className="hover:text-on-surface transition-colors" href="#">
              Terms of Service
            </a>
            <span>•</span>
            <a className="hover:text-on-surface transition-colors" href="#">
              Help Center
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
