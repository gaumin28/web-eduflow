import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, message, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import NotificationBell from "../NotificationBell/NotificationBell";
import socket from "../../socket/socket";

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join_room", user._id); 
    }
  }, [socket, user]);

  const handleSearch = () => {
    const keyword = searchKeyword.trim();
    if (keyword) {
      navigate(`/all-courses?q=${encodeURIComponent(keyword)}`);
      return;
    }
    navigate("/all-courses");
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const menuItems = user
    ? [
        {
          key: "dashboard",
          label: "Bảng điều khiển",
          onClick: () => navigate("/user/dashboard"),
        },
        {
          type: "divider",
        },

        {
          key: "logout",
          label: "Đăng xuất",
          danger: true,
          onClick: () => {
            Modal.confirm({
              title: "Bạn muốn đăng xuất?",
              onOk: async () => {
                try {
                  await logout();

                  message.success("Đăng xuất thành công!");

                  navigate("/login");
                } catch (error) {
                  console.error(error);
                  message.error("Đăng xuất thất bại! Vui lòng thử lại.");
                }
              },
            });
          },
        },
      ]
    : [
        {
          key: "login",
          label: "Đăng nhập",
          onClick: () => navigate("/login"),
        },
        {
          key: "register",
          label: "Đăng ký",
          onClick: () => navigate("/register"),
        },
      ];

  return (
    <header className="fixed top-0 w-full z-100 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between px-margin-desktop h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-stack-lg">
          <Link
            className="font-headline-md text-headline-md font-bold text-primary"
            to="/"
          >
            EduFlow
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-label-md text-label-md text-text-on-surface-variant pb-1 transition-all duration-200 ease-in-out ${
                  isActive ? "border-[#0000ff] text-[#0000ff] border-b" : ""
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/all-courses"
              className={({ isActive }) =>
                `font-label-md text-label-md text-text-on-surface-variant pb-1 transform transition-all duration-200 ease-in-out ${
                  isActive
                    ? "border-[#0000ff] text-[#0000ff] border-b"
                    : "border-none "
                }`
              }
            >
              Khóa học
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-label-md text-label-md text-text-on-surface-variant pb-1 transform transition-all duration-200 ease-in-out ${
                  isActive
                    ? "border-[#0000ff] text-[#0000ff] border-b"
                    : "border-none "
                }`
              }
            >
              Giới thiệu
            </NavLink>
            <NavLink
              to="/providers"
              className={({ isActive }) =>
                `font-label-md text-label-md text-text-on-surface-variant pb-1 transform transition-all duration-200 ease-in-out ${
                  isActive
                    ? "border-[#0000ff] text-[#0000ff] border-b"
                    : "border-none "
                }`
              }
            >
              Nhà cung cấp
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-surface-container px-4 py-2 rounded-full gap-2 border border-outline-variant/20 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <button
              type="button"
              className="material-symbols-outlined text-on-surface-variant cursor-pointer"
              onClick={handleSearch}
              aria-label="Tìm kiếm khóa học"
            >
              search
            </button>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none"
              placeholder="Search courses..."
              type="text"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative p-2 hover:bg-primary-container/10 rounded-full transition-colors active:scale-95"
              onClick={() => navigate("/cart")}
              aria-label={`Shopping cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                shopping_cart
              </span>
              {itemCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-error text-on-error text-[10px] font-bold leading-5 text-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </button>
            <NotificationBell user={user} />
          </div>

          {/* <div className="hidden sm:flex items-center gap-3 ml-2">
                    <Link
                        to="/login"
                        className="font-label-md text-label-md text-primary px-4 py-2 hover:bg-primary-container/10 rounded-lg transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="font-label-md text-label-md bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg shimmer-btn shadow-md active:scale-95 transition-transform"
                    >
                        Get Started
                    </Link>
                    </div> */}

          <div className="hidden sm:flex items-center gap-3 ml-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="font-label-md text-label-md text-primary px-4 py-2 border-[0.5px] p-5 hover:bg-primary-container/10 rounded-lg"
                >
                  Đăng nhập
                </Link>
                {/* 
                            <Link
                                to="/register"
                                className="font-label-md bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg"
                            >
                                Get Started
                            </Link> */}
              </>
            ) : (
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="flex items-center gap-2 cursor-pointer hover:bg-primary-container/10 px-3 py-2 rounded-lg transition">
                  <Avatar style={{ backgroundColor: "#4F46E5" }}>
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>

                  <span className="text-sm font-medium">{user.username}</span>

                  <DownOutlined className="text-xs" />
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
