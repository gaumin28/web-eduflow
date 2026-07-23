import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseDetail } from "../../services/courseService";
import { recordView } from "../../services/viewHistoryService";
import BoxModalVideo from "./BoxModalShowVideo/BoxModalVideo";
import { useWishlist } from "../../contexts/WishlistContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({
      _id: course.course._id,
      course_title: course.course.course_title,
      image_url: course.course.image_url,
      price: course.course.price_promotion ?? course.course.price,
      price_promotion: course.course.price_promotion ?? null,
      provider: course.course.provider_name,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  //Hiệu ứng xuất hiện mượt mà khi scroll (Scroll Reveal)
  useEffect(() => {
    if (!course) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-12");
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    const hiddenElements = document.querySelectorAll(".scroll-reveal");

    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [course]);

  // Logic cho Accordion (Mở/Đóng nội dung khóa học)
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllExpanded =
    course?.sections?.length > 0 &&
    course.sections.every((section) => expandedSections[section._id]);

  const handleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedSections({});
    } else {
      setExpandedSections(
        Object.fromEntries(
          course.sections.map((section) => [section._id, true]),
        ),
      );
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseDetail(id);
        setCourse(res.data);
        try {
          await recordView(id);
        } catch (err) {
          console.error("Lỗi khi lưu lịch sử xem:", err);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course)
    return (
      <div className="mt-18 px-margin-desktop max-w-7xl mx-auto">
        {" "}
        Loading...
      </div>
    );

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen relative pt-[40px]">
      {/* Course Header (Phần Hero thông tin khóa học) */}
      <header className="bg-inverse-surface text-surface-container-lowest py-12">
        <div className="px-margin-desktop max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter relative">
          <div className="lg:col-span-8">
            {/* Breadcrumbs */}
            {/* <nav className="flex items-center gap-2 mb-6 text-on-surface-variant/80">
              <a className="font-label-md text-label-md hover:text-white transition-colors" href="#courses">Courses</a>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <a className="font-label-md text-label-md hover:text-white transition-colors" href="#design">Design</a>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="font-label-md text-label-md text-primary-fixed">Advanced UI/UX Principles</span>
            </nav> */}
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4 leading-tight">
              {course.course.course_title}
            </h1>
            <p className="font-body-lg text-body-lg mb-6 max-w-3xl opacity-90 line-clamp-2">
              {course.course.description}
            </p>
            <div className="flex flex-wrap items-center gap-stack-md text-sm mb-6">
              <div className="flex items-center gap-1">
                <span className="text-secondary-fixed font-bold">4.9</span>
                <div className="flex text-secondary-fixed">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <span className="text-white/70">(2,450 ratings)</span>
              </div>
              <div className="h-4 w-px bg-white/20"></div>
              <span className="text-white/70">
                {course.course.students} Đã đăng kí khóa học
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">Được tạo bởi </p>
              <div
                className="
                    text-primary-fixed text-[14px] underline decoration-primary-fixed/30 
                    hover:decoration-primary-fixed"
              >
                {course.course.provider_name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="px-margin-desktop max-w-7xl mx-auto py-stack-lg relative mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/*Thêm class: scroll-reveal opacity-0 translate-y-12 transition-all duration-700 ease-out */}
            {/* What You'll Learn */}
            <section className="scroll-reveal opacity-0 translate-y-12 transition-all duration-700 ease-out p-6 border border-outline-variant/30 rounded-lg">
              <h2 className="font-headline-md text-headline-md mb-6">
                Tổng quan khóa học
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    check
                  </span>
                  <span className="text-sm">
                    Understand cognitive biases that influence how users
                    interact with complex dashboards.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    check
                  </span>
                  <span className="text-sm">
                    Learn to structure massive data sets into digestible,
                    intuitive navigation systems.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    check
                  </span>
                  <span className="text-sm">
                    Build scalable component libraries that maintain consistency
                    across large platforms.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    check
                  </span>
                  <span className="text-sm">
                    Turn complex metrics into actionable insights through
                    precise chart and graph design.
                  </span>
                </div>
              </div>
            </section>

            {/* Course Content */}
            <section className="scroll-reveal opacity-0 translate-y-12 transition-all duration-700 ease-out">
              <h2 className="font-headline-md text-headline-md mb-4">
                Nội dung khóa học
              </h2>

              <div className="flex justify-between items-center mb-4 text-sm text-on-surface-variant">
                <span>
                  {course.sections?.length || 0} sections •{" "}
                  {course.sections?.reduce(
                    (total, section) => total + section.lectures.length,
                    0,
                  ) || 0}{" "}
                  bài học
                </span>
                <button
                  onClick={handleExpandAll}
                  className="
                    text-primary font-semibold hover:text-primary-container cursor-pointer
                    transform transition-all duration-300 ease-in-out hover:scale-105 
                    "
                >
                  {isAllExpanded
                    ? "Đóng tất cả các phần"
                    : "Mở rộng tất cả các phần"}
                </button>
              </div>

              <div className="border border-outline-variant/30 rounded-lg overflow-hidden divide-y divide-outline-variant/30 bg-surface-container-lowest">
                {course.sections?.map((section) => (
                  <div key={section._id}>
                    <button
                      onClick={() => toggleSection(section._id)}
                      className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container transition-colors text-left font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-lg transform transition-transform ${
                            expandedSections[section._id] ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>

                        <span>{section.chapter_title}</span>
                      </div>

                      <span className="text-xs font-normal">
                        {section.lectures.length} lectures • {section.duration}
                      </span>
                    </button>

                    <div
                      className={`${
                        expandedSections[section._id] ? "block" : "hidden"
                      } divide-y divide-outline-variant/10`}
                    >
                      {section.lectures.map((lecture) => (
                        <div
                          key={lecture._id}
                          className="flex items-center justify-between p-4 text-sm hover:bg-surface-container-low/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-sm text-on-surface-variant">
                              play_circle
                            </span>

                            <span>{lecture.title}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            {lecture.preview && (
                              <span className="text-primary underline cursor-pointer">
                                Xem thử
                              </span>
                            )}

                            <span className="text-on-surface-variant">
                              {lecture.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="scroll-reveal opacity-0 translate-y-12 transition-all duration-700 ease-out">
              <h2 className="font-headline-md text-headline-md mb-4">
                Yêu cầu khóa học
              </h2>
              <ul className="list-disc ml-5 space-y-2 text-sm text-on-surface-variant">
                {course.requests.map((rq) => (
                  <li key={rq._id}>{rq.request_name}</li>
                ))}
              </ul>
            </section>

            {/* Description */}
            <section className="scroll-reveal opacity-0 translate-y-12 transition-all duration-700 ease-out">
              <h2 className="font-headline-md text-headline-md mb-4">Mô tả</h2>
              <div className="prose prose-sm text-on-surface-variant space-y-4">
                <p>{course.course.description}</p>
              </div>
            </section>

            {/* Instructor Bio */}
            <section
              className="scroll-reveal opacity-0 translate-y-12 transition-all duration-700 ease-out scroll-mt-24"
              id="instructor"
            >
              <h2 className="font-headline-md text-headline-md mb-6">
                Giảng viên
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-bold text-primary underline underline-offset-4 decoration-primary/30">
                    {course.course.provider_name}
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Senior Product Design Lead @ TechNexus
                  </p>
                </div>
                <div className="flex gap-8 items-start">
                  <img
                    alt="Marcus Sterling"
                    className="w-28 h-28 rounded-full object-cover shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvtcD6oC7w8QaKBKPo44FHxbvq-wIVSEWgTUZobOKYRYLAyGwFn6mxhmhUu_39HKM3_JEGptqciRfWcuZqapXIpQYd5PAsjjpP17uhsY-cnQrMu6VtCXBrTxYYvK-3ENJiLlC_ry72jdSzkHjj-umumKc2Mi5RFpJhz2gLwvCotyqf1WWMq-CoUrxQHsfHm06XjlcYkBpI5l_wtravSGxB0wQ2frm6CK-zhs9n4btb6WINfzO0Gp0nBETHem131JTL5grXnUyPv_8"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className="material-symbols-outlined text-lg text-on-surface"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-bold">4.9</span> Instructor Rating
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className="material-symbols-outlined text-lg text-on-surface"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        reviews
                      </span>
                      <span className="font-bold">12,402</span> Reviews
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className="material-symbols-outlined text-lg text-on-surface"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        person
                      </span>
                      <span className="font-bold">45,821</span> Students
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className="material-symbols-outlined text-lg text-on-surface"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_circle
                      </span>
                      <span className="font-bold">3</span> Courses
                    </div>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-2">
                  Marcus has spent the last 15 years leading design teams at
                  Fortune 500 companies and high-growth startups. His work
                  focuses on making complex software feel invisible, allowing
                  users to achieve their goals with zero friction.
                </p>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar Card */}
          <aside className="lg:col-span-4">
            <div className="w-full bg-surface-container-lowest shadow-2xl border border-outline-variant/20 rounded-lg overflow-hidden lg:sticky lg:top-24 z-40">
              {/* Course Preview */}
              <div className="relative aspect-video group cursor-pointer">
                <img
                  alt="Course Preview"
                  className="w-full h-full object-cover"
                  src={course.course.image_url}
                />
                <BoxModalVideo videoLink={course.course.video_url} />
                <p className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-sm">
                  Xem trước khóa học
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center flex-wrap gap-3 mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-on-surface">
                      {Number(course.course.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    <span className="text-on-surface-variant line-through text-lg">
                      $149.99
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-bold bg-[#FFCDD2] py-1 px-2 rounded">
                    40% off
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-primary-container text-white font-bold rounded hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Thêm giỏ hàng
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-4 border border-on-surface text-on-surface font-bold rounded hover:bg-surface-container-low active:scale-[0.98] transition-all"
                  >
                    Mua ngay
                  </button>
                  {user?.role === "customer" && (
                    <button
                      type="button"
                      onClick={() => toggleWishlist(course.course._id)}
                      className="w-full py-3 flex items-center justify-center gap-2 border border-outline-variant rounded hover:bg-surface-container-low transition-all text-sm font-semibold"
                    >
                      <span
                        className="material-symbols-outlined text-[20px] transition-colors"
                        style={{
                          fontVariationSettings: isWishlisted(course.course._id)
                            ? "'FILL' 1"
                            : "'FILL' 0",
                          color: isWishlisted(course.course._id)
                            ? "#e53935"
                            : undefined,
                        }}
                      >
                        favorite
                      </span>
                      {isWishlisted(course.course._id)
                        ? "Đã lưu yêu thích"
                        : "Lưu vào yêu thích"}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-on-surface">
                    Khóa học này bao gồm:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">
                        video_library
                      </span>
                      <span>{course.course.duration} giờ video khóa học</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">
                        devices
                      </span>
                      <span>Truy cập trên thiết bị di động và máy tính</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
