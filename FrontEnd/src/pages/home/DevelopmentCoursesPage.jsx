import { useState } from "react";
import { Link } from "react-router-dom";

const ratingOptions = [
  { id: "rating-4", label: "4.0 & Up", stars: 4 },
  { id: "rating-3", label: "3.0 & Up", stars: 3 },
];

const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const priceOptions = ["Paid", "Free"];
const durationOptions = ["0-3 Hours", "3-7 Hours", "7+ Hours"];

const courses = [
  {
    id: "dev-1",
    title: "The Complete JavaScript Bootcamp 2026",
    instructor: "Jonas Schmedtmann",
    rating: "4.8",
    stars: 4.8,
    reviews: "(12,431)",
    price: "599,000d",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dev-2",
    title: "React and TypeScript Masterclass",
    instructor: "Maximilian Schwarzmuller",
    rating: "4.7",
    stars: 4.7,
    reviews: "(9,205)",
    price: "549,000d",
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dev-3",
    title: "Node.js API Design and Production",
    instructor: "Mosh Hamedani",
    rating: "4.6",
    stars: 4.6,
    reviews: "(6,982)",
    price: "499,000d",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dev-4",
    title: "Fullstack Next.js: From Zero to Deployment",
    instructor: "Lee Robinson",
    rating: "4.9",
    stars: 4.9,
    reviews: "(4,311)",
    price: "699,000d",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dev-5",
    title: "Python for Backend and Automation",
    instructor: "Angela Yu",
    rating: "4.7",
    stars: 4.7,
    reviews: "(8,120)",
    price: "459,000d",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dev-6",
    title: "System Design Interview for Developers",
    instructor: "Alex Xu",
    rating: "4.8",
    stars: 4.8,
    reviews: "(3,902)",
    price: "799,000d",
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  },
];

