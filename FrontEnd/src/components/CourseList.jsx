import CourseCard from "./CourseCard";
/**
 * Skeleton card shown while courses are loading.
 */
function CourseCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-video bg-surface-container-high shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-surface-container-high rounded w-3/4 shimmer" />
        <div className="h-4 bg-surface-container-high rounded w-1/2 shimmer" />
        <div className="h-4 bg-surface-container-high rounded w-2/3 shimmer" />
        <div className="flex justify-between pt-2">
          <div className="h-6 bg-surface-container-high rounded w-20 shimmer" />
          <div className="h-6 w-6 bg-surface-container-high rounded-full shimmer" />
        </div>
      </div>
    </div>
  );
}
/**
 * Pagination — renders page buttons with ellipsis.
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    pages.push(1);
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    if (rangeStart > 2) pages.push("...");
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    if (rangeEnd < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary-container/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[20px]">
          chevron_left
        </span>
      </button>
      {getPageNumbers().map((page, idx) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="text-on-surface-variant px-2"
            >
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-label-md transition-colors ${
              page === currentPage
                ? "bg-primary text-on-primary"
                : "border border-outline-variant hover:bg-primary-container/10"
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary-container/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[20px]">
          chevron_right
        </span>
      </button>
    </div>
  );
}
const SORT_OPTIONS = [
  { value: "", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];
/**
 * CourseList — grid of CourseCards with search, sort, loading skeleton, and pagination.
 *
 * Props:
 *   - courses       : array of course objects from API
 *   - loading       : boolean
 *   - total         : total number of matching courses
 *   - currentPage   : current page number
 *   - totalPages    : total pages
 *   - onPageChange  : (pageNumber) => void
 *   - categoryName  : string
 *   - keyword       : string (search keyword from URL)
 *   - searchValue   : string (local input value for debounce)
 *   - onSearchChange: (value) => void (fires on every keystroke)
 *   - sortValue     : string (current sort param)
 *   - onSortChange  : (value) => void
 */
export default function CourseList({
  courses,
  loading,
  total,
  currentPage,
  totalPages,
  onPageChange,
  categoryName,
  keyword,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
}) {
  const activeLabel = keyword || categoryName;
  return (
    <div className="flex-1">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <span className="text-body-sm text-on-surface-variant">
          Showing{" "}
          <span className="text-on-surface font-semibold">
            {total.toLocaleString("en-US")}
          </span>{" "}
          results
          {activeLabel ? (
            <>
              {" "}
              for{" "}
              <span className="text-on-surface font-semibold">
                &ldquo;{activeLabel}&rdquo;
              </span>
            </>
          ) : null}
        </span>
        {/* Search within results */}
        <div className="hidden md:flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-outline-variant/30 ml-4 flex-1 max-w-xs">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">
            search
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-body-sm w-full p-0 outline-none"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="material-symbols-outlined text-on-surface-variant text-[18px] hover:text-primary transition-colors ml-1"
            >
              close
            </button>
          )}
        </div>
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-on-surface-variant">Sort by:</span>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-body-sm font-semibold cursor-pointer outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden ml-2">
            <button
              className="p-1.5 bg-primary text-on-primary flex items-center justify-center"
              aria-label="Grid View"
            >
              <span className="material-symbols-outlined text-[20px]">
                grid_view
              </span>
            </button>
            <button
              className="p-1.5 hover:bg-primary-container/10 text-on-surface-variant flex items-center justify-center"
              aria-label="List View"
            >
              <span className="material-symbols-outlined text-[20px]">
                format_list_bulleted
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile search (visible on small screens) */}
      <div className="flex md:hidden items-center bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant/30 mb-4">
        <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">
          search
        </span>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-body-sm w-full p-0 outline-none"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange("")}
            className="material-symbols-outlined text-on-surface-variant text-[18px] hover:text-primary transition-colors ml-1"
          >
            close
          </button>
        )}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CourseCardSkeleton key={`skel-${idx}`} />
            ))
          : courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
      </div>
      {/* Empty state */}
      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-[64px] text-outline mb-4">
            search_off
          </span>
          <p className="text-body-lg text-on-surface-variant">
            Không tìm thấy khóa học nào phù hợp.
          </p>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
          </p>
        </div>
      )}
      {/* Pagination */}
      {!loading && courses.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
