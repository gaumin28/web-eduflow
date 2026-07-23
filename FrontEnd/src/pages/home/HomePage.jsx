import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCategories,
  getFeatureCourses,
  getProviders,
} from "../../services/homeService";
import { getRecentlyViewed } from "../../services/viewHistoryService";
import { useCart } from "../../contexts/CartContext";
import socket from "../../socket/socket";
import { useAuth } from "../../contexts/AuthContext";

// Map icon_key from DB to Material Symbol names
const ICON_MAP = {
  web: "public",
  data: "analytics",
  mobile: "smartphone",
  language: "language",
  game: "sports_esports",
  programming: "code",
  design: "brush",
  marketing: "campaign",
  business: "business_center",
  ai: "smart_toy",
  network: "router",
  "cyber security": "security",
};
// Rotating bg colors for category small cards
const CATEGORY_BG = [
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-surface-container-high text-on-surface",
  "bg-primary-container/30 text-primary",
];

function formatPrice(price) {
  if (price === 0) return "Miễn phí";
  if (price == null) return "Chưa cập nhật";
  return Number(price).toLocaleString("vi-VN") + "₫";
}

// Skeleton loaders
function CourseSkeleton() {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col animate-pulse">
      <div className="aspect-video bg-surface-container" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-surface-container rounded w-3/4" />
        <div className="h-3 bg-surface-container rounded w-1/2" />
        <div className="h-5 bg-surface-container rounded w-1/4 mt-auto" />
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="rounded-3xl h-47 bg-surface-container animate-pulse" />
  );
}

function ProviderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface border border-outline-variant/30 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-surface-container" />
      <div className="h-4 bg-surface-container rounded w-24" />
      <div className="h-3 bg-surface-container rounded w-16" />
    </div>
  );
}


