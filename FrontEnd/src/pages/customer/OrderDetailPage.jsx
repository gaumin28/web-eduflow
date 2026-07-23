import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getMyOrderDetail } from "../../services/userService";

const STATUS_MAP = {
  paid: { label: "Đã thanh toán", cls: "bg-green-100 text-green-700" },
  pending: { label: "Chờ thanh toán", cls: "bg-yellow-100 text-yellow-700" },
  failed: { label: "Thất bại", cls: "bg-red-100 text-red-600" },
  refunded: { label: "Hoàn tiền", cls: "bg-blue-100 text-blue-600" },
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
  } = useQuery({
    queryKey: ["customer-order-detail", orderId || ""],
    enabled: !!orderId,
    queryFn: async () => {
      const res = await getMyOrderDetail(orderId);
      return res.data.data;
    },
  });

  const order = data || null;
  const loading = !!orderId && (isLoading || isFetching);
  const error = !orderId
    ? "Thiếu mã đơn hàng."
    : queryError?.response?.data?.message || queryError?.message || "";

  const status = STATUS_MAP[order?.paymentStatus] || {
    label: order?.paymentStatus || "-",
    cls: "bg-surface-container text-on-surface-variant",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display font-bold text-headline-lg text-on-surface">
            Chi tiết đơn hàng
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {order?.shortId || "-"}
          </p>
        </div>

        <Link
          to="/user/orders"
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-2 text-[12px] font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">
            arrow_back
          </span>
          Quay lại danh sách
        </Link>
      </header>

      {loading && (
        <div className="glass-card rounded-2xl p-8 text-on-surface-variant">
          Đang tải chi tiết đơn hàng...
        </div>
      )}

      {!loading && error && (
        <div className="glass-card rounded-2xl p-8 text-center text-error">
          <span className="material-symbols-outlined text-4xl block mb-2">
            error
          </span>
          {error}
        </div>
      )}

      {!loading && !error && order && (
        <>
          <section className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[12px] text-on-surface-variant">
                Trạng thái thanh toán:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold ${status.cls}`}
              >
                {status.label}
              </span>
              <span className="text-[12px] text-on-surface-variant">
                Trạng thái đơn:{" "}
                <span className="font-semibold text-on-surface capitalize">
                  {order.orderStatus}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-[13px]">
              <p className="text-on-surface-variant">
                Ngày tạo:{" "}
                <span className="font-semibold text-on-surface">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </span>
              </p>
              <p className="text-on-surface-variant">
                Phương thức:{" "}
                <span className="font-semibold text-on-surface capitalize">
                  {order.paymentMethod}
                </span>
              </p>
              {order.paidAt && (
                <p className="text-on-surface-variant sm:col-span-2">
                  Thanh toán lúc:{" "}
                  <span className="font-semibold text-on-surface">
                    {new Date(order.paidAt).toLocaleString("vi-VN")}
                  </span>
                </p>
              )}
            </div>
          </section>

          <section className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant">
                    Khóa học
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant text-center">
                    Số lượng
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant text-right">
                    Đơn giá
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant text-right">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {order.items.map((item) => (
                  <tr key={item.courseId}>
                    <td className="px-6 py-4 text-[13px] text-on-surface">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-on-surface-variant text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-on-surface-variant text-right">
                      {item.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-on-surface text-right">
                      {item.lineTotal.toLocaleString("vi-VN")}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <div className="ml-auto max-w-sm space-y-2 text-[13px]">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Tạm tính</span>
                <span>{order.subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Giảm giá</span>
                <span>-{order.discount.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Thuế</span>
                <span>{order.tax.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-on-surface font-bold">
                <span>Tổng thanh toán</span>
                <span>{order.total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
