import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPurchasedCourses } from "../../services/userService";

const customStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.5);
  }
`;

function CourseCard({ course }) {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-3xl overflow-hidden group flex flex-col">
      <div className="h-44 overflow-hidden relative bg-surface-container shrink-0">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
              play_circle
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <h4 className="font-bold text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h4>

        <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">person</span>
          {course.provider}
        </p>

        {(course.totalLectures > 0 || course.duration) && (
          <div className="flex items-center gap-3 text-[12px] text-on-surface-variant">
            {course.totalLectures > 0 && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">
                  menu_book
                </span>
                {course.totalLectures} bài học
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">
                  schedule
                </span>
                {course.duration}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-[11px] text-on-surface-variant">
            Đã mua:{" "}
            {course.paidAt
              ? new Date(course.paidAt).toLocaleDateString("vi-VN")
              : "—"}
          </span>
          <button
            type="button"
            onClick={() => navigate(`/learn/${course._id}`)}
            className="flex items-center gap-1 bg-primary text-on-primary text-[12px] font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[15px]">
              play_arrow
            </span>
            Học ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyCoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMyPurchasedCourses()
      .then((res) => setCourses(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.message ?? "Không thể tải khóa học"),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-surface">
      <style>{customStyles}</style>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16 space-y-stack-lg">
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
            <h1 className="font-display font-bold text-headline-lg text-on-surface">
              Khóa học của tôi
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">
              {loading ? "Đang tải…" : `${courses.length} khóa học đã mua`}
            </p>
          </div>

          {!loading && courses.length > 0 && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-outline-variant bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
              />
            </div>
          )}
        </header>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-surface-container" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-surface-container rounded w-3/4" />
                  <div className="h-3 bg-surface-container rounded w-1/2" />
                </div>
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

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 block">
              school
            </span>
            <p className="font-bold text-on-surface text-headline-sm">
              Bạn chưa mua khóa học nào
            </p>
            <p className="text-body-md text-on-surface-variant">
              Khám phá và mua khóa học để bắt đầu học tập!
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

        {/* No search results */}
        {!loading && !error && courses.length > 0 && filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant">
            Không tìm thấy khóa học phù hợp với &quot;{search}&quot;
          </div>
        )}

        {/* Course grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
