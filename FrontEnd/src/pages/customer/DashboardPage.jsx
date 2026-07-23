import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  getMyPurchasedCourses,
  getMyRecentOrders,
} from "../../services/userService";
import { getWishlist } from "../../services/wishlistService";

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  useEffect(() => {
    getMyPurchasedCourses()
      .then((res) => setMyCourses(res.data.data.slice(0, 3)))
      .catch(() => setMyCourses([]))
      .finally(() => setCoursesLoading(false));
    getMyRecentOrders()
      .then((res) => setRecentOrders(res.data.data))
      .catch(() => setRecentOrders([]))
      .finally(() => setOrdersLoading(false));
    getWishlist()
      .then((res) => setWishlistItems(res.data.data.slice(0, 3)))
      .catch(() => setWishlistItems([]))
      .finally(() => setWishlistLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-stack-lg pb-10">
      {/* Welcome */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-headline-lg text-on-surface">
            Chào mừng <span className="text-primary">{user.username}</span> 👋
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Tiếp tục hành trình học tập của bạn hoặc khám phá các khóa học mới!
          </p>
        </div>
      </header>

      {/* My Courses */}
      <section>
        <div className="flex justify-between items-center mb-stack-md">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Khóa học của tôi
          </h3>
          <Link
            className="text-primary font-label-md flex items-center gap-1 hover:underline"
            to="/my-courses"
          >
            Xem tất cả
          </Link>
        </div>
        {/* Loading skeleton */}
        {coursesLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-surface-container" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-surface-container rounded w-3/4" />
                  <div className="h-3 bg-surface-container rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!coursesLoading && myCourses.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block">
              school
            </span>
            <p className="text-body-md text-on-surface-variant">
              Bạn chưa mua khóa học nào.
            </p>
            <button
              type="button"
              onClick={() => navigate("/all-courses")}
              className="inline-flex items-center gap-1 text-primary text-body-sm hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">
                explore
              </span>
              Khám phá khóa học
            </button>
          </div>
        )}

        {/* Course grid */}
        {!coursesLoading && myCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <div
                key={course._id}
                className="glass-card rounded-3xl overflow-hidden group"
              >
                <div className="h-40 overflow-hidden relative bg-surface-container">
                  {course.thumbnail ? (
                    <img
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={course.thumbnail}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                        play_circle
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-1 text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[15px]">
                      person
                    </span>
                    {course.provider}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                    <span className="text-[11px] text-on-surface-variant">
                      {course.paidAt
                        ? new Date(course.paidAt).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/course/detail/${course._id}`)}
                      className="p-2 rounded-lg bg-primary text-on-primary hover:opacity-90"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        play_arrow
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Wishlist + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg">
        {/* Wishlist */}
        <section>
          <div className="flex justify-between items-center mb-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Danh sách yêu thích
            </h3>
            <Link
              to="/wishlist"
              className="text-primary font-label-md flex items-center gap-1 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {/* Loading skeleton */}
            {wishlistLoading && (
              <>
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-card p-4 rounded-2xl flex items-center gap-4 animate-pulse"
                  >
                    <div className="w-20 h-14 rounded-lg bg-surface-container shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-surface-container rounded w-3/4" />
                      <div className="h-3 bg-surface-container rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Empty state */}
            {!wishlistLoading && wishlistItems.length === 0 && (
              <div className="glass-card p-6 rounded-2xl text-center space-y-2">
                <span
                  className="material-symbols-outlined text-3xl text-on-surface-variant/30 block"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  favorite
                </span>
                <p className="text-body-sm text-on-surface-variant">
                  Chưa có khóa học yêu thích nào.
                </p>
              </div>
            )}

            {/* Real wishlist items */}
            {!wishlistLoading &&
              wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-surface transition-colors cursor-pointer border border-transparent hover:border-outline-variant/20"
                  onClick={() => navigate(`/course/detail/${item._id}`)}
                >
                  <div className="w-20 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    {item.thumbnail ? (
                      <img
                        alt={item.title}
                        className="w-full h-full object-cover"
                        src={item.thumbnail}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl text-on-surface-variant/30">
                          play_circle
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface text-body-sm line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-on-surface-variant">
                      {item.provider}
                      {item.duration ? ` • ${item.duration}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="font-bold text-primary text-[13px]">
                      {item.price === 0
                        ? "Miễn phí"
                        : `${item.price.toLocaleString("vi-VN")}đ`}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          _id: item._id,
                          course_title: item.title,
                          image_url: item.thumbnail,
                          price: item.price,
                          price_promotion: null,
                          provider: item.provider,
                        });
                      }}
                      className="text-[12px] text-secondary hover:underline block"
                    >
                      Thêm giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <div className="flex justify-between items-center mb-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Đơn hàng gần đây
            </h3>
            <Link
              to="/user/orders"
              className="text-primary font-label-md flex items-center gap-1 hover:underline"
            >
              Xem tất cả đơn hàng
            </Link>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Loading skeleton */}
            {ordersLoading && (
              <div className="divide-y divide-outline-variant/10">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                    <div className="h-3 bg-surface-container rounded w-24" />
                    <div className="h-3 bg-surface-container rounded w-24" />
                    <div className="h-3 bg-surface-container rounded w-20 ml-auto" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!ordersLoading && recentOrders.length === 0 && (
              <div className="p-8 text-center text-on-surface-variant text-body-sm">
                Bạn chưa có đơn hàng nào.
              </div>
            )}

            {/* Table */}
            {!ordersLoading && recentOrders.length > 0 && (
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant/10">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-[11px] text-on-surface-variant">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-4 font-label-md text-[11px] text-on-surface-variant">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-4 font-label-md text-[11px] text-on-surface-variant">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 font-label-md text-[11px] text-on-surface-variant text-right">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {recentOrders.map((order) => {
                    const statusMap = {
                      paid: {
                        label: "Đã thanh toán",
                        cls: "bg-green-100 text-green-700",
                      },
                      pending: {
                        label: "Chờ thanh toán",
                        cls: "bg-yellow-100 text-yellow-700",
                      },
                      failed: {
                        label: "Thất bại",
                        cls: "bg-red-100 text-red-600",
                      },
                      refunded: {
                        label: "Hoàn tiền",
                        cls: "bg-blue-100 text-blue-600",
                      },
                    };
                    const { label, cls } = statusMap[order.paymentStatus] ?? {
                      label: order.paymentStatus,
                      cls: "bg-surface-container text-on-surface-variant",
                    };
                    return (
                      <tr key={order._id}>
                        <td className="px-6 py-4 text-[12px] font-medium font-mono">
                          {order.shortId}
                        </td>
                        <td className="px-6 py-4 text-[12px] text-on-surface-variant">
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td className="px-6 py-4 text-[12px] font-bold text-on-surface">
                          {order.total.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${cls}`}
                          >
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
