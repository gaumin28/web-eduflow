import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
} from "../../services/adminCategoryService";
import CategoryFormModal from "../../components/admin/CategoryFormModal";
import Pagination from "../../components/ui/Pagination";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
const LIMIT_OPTIONS = [5, 10, 20];

const ICON_MAP = {
  web: "public",
  data: "analytics",
  mobile: "smartphone",
  language: "code",
  game: "sports_esports",
  design: "palette",
  business: "business_center",
  marketing: "campaign",
  music: "music_note",
  photo: "photo_camera",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Toggle Switch Component — nút gạt bật/tắt trạng thái
 */
function ToggleSwitch({ checked, disabled, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-outline-variant"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AdminCategoriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Toggle loading per category
  const [toggleLoading, setToggleLoading] = useState("");

  // ── Build query params ──────────────────────────────────
  const queryParams = useMemo(() => {
    const params = { page, limit, search: debouncedSearch.trim() };
    if (status === "active") params.isActive = "true";
    if (status === "inactive") params.isActive = "false";
    return params;
  }, [debouncedSearch, limit, page, status]);

  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-categories", queryParams],
    queryFn: async () => getAdminCategories(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const categories = data?.data || [];
  const pagination = data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };
  const loading = isLoading || isFetching;
  const displayError =
    error || queryError?.response?.data?.message || queryError?.message || "";

  // ── Debounce search ──────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-clear success message
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  // ── Handlers ─────────────────────────────────────────────
  const handleStatusFilterChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setError("");
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, data);
        setSuccessMsg("Cập nhật danh mục thành công!");
      } else {
        await createCategory(data);
        setSuccessMsg("Tạo danh mục mới thành công!");
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Không thể ${editingCategory ? "cập nhật" : "tạo"} danh mục.`,
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${cat.cate_name}"?`,
    );
    if (!confirmed) return;

    setError("");
    try {
      await deleteCategory(cat._id);
      setSuccessMsg("Xóa danh mục thành công!");
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa danh mục.");
    }
  };

  const handleToggleStatus = async (cat) => {
    const nextStatus = !cat.isActive;
    setToggleLoading(cat._id);
    setError("");
    try {
      await updateCategoryStatus(cat._id, nextStatus);
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái.");
    } finally {
      setToggleLoading("");
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-[24px]">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-container/15 px-3 py-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">
              category
            </span>
            <span className="font-label-sm text-label-sm uppercase">
              Category Management
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Quản Lý Danh Mục
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Tìm kiếm, thêm mới, chỉnh sửa và quản lý trạng thái danh mục khóa
            học.
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
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm danh mục
          </button>
        </div>
      </section>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="text-body-sm">{successMsg}</p>
        </div>
      )}

      {/* Table Section */}
      <section className="glass-card rounded-xl">
        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 border-b border-outline-variant/30 p-5 lg:grid-cols-[1fr_180px_120px]">
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-body-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Tìm kiếm theo tên danh mục..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={status}
            onChange={handleStatusFilterChange}
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={limit}
            onChange={handleLimitChange}
          >
            {LIMIT_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item} / trang
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {displayError && (
          <div className="m-5 flex items-start gap-3 rounded-lg border border-error-container bg-error-container/40 p-4 text-on-error-container">
            <span className="material-symbols-outlined">error</span>
            <p className="text-body-sm">{displayError}</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                {[
                  "Danh mục",
                  "Icon Key",
                  "Số khóa học",
                  "Trạng thái",
                  "Ngày tạo",
                  "Thao tác",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-4 font-label-md text-label-md"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                Array.from({ length: limit }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-surface-container" />
                        <div className="h-4 w-28 rounded bg-surface-container" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-16 rounded bg-surface-container" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-10 rounded bg-surface-container" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-7 w-12 rounded-full bg-surface-container" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 rounded bg-surface-container" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-9 w-24 rounded bg-surface-container" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/15 text-primary">
                        <span className="material-symbols-outlined text-[32px]">
                          category
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">
                          Không tìm thấy danh mục
                        </h3>
                        <p className="mt-1 text-body-sm text-on-surface-variant">
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="transition-colors hover:bg-primary-container/5"
                  >
                    {/* Category name + icon */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/15 text-primary">
                          <span className="material-symbols-outlined">
                            {ICON_MAP[cat.icon_key] || "category"}
                          </span>
                        </div>
                        <span className="text-body-sm font-semibold text-on-surface">
                          {cat.cate_name}
                        </span>
                      </div>
                    </td>

                    {/* Icon Key */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-1 text-[12px] font-bold text-on-surface-variant">
                        {cat.icon_key}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                      {cat.quantity || 0}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={cat.isActive !== false}
                          disabled={toggleLoading === cat._id}
                          onChange={() => handleToggleStatus(cat)}
                        />
                        <span
                          className={`text-[12px] font-bold ${cat.isActive !== false ? "text-green-600" : "text-on-surface-variant"}`}
                        >
                          {cat.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                      {formatDate(cat.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="inline-flex items-center gap-1 rounded-lg bg-error px-3 py-2 text-label-md font-label-md text-white transition-opacity hover:opacity-90"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          disabled={loading}
          onPageChange={setPage}
        />
      </section>

      {/* Create/Edit Modal */}
      <CategoryFormModal
        open={modalOpen}
        category={editingCategory}
        loading={formLoading}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