function StarRow({ stars }) {
  const wholeStars = Math.floor(stars);
  const hasHalf = stars % 1 !== 0;

  return (
    <div className="flex text-yellow-500">
      {Array.from({ length: wholeStars }).map((_, idx) => (
        <span
          key={`whole-${idx}`}
          className="material-symbols-outlined text-[14px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
      {hasHalf ? (
        <span
          className="material-symbols-outlined text-[14px]"
          style={{ fontVariationSettings: "'FILL' 0.5" }}
        >
          star_half
        </span>
      ) : null}
      {Array.from({ length: 5 - wholeStars - (hasHalf ? 1 : 0) }).map(
        (_, idx) => (
          <span
            key={`empty-${idx}`}
            className="material-symbols-outlined text-[14px]"
          >
            star
          </span>
        ),
      )}
    </div>
  );
}

export default function DevelopmentCoursesPage() {
  const [openFilters, setOpenFilters] = useState({
    rating: true,
    level: true,
    price: true,
    duration: true,
  });

  const toggleFilter = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm h-16">
        <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-full max-w-7xl mx-auto">
          <div className="flex items-center gap-stack-lg">
            <span className="font-headline-md text-headline-md font-bold text-primary">
              EduFlow
            </span>
            <nav className="hidden md:flex items-center gap-gutter">
              <Link
                className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1"
                to="#"
              >
                Browse
              </Link>
              <Link
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200"
                to="#"
              >
                My Courses
              </Link>
              <Link
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200"
                to="#"
              >
                Instructors
              </Link>
              <Link
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200"
                to="#"
              >
                Resources
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-stack-md">
            <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none"
                placeholder="Search courses..."
                type="text"
              />
            </div>

            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              shopping_cart
            </button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              notifications
            </button>
            <button className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary px-4 py-2">
              Sign In
            </button>
            <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-stack-lg">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <nav className="flex items-center gap-2 mb-stack-md">
            <Link
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary"
              to="#"
            >
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px] text-outline">
              chevron_right
            </span>
            <span className="font-label-md text-label-md text-primary">
              Development
            </span>
          </nav>

          <section className="mb-stack-lg p-stack-lg rounded-xl bg-linear-to-br from-primary-container to-secondary-container text-on-primary-container relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h1 className="font-display text-display mb-4">Development</h1>
              <p className="font-body-lg text-body-lg opacity-90 leading-relaxed">
                Master the art of building robust, scalable applications. From
                web development to machine learning, our expert-led courses
                provide hands-on experience with the industry&apos;s most
                in-demand technologies.
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

          <div className="flex flex-col lg:flex-row gap-gutter">
            <aside className="w-full lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-stack-lg">
                <div>
                  <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-4">
                    Filters
                  </h3>

                  <div className="mb-6">
                    <button
                      onClick={() => toggleFilter("rating")}
                      className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
                    >
                      Rating
                      <span
                        className="material-symbols-outlined text-[18px] transition-transform"
                        style={{
                          transform: openFilters.rating
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        expand_more
                      </span>
                    </button>
                    {openFilters.rating ? (
                      <div className="space-y-2">
                        {ratingOptions.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                              type="checkbox"
                            />
                            <span className="flex items-center text-body-sm text-on-surface-variant group-hover:text-on-surface">
                              <span className="flex text-yellow-500 mr-2">
                                {Array.from({ length: option.stars }).map(
                                  (_, i) => (
                                    <span
                                      key={`${option.id}-${i}`}
                                      className="material-symbols-outlined text-[16px]"
                                      style={{
                                        fontVariationSettings: "'FILL' 1",
                                      }}
                                    >
                                      star
                                    </span>
                                  ),
                                )}
                                {Array.from({ length: 5 - option.stars }).map(
                                  (_, i) => (
                                    <span
                                      key={`${option.id}-empty-${i}`}
                                      className="material-symbols-outlined text-[16px]"
                                    >
                                      star
                                    </span>
                                  ),
                                )}
                              </span>
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <button
                      onClick={() => toggleFilter("level")}
                      className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
                    >
                      Level
                      <span
                        className="material-symbols-outlined text-[18px] transition-transform"
                        style={{
                          transform: openFilters.level
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        expand_more
                      </span>
                    </button>
                    {openFilters.level ? (
                      <div className="space-y-2">
                        {levelOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              className="w-4 h-4 rounded border-outline-variant text-primary"
                              type="checkbox"
                            />
                            <span className="text-body-sm text-on-surface-variant">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <button
                      onClick={() => toggleFilter("price")}
                      className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
                    >
                      Price
                      <span
                        className="material-symbols-outlined text-[18px] transition-transform"
                        style={{
                          transform: openFilters.price
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        expand_more
                      </span>
                    </button>
                    {openFilters.price ? (
                      <div className="space-y-2">
                        {priceOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              className="w-4 h-4 border-outline-variant text-primary"
                              name="price"
                              type="radio"
                            />
                            <span className="text-body-sm text-on-surface-variant">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <button
                      onClick={() => toggleFilter("duration")}
                      className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
                    >
                      Duration
                      <span
                        className="material-symbols-outlined text-[18px] transition-transform"
                        style={{
                          transform: openFilters.duration
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        expand_more
                      </span>
                    </button>
                    {openFilters.duration ? (
                      <div className="space-y-2">
                        {durationOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              className="w-4 h-4 rounded border-outline-variant text-primary"
                              type="checkbox"
                            />
                            <span className="text-body-sm text-on-surface-variant">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <span className="text-body-sm text-on-surface-variant">
                  Showing 1,248 results for{" "}
                  <span className="text-on-surface font-semibold">
                    "Development"
                  </span>
                </span>

                <div className="hidden md:flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-outline-variant/30 ml-4 flex-1 max-w-xs">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search within results..."
                    className="bg-transparent border-none focus:ring-0 text-body-sm w-full p-0 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-on-surface-variant">
                    Sort by:
                  </span>
                  <select className="bg-transparent border-none focus:ring-0 text-body-sm font-semibold cursor-pointer outline-none">
                    <option>Most Relevant</option>
                    <option>Newest</option>
                    <option>Highest Rated</option>
                    <option>Price: Low to High</option>
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

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-video">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={course.title}
                        src={course.image}
                      />
                      {course.badge ? (
                        <div className="absolute top-3 right-3 glass-panel px-2 py-1 rounded text-primary font-label-sm text-label-sm shadow-sm">
                          {course.badge}
                        </div>
                      ) : null}
                    </div>

                    <div className="p-4 space-y-3">
                      <h3 className="font-headline-md text-headline-md leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        {course.instructor}
                      </p>

                      <div className="flex items-center gap-1">
                        <span className="font-label-md text-label-md text-on-surface">
                          {course.rating}
                        </span>
                        <StarRow stars={course.stars} />
                        <span className="text-body-sm text-on-surface-variant">
                          {course.reviews}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-headline-md text-headline-md text-on-surface">
                          {course.price}
                        </span>
                        <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">
                          favorite
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_left
                  </span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-label-md">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary-container/10 transition-colors font-label-md">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary-container/10 transition-colors font-label-md">
                  3
                </button>
                <span className="text-on-surface-variant px-2">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary-container/10 transition-colors font-label-md">
                  42
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-stack-lg bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto gap-stack-md">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              EduFlow
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Empowering learners worldwide.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-gutter">
            <Link
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
              to="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
              to="#"
            >
              Terms of Service
            </Link>
            <Link
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
              to="#"
            >
              Help Center
            </Link>
            <Link
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
              to="#"
            >
              Contact Us
            </Link>
            <Link
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
              to="#"
            >
              Careers
            </Link>
          </nav>

          <span className="font-body-sm text-body-sm text-secondary-fixed-dim md:text-on-surface-variant opacity-80">
            Copyright 2024 EduFlow Inc. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
