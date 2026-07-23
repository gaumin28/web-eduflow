import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../../contexts/WishlistContext";
import { getWishlist } from "../../services/wishlistService";
import { getCourses } from "../../services/courseService";
import { useCart } from "../../contexts/CartContext";

const customStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.5);
  }
`;

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});
const fmt = (v) => (v === 0 ? "Miễn phí" : currencyFormatter.format(v));

function WishlistCourseCard({ course }) {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div
        className="h-44 overflow-hidden relative bg-surface-container cursor-pointer shrink-0"
        onClick={() => navigate(`/course/detail/${course._id}`)}
      >
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">
              play_circle
            </span>
          </div>
        )}
        {/* Remove from wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(course._id);
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow hover:scale-110 transition-transform"
          title="Xóa khỏi yêu thích"
        >
          <span
            className="material-symbols-outlined text-[18px] text-error"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h4
          className="font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
          onClick={() => navigate(`/course/detail/${course._id}`)}
        >
          {course.title}
        </h4>

        <p className="text-[12px] text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">person</span>
          {course.provider}
        </p>

        <div className="mt-auto pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-primary text-[15px]">
              {fmt(course.price)}
            </span>
            {course.originalPrice && (
              <span className="ml-1 text-[12px] line-through text-on-surface-variant">
                {fmt(course.originalPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              addToCart({
                _id: course._id,
                course_title: course.title,
                image_url: course.thumbnail,
                price: course.price,
                price_promotion: null,
                provider: course.provider,
              })
            }
            className="flex items-center gap-1 bg-primary text-on-primary text-[12px] font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="material-symbols-outlined text-[14px]">
              add_shopping_cart
            </span>
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

function RelatedCourseCard({ course }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(course._id);

  return (
    <div
      className="glass-card rounded-xl overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/course/detail/${course._id}`)}
    >
      <div className="h-36 overflow-hidden bg-surface-container relative">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.course_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
              play_circle
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(course._id);
          }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 shadow hover:scale-110 transition-transform"
        >
          <span
            className="material-symbols-outlined text-[15px]"
            style={{
              fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
              color: wishlisted ? "#e53935" : "#666",
            }}
          >
            favorite
          </span>
        </button>
      </div>
      <div className="p-3 space-y-1">
        <h5 className="font-semibold text-on-surface text-[13px] line-clamp-2 group-hover:text-primary transition-colors">
          {course.course_title}
        </h5>
        <p className="text-[11px] text-on-surface-variant">{course.provider}</p>
        <p className="text-[13px] font-bold text-primary">
          {fmt(course.price_promotion ?? course.price ?? 0)}
        </p>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { wishlistIds, loading: wishlistLoading } = useWishlist();
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [related, setRelated] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch full wishlist details whenever wishlistIds changes
  useEffect(() => {
    if (wishlistLoading) return;
    getWishlist()
      .then((res) => setWishlistCourses(res.data.data))
      .catch(() => setWishlistCourses([]))
      .finally(() => setLoadingCourses(false));
  }, [wishlistIds, wishlistLoading]);

  // Fetch related courses (latest courses, exclude already in wishlist)
  useEffect(() => {
    getCourses({ limit: 8 })
      .then((res) => {
        const all = res.data.data ?? [];
        const filtered = all.filter((c) => !wishlistIds.has(String(c._id)));
        setRelated(filtered.slice(0, 6));
      })
      .catch(() => setRelated([]));
  }, [wishlistIds]);

  return (
    <div className="min-h-screen bg-surface">
      <style>{customStyles}</style>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16 space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/user/dashboard"
                className="text-primary hover:underline text-body-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Bảng điều khiển
              </Link>
            </div>
            <h1 className="font-display font-bold text-headline-lg text-on-surface flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[28px] text-error"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              Khóa học yêu thích
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">
              {loadingCourses
                ? "Đang tải…"
                : `${wishlistCourses.length} khóa học đã lưu`}
            </p>
          </div>
        </header>

        {/* ── Wishlist grid ─────────────────────────────────────────── */}
        {loadingCourses && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-surface-container" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-surface-container rounded w-3/4" />
                  <div className="h-3 bg-surface-container rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingCourses && wishlistCourses.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4">
            <span
              className="material-symbols-outlined text-5xl text-on-surface-variant/30 block"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              favorite
            </span>
            <p className="font-bold text-on-surface text-headline-sm">
              Chưa có khóa học yêu thích nào
            </p>
            <p className="text-body-md text-on-surface-variant">
              Nhấn vào biểu tượng ❤ trên bất kỳ khóa học nào để lưu vào đây.
            </p>
            <Link
              to="/all-courses"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold text-body-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">
                explore
              </span>
              Khám phá khóa học
            </Link>
          </div>
        )}

        {!loadingCourses && wishlistCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistCourses.map((course) => (
              <WishlistCourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* ── Related courses ──────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-headline-md text-on-surface">
                Khóa học liên quan
              </h2>
              <Link
                to="/all-courses"
                className="text-primary text-body-sm hover:underline flex items-center gap-1"
              >
                Xem tất cả
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((course) => (
                <RelatedCourseCard key={course._id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
