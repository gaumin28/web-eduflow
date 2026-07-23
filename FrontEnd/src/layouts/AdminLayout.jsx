import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Modal } from "antd";
import NotificationBell from "../components/NotificationBell/NotificationBell";

const MENU_ITEMS = [
  { icon: "dashboard", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "group", label: "Users", to: "/admin/users" },
  { icon: "receipt_long", label: "Orders", to: "/admin/orders" },
  { icon: "co_present", label: "Providers", to: "/admin/providers-requests" },
  { icon: "school", label: "Courses", to: "#", disabled: true },
  { icon: "category", label: "Categories", to: "/admin/categories " },
  { icon: "settings", label: "Settings", to: "/security-settings" },
];

export default function AdminLayout({ children, title = "Admin Console" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const username = user?.username || user?.fullName || user?.email || "Admin";

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        await logout();
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col gap-[16px] bg-surface-container-low py-[32px] shadow-md">
        <div className="mb-8 px-6">
          <Link
            to="/admin/dashboard"
            className="font-headline-md text-headline-md font-bold text-primary"
          >
            EduFlow
          </Link>
          <p className="mt-1 text-xs text-on-surface-variant">
            Admin management
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {MENU_ITEMS.map(({ icon, label, to, disabled }) =>
            disabled ? (
              <div
                key={label}
                className="flex cursor-not-allowed items-center gap-3 px-4 py-3 font-label-md text-label-md text-on-surface-variant/45"
                title="Coming soon"
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span>{label}</span>
              </div>
            ) : (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 font-label-md text-label-md transition-all ${
                    isActive
                      ? "translate-x-1 border-l-4 border-primary bg-primary-container/20 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                  }`
                }
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ),
          )}
        </nav>

        <div className="mt-auto px-4">
          <div className="glass-card mb-4 rounded-xl p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
                {username[0]?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                  {username}
                </p>
                <p className="text-xs capitalize text-on-surface-variant">
                  {user?.role || "admin"}
                </p>
              </div>
            </div>

            <Link
              to="/admin/users"
              className="block w-full rounded-lg bg-primary py-2 text-center font-label-sm text-label-sm text-on-primary transition-opacity hover:opacity-90"
            >
              Manage Users
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:text-error"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-outline-variant/30 bg-surface/70 shadow-sm backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-[40px]">
          <div className="flex flex-1 items-center gap-[24px]">
            <h1 className="font-headline-md text-headline-md text-on-surface">
              {title}
            </h1>

            <div className="relative hidden w-full max-w-md md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="w-full rounded-full border border-outline-variant/50 bg-surface-container-low py-2 pl-10 pr-4 text-body-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Global system search..."
                type="text"
              />
            </div>
          </div>

          <div className="ml-[24px] flex items-center gap-4">
            <NotificationBell user={user} />

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="font-label-md text-label-md text-on-surface">
                  {username}
                </p>
                <p className="text-xs capitalize text-on-surface-variant">
                  {user?.role || "admin"}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/20 font-bold text-primary">
                {username[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen px-[40px] pb-12 pt-24">
        {children}
      </main>
    </div>
  );
}