export default function HomePage() {
  const mainRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [providers, setProviders] = useState([]);
  const [historyCourses, setHistoryCourses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingProv, setLoadingProv] = useState(true);

  useEffect(() => {

        socket.on("connect", () => {
            console.log(socket.id);
        });

  }, [socket]);

  const handleSearch = () => {
    const keyword = searchKeyword.trim();
    if (keyword) {
      navigate(`/all-courses?q=${encodeURIComponent(keyword)}`);
      return;
    }
    navigate("/all-courses");
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.data))
      .catch(console.error)
      .finally(() => setLoadingCat(false));

    getFeatureCourses()
      .then(({ data }) => setCourses(data.data))
      .catch(console.error)
      .finally(() => setLoadingCourse(false));

    getProviders()
      .then(({ data }) => setProviders(data.data))
      .catch(console.error)
      .finally(() => setLoadingProv(false));

    getRecentlyViewed()
      .then(({ data }) => setHistoryCourses(data.data))
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 },
    );
    const sections = container.querySelectorAll("section");
    sections.forEach((section) => {
      section.classList.add(
        "transition-all",
        "duration-1000",
        "opacity-0",
        "translate-y-8",
      );
      observer.observe(section);
    });

    // Hero is already in view
    const hero = container.querySelector("section");
    if (hero) {
      hero.classList.remove("opacity-0", "translate-y-8");
      hero.classList.add("opacity-100", "translate-y-0");
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md">
      <div ref={mainRef} className="pt-16">
        {/* ── Hero Section ── */}
        <section className="relative min-h-217.5 flex items-center justify-center hero-gradient px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="max-w-4xl w-full text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-bounce">
              <span
                className="material-symbols-outlined text-primary text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span className="font-label-sm text-label-sm text-primary tracking-wide uppercase">
                Hơn 2 triệu học viên tin tưởng
              </span>
            </div>

            <h1 className="font-display text-display mb-8 leading-[1.1]">
              Khai phá tiềm năng cùng các khóa học từ{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-tertiary">
                Chuyên gia
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 opacity-90">
              Làm chủ các kỹ năng mới từ những giảng viên hàng đầu thế giới. Chương trình học linh hoạt được thiết kế để giúp bạn đạt được mục tiêu nghề nghiệp và đam mê sáng tạo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto glass-card p-2 rounded-2xl shadow-xl">
              <div className="flex items-center flex-1 w-full px-4 gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">
                  search
                </span>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-body-md py-3 outline-none"
                  placeholder="Bạn muốn học gì hôm nay?"
                  type="text"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-label-md text-label-md rounded-xl shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Khám phá ngay
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60">
              <span className="font-label-md flex items-center gap-2 italic">
                Được tin dùng bởi
              </span>
              <span className="font-headline-md font-extrabold tracking-tighter">
                CLOUDSTRAT
              </span>
              <span className="font-headline-md font-extrabold tracking-tighter">
                NEXUS_AI
              </span>
              <span className="font-headline-md font-extrabold tracking-tighter">
                VANTAGE
              </span>
            </div>
          </div>
        </section>

        {/* ── Categories Bento Grid ── */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-2">
                Khám phá Danh mục Phổ biến
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Lộ trình được cá nhân hóa cho sự phát triển của bạn.
              </p>
            </div>
            <Link
              className="text-primary font-label-md hover:underline flex items-center gap-1 group"
              to="/courses/search"
            >
              Xem tất cả{" "}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* First category — large featured card */}
            {loadingCat ? (
              <div className="md:col-span-2 md:row-span-2 rounded-3xl h-100 bg-surface-container animate-pulse" />
            ) : categories[0] ? (
              <Link
                to={`/all-courses?category=${encodeURIComponent(categories[0].cate_name)}`}
                className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl h-100 block"
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxGqrFq_Mfu9T8YiROyyrbmtZm-_Wj7hc5oYF11sFeWzJPyiKLsP32MjnSGoh2gh3AmJRZ1H3QTD7jig8nJX-M8nviNPQ250dVTn4i49l2YYQ3GHMIysMY7kL6oNDmrRysoeedKE7drmo5nGsIE5GgZuEzHrBprufhH2wqQZpf9OJt9hBFr-27W8SLATM1h8GUVnVTWpoDlXiDHwkQ4wf8jKUYPettxSZ4YE4SrwMPY0HfAjbAQP-Tr4ImqJFEn4050Qtddr9Yk_c"
                  alt={categories[0].cate_name}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 inline-block uppercase">
                    {categories[0].quantity}+ Khóa học
                  </span>
                  <h3 className="font-headline-lg text-headline-lg mb-2">
                    {categories[0].cate_name}
                  </h3>
                </div>
              </Link>
            ) : null}

            {/* Remaining categories — small cards */}
            {loadingCat
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CategorySkeleton key={i} />
                ))
              : categories.slice(1).map((cat, i) => {
                  const iconKeyMatch = Object.keys(ICON_MAP).find(k => cat.cate_name.toLowerCase().includes(k));
                  const iconName = iconKeyMatch ? ICON_MAP[iconKeyMatch] : (ICON_MAP[cat.icon_key] ?? "school");
                  
                  return (
                  <Link
                    key={cat._id}
                    to={`/all-courses?category=${encodeURIComponent(cat.cate_name)}`}
                    className={`group relative overflow-hidden rounded-3xl h-47 block ${CATEGORY_BG[i % CATEGORY_BG.length]}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="material-symbols-outlined text-[120px]">
                        {iconName}
                      </span>
                    </div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="font-headline-md text-headline-md mb-1">
                        {cat.cate_name}
                      </h3>
                      <p className="opacity-80 text-label-sm">
                        {cat.quantity} khóa học
                      </p>
                    </div>
                  </Link>
                )})}
          </div>
        </section>

        {/* ── Trending Courses ── */}
        <section className="py-stack-lg bg-surface-container-low">
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-headline-lg text-headline-lg mb-3">
                Khóa học Nổi bật
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Những khóa học được đánh giá cao nhất trong tháng.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {loadingCourse
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CourseSkeleton key={i} />
                  ))
                : courses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 hover:shadow-xl transition-all group flex flex-col"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={course.image_url}
                          alt={course.course_title}
                        />
                        {course.price_promotion !== null && (
                          <div className="absolute top-3 left-3 px-2 py-1 bg-error text-on-error rounded-lg font-label-sm text-[10px] tracking-wider uppercase">
                            Giảm giá
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <Link
                          to={`/course/detail/${course._id}`}
                          className="font-bold text-[16px] mb-2 hover:text-primary transition-colors"
                        >
                          {course.course_title}
                        </Link>
                        <p className="text-on-surface-variant font-body-sm mb-1">
                          {course.provider}
                        </p>
                        <p className="text-on-surface-variant/60 font-body-sm mb-4 text-[12px]">
                          {course.students.toLocaleString()} học viên
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <span className="font-headline-md text-[18px] text-primary">
                              {course.price_promotion !== null
                                ? formatPrice(course.price_promotion)
                                : formatPrice(course.price)}
                            </span>
                            {course.price_promotion !== null && (
                              <span className="ml-2 text-[12px] text-on-surface-variant line-through">
                                {formatPrice(course.price)}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(course)}
                            className="p-2 bg-surface-container-highest rounded-full hover:bg-primary hover:text-white transition-colors"
                            aria-label={`Add ${course.course_title} to cart`}
                          >
                            <span className="material-symbols-outlined">
                              add_shopping_cart
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Khóa học đã xem ── */}
        {historyCourses.length > 0 && (
          <section className="py-stack-lg">
            <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-headline-lg text-headline-lg mb-3">
                  Khóa học đã xem
                </h2>
                <p className="font-body-md text-on-surface-variant">
                  Tiếp tục hành trình học tập của bạn.
                </p>
              </div>

              <div className="flex overflow-x-auto gap-gutter pb-4 snap-x snap-mandatory hide-scrollbar">
                {historyCourses.map((course) => (
                  <div
                    key={course._id}
                    className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 hover:shadow-xl transition-all group flex flex-col snap-start shrink-0"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={course.image_url}
                        alt={course.course_title}
                      />
                      {course.price_promotion != null && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-error text-on-error rounded-lg font-label-sm text-[10px] tracking-wider uppercase">
                          Giảm giá
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <Link
                        to={`/course/detail/${course._id}`}
                        className="font-bold text-[16px] mb-2 hover:text-primary transition-colors line-clamp-2"
                      >
                        {course.course_title}
                      </Link>
                      <p className="text-on-surface-variant font-body-sm mb-1">
                        {course.provider}
                      </p>
                      <p className="text-on-surface-variant/60 font-body-sm mb-4 text-[12px]">
                        {course.students.toLocaleString()} học viên
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="font-headline-md text-[18px] text-primary">
                            {course.price_promotion != null
                              ? formatPrice(course.price_promotion)
                              : formatPrice(course.price)}
                          </span>
                          {course.price_promotion != null && (
                            <span className="ml-2 text-[12px] text-on-surface-variant line-through">
                              {formatPrice(course.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Providers / Instructors ── */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-2">
                Gặp gỡ Giảng viên
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Học từ những chuyên gia hàng đầu trong ngành.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-gutter">
            {loadingProv
              ? Array.from({ length: 5 }).map((_, i) => (
                  <ProviderSkeleton key={i} />
                ))
              : providers.slice(0, 10).map((prov) => {
                  const providerImage = Array.isArray(prov.images)
                    ? prov.images[0]
                    : prov.images;

                  return (
                    <Link
                      key={prov._id}
                      to={`/courses-provider?providerId=${prov._id}`}
                      className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface border border-outline-variant/30 hover:shadow-md hover:border-primary/30 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center ring-2 ring-primary/10 group-hover:ring-primary/40 transition-all">
                        {providerImage ? (
                          <img
                            src={providerImage}
                            alt={prov.provider_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-[32px]">
                            person
                          </span>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-label-md text-label-md text-on-surface line-clamp-2">
                          {prov.provider_name}
                        </p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 line-clamp-1">
                          {prov.career}
                        </p>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image side */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHjU2BZjfifAdbPFWwDY-kCGukHLKy_AgVQzSCFh20IdG2eZkWsbIpO92lTa9_3Q8Smlmb21e6AJzfnmLoNnxp526DYVrCW6XBkWd3cXW4bvQroqJf9ObRuhbgZ7NuGyvzEHux0L4pQnYpX2UQgH8sooW584JSqFmM6Qqusva3Tz9mcHZhO1nggVYjc-GqESFqXRSSO2PeySf7H8b24L95ICHiyLlWjiHjUyWMXlhw7sjElZseiYwqD0OQi8fbHGtd4rIQ5Hsab74"
                  alt="Professional woman learning with headphones"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-container/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-tertiary-container/20 rounded-full blur-2xl" />
              {/* Floating stat card */}
              <div className="absolute bottom-10 right-10 glass-card p-6 rounded-2xl shadow-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-[32px]">
                      workspace_premium
                    </span>
                  </div>
                  <div>
                    <p className="font-headline-md text-headline-md text-primary">
                      15,000+
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Học viên Đạt chứng chỉ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="lg:w-1/2">
              <h2 className="font-headline-lg text-headline-lg mb-6">
                Vì sao EduFlow là Lựa chọn Số 1 cho Học tập Trực tuyến
              </h2>
              <p className="font-body-md text-on-surface-variant mb-10">
                Chúng tôi tin vào chất lượng hơn số lượng. Nền tảng được tinh tuyển bởi các chuyên gia trong ngành, đảm bảo bạn học được những kỹ năng thực tiễn nhất cho thị trường hiện tại.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: "school",
                    title: "Giảng viên Tinh hoa",
                    desc: "Học hỏi từ các chuyên gia đang làm việc tại Google, Apple và Netflix.",
                  },
                  {
                    icon: "all_inclusive",
                    title: "Truy cập Trọn đời",
                    desc: "Mua một lần, học mãi mãi. Nhận toàn bộ các bản cập nhật tương lai của khóa học hoàn toàn miễn phí.",
                  },
                  {
                    icon: "groups",
                    title: "Cộng đồng Riêng tư",
                    desc: "Tham gia các kênh Discord độc quyền để kết nối và học tập cùng nhau.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="mt-1 shrink-0 w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-[20px] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-on-surface-variant font-body-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-7xl mx-auto bg-inverse-surface rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px] rounded-full translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="font-display text-[40px] text-inverse-on-surface mb-6 leading-tight">
                  Sẵn sàng bắt đầu hành trình phát triển sự nghiệp?
                </h2>
                <p className="font-body-lg text-white/70 mb-8">
                  Gia nhập cùng 2 triệu học viên và kiến tạo tương lai của bạn ngay hôm nay với 7 ngày trải nghiệm miễn phí gói cao cấp.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5 text-center"
                  >
                    Tham gia miễn phí ngay
                  </Link>
                  <button className="px-8 py-4 border border-white/20 text-white rounded-xl font-label-md text-label-md hover:bg-white/10 transition-all">
                    Xem các gói cước
                  </button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="w-64 h-64 bg-linear-to-br from-primary to-tertiary rounded-[3rem] rotate-12 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-white text-[120px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    rocket_launch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}