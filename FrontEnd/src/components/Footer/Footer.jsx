import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-stack-lg bg-surface-container-lowest border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-7xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link
            className="font-headline-md text-headline-md font-bold text-[#4F46E5] hover:text-primary transition-colors"
            to="/"
          >
            EduFlow
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs text-center md:text-left">
            Trao quyền cho người học trên toàn thế giới thông qua nền tảng giáo
            dục chất lượng cao, dễ tiếp cận.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-8">
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all hover:underline"
            to="/about"
          >
            Giới thiệu
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all hover:underline"
            to="/providers"
          >
            Nhà cung cấp
          </Link>
          {[
            "Chính sách bảo mật",
            "Điều khoản dịch vụ",
            "Trung tâm trợ giúp",
            "Liên hệ",
          ].map((link) => (
            <Link
              key={link}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all hover:underline"
              to="/"
            >
              {link}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4">
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              to="/"
            >
              <span className="material-symbols-outlined">public</span>
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              to="/"
            >
              <span className="material-symbols-outlined">alternate_email</span>
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              to="/"
            >
              <span className="material-symbols-outlined">share</span>
            </Link>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2024 EduFlow Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
