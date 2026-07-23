import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../../services/courseService";
import { getCategories } from "../../services/homeService";
import FilterSidebar from "../../components/FilterSidebar";
import CourseList from "../../components/CourseList";

const ITEMS_PER_PAGE = 12;
const DEBOUNCE_MS = 500;

export default function CourseSearchPage() {
  // ── URL search params as single source of truth ──────────
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL
  const category = searchParams.get("category") || "";
  const q = searchParams.get("q") || "";
  const price = searchParams.get("price") || null;
  const rating = searchParams.get("rating") || null;
  const level = searchParams.get("level") || null;
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = Number(searchParams.get("page")) || 1;

  // ── Local search input state (for debounce) ───────────────
  const [draftSearch, setDraftSearch] = useState(q);
  const [isTypingSearch, setIsTypingSearch] = useState(false);
  const debounceRef = useRef(null);
  const searchInput = isTypingSearch ? draftSearch : q;

  // Debounced update of URL param `q`
  const handleSearchChange = (value) => {
    setIsTypingSearch(true);
    setDraftSearch(value);

    // Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value.trim()) {
          next.set("q", value.trim());
        } else {
          next.delete("q");
        }
        next.delete("page"); // reset to page 1
        return next;
      });
      setIsTypingSearch(false);
    }, DEBOUNCE_MS);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ── Fetch categories ──────────────────────────────────────
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data: res } = await getCategories();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // cache 5 minutes
  });
  const categories = categoriesData ?? [];

  // ── Fetch courses (URL params are the source of truth) ────
  const { data, isLoading } = useQuery({
    queryKey: [
      "courses",
      q,
      category,
      price,
      minPrice,
      maxPrice,
      rating,
      level,
      sort,
      page,
    ],
    queryFn: async () => {
      const { data: res } = await getCourses({
        category: category || undefined,
        q: q || undefined,
        price: price || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        rating: rating || undefined,
        level: level || undefined,
        sort: sort || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      });
      return res;
    },
    placeholderData: (previousData) => previousData,
  });

  const courses = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  // ── Update URL params ─────────────────────────────────────
  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete("page"); // reset to page 1 on filter change
      return next;
    });
  };

  const handleSortChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set("sort", value);
      } else {
        next.delete("sort");
      }
      next.delete("page"); // reset to page 1
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage > 1) {
        next.set("page", String(newPage));
      } else {
        next.delete("page");
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Filters object for sidebar ────────────────────────────
  const filters = { category, price, minPrice, maxPrice, rating, level };

  // ── Display title ─────────────────────────────────────────
  const pageTitle = q ? `Kết quả cho "${q}"` : category || "All Courses";

  return (
    <main className="pt-24 pb-stack-lg min-h-screen">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-stack-md">
          <Link
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary"
            to="/"
          >
            Home
          </Link>
          <span className="material-symbols-outlined text-[16px] text-outline">
            chevron_right
          </span>
          <span className="font-label-md text-label-md text-primary">
            {pageTitle}
          </span>
        </nav>

        {/* Category Header */}
        <section className="mb-stack-lg p-stack-lg rounded-xl bg-linear-to-br from-primary-container to-secondary-container text-on-primary-container relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-display text-display mb-4">{pageTitle}</h1>
            <p className="font-body-lg text-body-lg opacity-90 leading-relaxed">
              Master the art of building robust, scalable applications. From web
              development to machine learning, our expert-led courses provide
              hands-on experience with the industry&apos;s most in-demand
              technologies.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
            <span
              className="material-symbols-outlined text-[240px]"
              style={{ fontVariationSettings: "'wght' 100" }}
            >
              code
            </span>
          </div>
        </section>

        {/* Content: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-gutter">
          <FilterSidebar
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
          />
          <CourseList
            courses={courses}
            loading={isLoading}
            total={total}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            categoryName={category}
            keyword={q}
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            sortValue={sort}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </main>
  );
}
