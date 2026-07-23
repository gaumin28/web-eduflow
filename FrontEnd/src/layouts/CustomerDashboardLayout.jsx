import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Outlet } from "react-router-dom";
import { Avatar, Modal } from "antd";
import {SolutionOutlined} from "@ant-design/icons";
import NotificationBell from "../components/NotificationBell/NotificationBell";
const NAV_ITEMS = [
  {
    icon: "dashboard",
    label: "Bảng điều khiển",
    filled: true,
    link: "/user/dashboard",
  },
  {
    icon: "key",
    label: "Thay đổi mật khẩu",
    filled: true,
    link: "/user/change-password",
  },
  {
    icon: <SolutionOutlined />,
    label: "Trở thành nhà cung cấp",
    filled: true,
    link: "/user/register-provider",
  },
  {
    icon: "settings",
    label: "Cài đặt tài khoản",
    filled: true,
    link: "/user/account-settings",
  },
];

const CustomerDashboardLayout = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        await logout();
        navigate("/login", { replace: true });
      },
    });
  };
  return (
    <div className="bg-surface font-body-md text-on-surface">
      {/* TopNavBar */}
      <header className="fixed top-0 z-50 w-full bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm h-16 flex justify-between items-center px-margin-desktop max-w-container-max left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-stack-lg">
          <Link to="/">
            <span className="font-display text-headline-md font-bold text-primary">
              EduFlow
            </span>
          </Link>
          <div></div>
        </div>
        <div className="flex items-center gap-stack-md">
          <div className="flex items-center gap-stack-sm">
            <NotificationBell user={user} />
            <button
              type="button"
              className="relative p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-full"
              onClick={() => navigate("/cart")}
              aria-label={`Shopping cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-error text-on-error text-[10px] font-bold leading-5 text-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </button>
          </div>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
            <Avatar style={{ backgroundColor: "#4F46E5" }}>
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-[300px] bg-surface pt-20 pb-stack-lg flex-col gap-stack-md border-r border-outline-variant/30 hidden lg:flex">
          <div className="px-6 mb-stack-md">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div className="max-w-[50px] w-full aspect-square px-2 h-auto rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface">
                  {user?.username ?? "User"}
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  {user?.email ?? "Email"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map(({ icon, label, filled, link }) => {
              const active = location.pathname === link;

              return (
                <Link
                  key={label}
                  to={link}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md transition-all ${
                    active
                      ? "bg-primary-container/20 text-primary border-l-4 border-primary"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={
                      filled ? { fontVariationSettings: "'FILL' 1" } : undefined
                    }
                  >
                    {icon}
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 mt-4 text-error font-label-md hover:bg-error-container/10 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-margin-mobile md:p-margin-desktop bg-surface-container-lowest pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 flex justify-around py-3 px-4 z-50 shadow-lg">
        {[
          { icon: "dashboard", label: "Home", active: true },
          { icon: "school", label: "Courses", active: false },
          { icon: "favorite", label: "Saved", active: false },
          { icon: "person", label: "Profile", active: false },
          { icon: "help", label: "Help", active: false },
          { icon: "settings", label: "Settings", active: false },
        ].map(({ icon, label, active }) => (
          <a
            key={label}
            className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-on-surface-variant"}`}
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className={`text-[10px] ${active ? "font-bold" : ""}`}>
              {label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default CustomerDashboardLayout;
