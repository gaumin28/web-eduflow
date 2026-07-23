const STORAGE_KEY = "recentlyViewedCourses";
const MAX_ITEMS = 10;

/**
 * Lưu khóa học vào danh sách "đã xem gần đây" trong localStorage.
 * Deduplicate theo _id, giữ tối đa MAX_ITEMS, mới nhất lên đầu.
 */
export function saveRecentlyViewed(course) {
  if (!course || !course._id) return;

  const item = {
    _id: course._id,
    course_title: course.course_title || course.title || "",
    image_url: course.image_url || "",
    price: course.price ?? 0,
    price_promotion: course.price_promotion ?? null,
    provider: course.provider || course.provider_name || "",
    viewedAt: Date.now(),
  };

  try {
    const existing = getRecentlyViewed();
    // Remove duplicate
    const filtered = existing.filter((c) => c._id !== item._id);
    // Prepend new item
    const updated = [item, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage not available — silently fail
  }
}

/**
 * Đọc danh sách khóa học đã xem gần đây từ localStorage.
 */
export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Xóa toàn bộ danh sách đã xem.
 */
export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
