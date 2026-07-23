import { useEffect, useState } from "react";

const ICON_OPTIONS = [
  { value: "web", label: "Web Development", icon: "public" },
  { value: "data", label: "Data Science", icon: "analytics" },
  { value: "mobile", label: "Mobile Development", icon: "smartphone" },
  { value: "language", label: "Programming", icon: "code" },
  { value: "game", label: "Game Development", icon: "sports_esports" },
  { value: "design", label: "Design", icon: "palette" },
  { value: "business", label: "Business", icon: "business_center" },
  { value: "marketing", label: "Marketing", icon: "campaign" },
  { value: "music", label: "Music", icon: "music_note" },
  { value: "photo", label: "Photography", icon: "photo_camera" },
];

/**
 * CategoryFormModal — modal form dùng chung cho Create + Edit danh mục.
 *
 * Props:
 *   - open         : boolean
 *   - category     : object | null   (null = create mode, object = edit mode)
 *   - loading      : boolean
 *   - onClose      : () => void
 *   - onSubmit     : (data: { cate_name, icon_key }) => void
 */
export default function CategoryFormModal({
  open,
  category,
  loading,
  onClose,
  onSubmit,
}) {
  const isEdit = Boolean(category);
  const [cateName, setCateName] = useState("");
  const [iconKey, setIconKey] = useState("");
  const [errors, setErrors] = useState({});

  // Sync form when category changes (edit mode)
  useEffect(() => {
    if (category) {
      setCateName(category.cate_name || "");
      setIconKey(category.icon_key || "");
    } else {
      setCateName("");
      setIconKey("");
    }
    setErrors({});
  }, [category, open]);

  const validate = () => {
    const newErrors = {};
    if (!cateName.trim()) newErrors.cateName = "Tên danh mục là bắt buộc.";
    if (!iconKey) newErrors.iconKey = "Vui lòng chọn một icon.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ cate_name: cateName.trim(), icon_key: iconKey });
  };

  if (!open) return null;

  const selectedIcon = ICON_OPTIONS.find((opt) => opt.value === iconKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/35 p-margin-mobile backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/20">
              <span className="material-symbols-outlined text-primary">
                {isEdit ? "edit" : "add"}
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                {isEdit
                  ? "Cập nhật thông tin danh mục"
                  : "Điền thông tin để tạo danh mục"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Category Name */}
          <div>
            <label className="mb-2 block font-label-md text-label-md text-on-surface">
              Tên danh mục <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={cateName}
              onChange={(e) => setCateName(e.target.value)}
              placeholder="Ví dụ: Web Development"
              className={`w-full rounded-lg border px-4 py-3 text-body-sm outline-none transition-all ${
                errors.cateName
                  ? "border-error focus:ring-2 focus:ring-error/20"
                  : "border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
            />
            {errors.cateName && (
              <p className="mt-1 flex items-center gap-1 text-[12px] text-error">
                <span className="material-symbols-outlined text-[14px]">
                  error
                </span>
                {errors.cateName}
              </p>
            )}
          </div>

          {/* Icon Key */}
          <div>
            <label className="mb-2 block font-label-md text-label-md text-on-surface">
              Icon danh mục <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIconKey(opt.value)}
                  title={opt.label}
                  className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                    iconKey === opt.value
                      ? "bg-primary-container/20 text-primary ring-2 ring-primary/30"
                      : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {opt.icon}
                  </span>
                  <span className="text-[10px] leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
            {errors.iconKey && (
              <p className="mt-1 flex items-center gap-1 text-[12px] text-error">
                <span className="material-symbols-outlined text-[14px]">
                  error
                </span>
                {errors.iconKey}
              </p>
            )}
            {selectedIcon && (
              <p className="mt-2 flex items-center gap-2 text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  {selectedIcon.icon}
                </span>
                Đã chọn: <strong>{selectedIcon.label}</strong>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-outline-variant px-5 py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
              )}
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
