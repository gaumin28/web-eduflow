import { useQuery } from "@tanstack/react-query";

import {
  getDashboardStats,
  getRevenueChart,
  getDashboardTables,
} from "../../services/adminDashboardService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

function StatCard({ title, value, icon, format = "number" }) {
  const displayValue =
    format === "currency"
      ? formatCurrency(value || 0)
      : formatNumber(value || 0);
  return (
    <div className="glass-card flex flex-col justify-between rounded-xl p-5 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
      </div>
      <div>
        <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          {title}
        </p>
        <h4 className="mt-1 font-display text-2xl font-bold text-on-surface">
          {displayValue}
        </h4>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: async () => {
      const [statsRes, chartRes, tablesRes] = await Promise.all([
        getDashboardStats(),
        getRevenueChart(),
        getDashboardTables(),
      ]);

      return {
        stats: statsRes.data || {},
        chartData: chartRes.data || [],
        tablesData: tablesRes.data || {
          topCourses: [],
          topProviders: [],
          pendingProviders: [],
        },
      };
    },
  });

  const stats = data?.stats || {};
  const chartData = data?.chartData || [];
  const tablesData = data?.tablesData || {
    topCourses: [],
    topProviders: [],
    pendingProviders: [],
  };
  const loading = isLoading || isFetching;
  const error =
    queryError?.response?.data?.message || queryError?.message || "";

  return (
    <div className="space-y-[24px]">
      {/* 1. Header */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-container/15 px-3 py-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">
              analytics
            </span>
            <span className="font-label-sm text-label-sm uppercase">
              Platform Overview
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Dashboard
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Tổng quan số liệu và hoạt động của nền tảng trong thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant px-4 py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={() => refetch()}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}
            >
              refresh
            </span>
            Làm mới
          </button>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-error-container bg-error-container/40 p-4 text-on-error-container">
          <span className="material-symbols-outlined">error</span>
          <p className="text-body-sm">{error}</p>
        </div>
      )}

      {/* 2. KPI Cards */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="glass-card h-33 animate-pulse rounded-xl bg-surface-container/50"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng Doanh Thu"
            value={stats?.totalRevenue}
            icon="payments"
            format="currency"
          />
          <StatCard
            title="Doanh Thu Tháng Này"
            value={stats?.currentMonthRevenue}
            icon="account_balance_wallet"
            format="currency"
          />
          <StatCard
            title="Đơn Hàng Đã Thanh Toán"
            value={stats?.paidOrders}
            icon="shopping_cart_checkout"
          />
          <StatCard
            title="Tổng Học Viên"
            value={stats?.totalStudents}
            icon="school"
          />

          <StatCard
            title="Khóa Học (Active)"
            value={stats?.activeCourses}
            icon="menu_book"
          />
          <StatCard
            title="Giảng Viên (Approved)"
            value={stats?.approvedProviders}
            icon="co_present"
          />
          <StatCard
            title="Khách Hàng (Users)"
            value={stats?.totalCustomers}
            icon="group"
          />
          <StatCard
            title="Tổng Danh Mục"
            value={stats?.totalCategories}
            icon="category"
          />
        </div>
      )}

      {/* 3. Revenue Chart */}
      <section className="glass-card flex flex-col rounded-xl">
        <div className="border-b border-outline-variant/30 px-6 py-5">
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Doanh thu 6 tháng gần nhất
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Biểu đồ doanh thu từ các đơn hàng đã thanh toán thành công
          </p>
        </div>
        <div className="h-87.5 w-full p-6 pt-8">
          {loading && chartData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center animate-pulse bg-surface-container/20 rounded-xl">
              <span className="material-symbols-outlined text-outline-variant text-4xl">
                show_chart
              </span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined mb-2 text-4xl opacity-50">
                analytics
              </span>
              <p>Chưa có dữ liệu doanh thu.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#c7c4d8"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#777587", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#777587", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                  labelStyle={{ fontWeight: "bold", color: "#0b1c30" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{
                    r: 6,
                    fill: "#4f46e5",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* 4. Tables Grid */}
      <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
        {/* Top Courses */}
        <section className="glass-card flex flex-col rounded-xl overflow-hidden">
          <div className="border-b border-outline-variant/30 px-6 py-5">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Khóa học bán chạy nhất
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant">
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                    Giá
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {loading && tablesData.topCourses.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 w-48 rounded bg-surface-container"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-12 rounded bg-surface-container"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 rounded bg-surface-container"></div>
                      </td>
                    </tr>
                  ))
                ) : tablesData.topCourses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-8 text-center text-body-sm text-on-surface-variant"
                    >
                      Chưa có dữ liệu.
                    </td>
                  </tr>
                ) : (
                  tablesData.topCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="transition-colors hover:bg-primary-container/5"
                    >
                      <td className="px-6 py-4">
                        <p className="font-label-md text-label-md font-semibold text-on-surface line-clamp-1">
                          {course.course_title}
                        </p>
                        <p className="text-xs text-on-surface-variant line-clamp-1">
                          {course.provider_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-body-sm font-semibold text-primary">
                        {formatNumber(course.students)}
                      </td>
                      <td className="px-6 py-4 font-body-sm text-on-surface-variant">
                        {formatCurrency(course.price)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Top Providers & Pending Providers */}
        <div className="flex flex-col gap-[24px]">
          {/* Top Providers */}
          <section className="glass-card flex flex-col rounded-xl overflow-hidden">
            <div className="border-b border-outline-variant/30 px-6 py-5">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                Giảng viên tiêu biểu
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant">
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                      Giảng viên
                    </th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                      Học viên
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {loading && tablesData.topProviders.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 w-32 rounded bg-surface-container"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-10 rounded bg-surface-container"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-12 rounded bg-surface-container"></div>
                        </td>
                      </tr>
                    ))
                  ) : tablesData.topProviders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-8 text-center text-body-sm text-on-surface-variant"
                      >
                        Chưa có dữ liệu.
                      </td>
                    </tr>
                  ) : (
                    tablesData.topProviders.map((provider) => (
                      <tr
                        key={provider._id}
                        className="transition-colors hover:bg-primary-container/5"
                      >
                        <td className="px-6 py-4 font-label-md text-label-md font-semibold text-on-surface">
                          {provider.provider_name}
                        </td>
                        <td className="px-6 py-4 font-body-sm text-on-surface-variant">
                          {formatNumber(provider.totalCourses)}
                        </td>
                        <td className="px-6 py-4 font-body-sm font-semibold text-secondary-fixed">
                          {formatNumber(provider.totalStudents)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pending Providers */}
          <section className="glass-card flex flex-col rounded-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-4">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                Yêu cầu duyệt giảng viên
              </h3>
              {tablesData.pendingProviders?.length > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-error text-xs font-bold text-white">
                  {tablesData.pendingProviders.length}
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant">
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                      Họ tên / Email
                    </th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">
                      Nghề nghiệp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {loading && tablesData.pendingProviders.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 w-32 rounded bg-surface-container mb-2"></div>
                          <div className="h-3 w-40 rounded bg-surface-container"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 rounded bg-surface-container"></div>
                        </td>
                      </tr>
                    ))
                  ) : tablesData.pendingProviders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-8 text-center text-body-sm text-on-surface-variant"
                      >
                        Không có yêu cầu nào đang chờ.
                      </td>
                    </tr>
                  ) : (
                    tablesData.pendingProviders.map((provider) => (
                      <tr
                        key={provider._id}
                        className="transition-colors hover:bg-primary-container/5"
                      >
                        <td className="px-6 py-4">
                          <p className="font-label-md text-label-md font-semibold text-on-surface">
                            {provider.provider_name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {provider.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-body-sm text-on-surface-variant">
                          {provider.career || "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
