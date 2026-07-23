import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/ui/Pagination";
import { getAdminOrders } from "../../services/adminOrderService";

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "Payment: All" },
  { value: "pending", label: "Payment: Pending" },
  { value: "paid", label: "Payment: Paid" },
  { value: "failed", label: "Payment: Failed" },
  { value: "refunded", label: "Payment: Refunded" },
];

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "Order: All" },
  { value: "pending", label: "Order: Pending" },
  { value: "processing", label: "Order: Processing" },
  { value: "completed", label: "Order: Completed" },
  { value: "cancelled", label: "Order: Cancelled" },
];

const LIMIT_OPTIONS = [10, 20, 50];

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("vi-VN");
}

function toCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function Badge({ value, type }) {
  const normalized = String(value || "").toLowerCase();

  const map =
    type === "payment"
      ? {
          paid: "bg-green-100 text-green-700",
          pending: "bg-yellow-100 text-yellow-700",
          failed: "bg-red-100 text-red-700",
          refunded: "bg-blue-100 text-blue-700",
        }
      : {
          completed: "bg-green-100 text-green-700",
          processing: "bg-blue-100 text-blue-700",
          pending: "bg-yellow-100 text-yellow-700",
          cancelled: "bg-red-100 text-red-700",
        };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        map[normalized] || "bg-surface-container text-on-surface-variant"
      }`}
    >
      {normalized || "-"}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search.trim(),
      paymentStatus,
      orderStatus,
      dateFrom,
      dateTo,
      minPrice,
      maxPrice,
    }),
    [
      page,
      limit,
      search,
      paymentStatus,
      orderStatus,
      dateFrom,
      dateTo,
      minPrice,
      maxPrice,
    ],
  );

  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders", queryParams],
    queryFn: async () => getAdminOrders(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const orders = data?.data || [];
  const pagination = data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };
  const loading = isLoading || isFetching;
  const error =
    queryError?.response?.data?.message || queryError?.message || "";

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setPaymentStatus("");
    setOrderStatus("");
    setDateFrom("");
    setDateTo("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="space-y-[24px]">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-container/15 px-3 py-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">
              receipt_long
            </span>
            <span className="font-label-sm text-label-sm uppercase">
              Order Management
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Quản Lí Đơn Hàng
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Hiển thị toàn bộ đơn hàng, tìm kiếm và lọc theo trạng thái/ngày/giá.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={() => refetch()}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}
          >
            refresh
          </span>
          Refresh
        </button>
      </section>

      <section className="glass-card rounded-xl">
        <div className="grid grid-cols-1 gap-4 border-b border-outline-variant/30 p-5 lg:grid-cols-4">
          <label className="relative lg:col-span-2">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-body-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Tìm theo mã đơn (#ABC123), tên hoặc email..."
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </label>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={paymentStatus}
            onChange={(event) => {
              setPaymentStatus(event.target.value);
              setPage(1);
            }}
          >
            {PAYMENT_STATUS_OPTIONS.map((item) => (
              <option key={item.value || "all"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={orderStatus}
            onChange={(event) => {
              setOrderStatus(event.target.value);
              setPage(1);
            }}
          >
            {ORDER_STATUS_OPTIONS.map((item) => (
              <option key={item.value || "all"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label>
            <span className="mb-1 block text-[12px] text-on-surface-variant">
              Từ ngày
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => {
                setDateFrom(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label>
            <span className="mb-1 block text-[12px] text-on-surface-variant">
              Đến ngày
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => {
                setDateTo(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label>
            <span className="mb-1 block text-[12px] text-on-surface-variant">
              Giá tối thiểu
            </span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => {
                setMinPrice(event.target.value);
                setPage(1);
              }}
              placeholder="0"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label>
            <span className="mb-1 block text-[12px] text-on-surface-variant">
              Giá tối đa
            </span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => {
                setMaxPrice(event.target.value);
                setPage(1);
              }}
              placeholder="5000000"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
          >
            {LIMIT_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}/page
              </option>
            ))}
          </select>

          <button
            type="button"
            className="rounded-lg border border-outline-variant px-3 py-2.5 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        </div>

        {error && (
          <div className="border-b border-error/20 bg-error/10 px-5 py-3 text-body-sm text-error">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="px-5 py-3 text-[11px] font-semibold text-on-surface-variant">
                  Mã đơn
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-on-surface-variant">
                  Khách hàng
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-on-surface-variant">
                  Sản phẩm
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-on-surface-variant">
                  Tổng tiền
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-on-surface-variant">
                  Thanh toán
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-on-surface-variant">
                  Trạng thái đơn
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-on-surface-variant">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-on-surface-variant"
                  >
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              )}

              {!loading && orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-on-surface-variant"
                  >
                    Không có dữ liệu đơn hàng phù hợp.
                  </td>
                </tr>
              )}

              {!loading &&
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-surface-container-lowest/50"
                  >
                    <td className="px-5 py-3 text-[12px] font-semibold font-mono text-on-surface">
                      {order.shortId}
                    </td>
                    <td className="px-5 py-3 text-[12px] text-on-surface">
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-on-surface-variant">
                        {order.customerEmail || "-"}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-on-surface-variant">
                      {order.itemCount}
                    </td>
                    <td className="px-5 py-3 text-[12px] font-semibold text-on-surface">
                      {toCurrency(order.total)}
                    </td>
                    <td className="px-5 py-3 text-[12px]">
                      <Badge value={order.paymentStatus} type="payment" />
                    </td>
                    <td className="px-5 py-3 text-[12px]">
                      <Badge value={order.orderStatus} type="order" />
                    </td>
                    <td className="px-5 py-3 text-[12px] text-on-surface-variant">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page || page}
          totalPages={pagination.totalPages || 1}
          onPageChange={setPage}
          disabled={loading}
        />
      </section>
    </div>
  );
}
