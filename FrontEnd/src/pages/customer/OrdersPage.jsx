import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyAllOrders } from "../../services/userService";

const STATUS_MAP = {
  paid: { label: "Đã thanh toán", cls: "bg-green-100 text-green-700" },
  pending: { label: "Chờ thanh toán", cls: "bg-yellow-100 text-yellow-700" },
  failed: { label: "Thất bại", cls: "bg-red-100 text-red-600" },
  refunded: { label: "Hoàn tiền", cls: "bg-blue-100 text-blue-600" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyAllOrders()
      .then((res) => setOrders(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.message ?? "Không thể tải đơn hàng"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-stack-lg">
      <header>
        <h1 className="font-display font-bold text-headline-lg text-on-surface">
          Lịch sử đơn hàng
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          {loading ? "Đang tải…" : `${orders.length} đơn hàng`}
        </p>
      </header>

      {/* Loading */}
      {loading && (
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-outline-variant/10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-6 animate-pulse">
              <div className="h-3 bg-surface-container rounded w-24" />
              <div className="h-3 bg-surface-container rounded w-24" />
              <div className="h-3 bg-surface-container rounded w-32 flex-1" />
              <div className="h-3 bg-surface-container rounded w-20" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="glass-card rounded-2xl p-8 text-center text-error">
          <span className="material-symbols-outlined text-4xl block mb-2">
            error
          </span>
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 block">
            receipt_long
          </span>
          <p className="font-bold text-on-surface">Bạn chưa có đơn hàng nào</p>
          <p className="text-body-md text-on-surface-variant">
            Mua khóa học để bắt đầu học tập!
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && orders.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant">
                  Ngày đặt
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant">
                  Khóa học
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant text-right">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders.map((order) => {
                const { label, cls } = STATUS_MAP[order.paymentStatus] ?? {
                  label: order.paymentStatus,
                  cls: "bg-surface-container text-on-surface-variant",
                };

                return (
                  <tr
                    key={order._id}
                    className="hover:bg-surface-container/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-[12px] font-medium font-mono">
                      {order.shortId}
                    </td>
                    <td className="px-6 py-4 text-[12px] text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-[12px] text-on-surface-variant">
                      {order.items.length === 1
                        ? order.items[0]
                        : `${order.items[0]} +${order.items.length - 1} khóa học`}
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
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/user/orders/${order._id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-1.5 text-[12px] font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        Xem chi tiết
                        <span className="material-symbols-outlined text-[16px]">
                          arrow_forward
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
