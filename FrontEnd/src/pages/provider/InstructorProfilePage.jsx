import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProviderCourses,
  getProviders,
} from "../../services/providerService";

const tabs = [
  { id: "courses", label: "Courses" },
  { id: "reviews", label: "Reviews" },
  { id: "about", label: "About" },
  { id: "resources", label: "Resources" },
];

const DEMO_PROVIDER_EMAIL = "instructor.seed@eduflow.local";

const STAR_PRESETS = [5, 4.5, 4.8, 4.2, 4.7, 4.3];

function formatVnd(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCourseDuration(course) {
  if (course.duration) return course.duration;
  if (course.total_lectures) {
    return `${course.total_lectures} lectures`;
  }
  return "Self-paced";
}

function RatingStars({ stars }) {
  const full = Math.floor(stars);
  const hasHalf = stars % 1 !== 0;

  return (
    <div className="flex text-primary">
      {Array.from({ length: full }).map((_, index) => (
        <span
          key={`full-${index}`}
          className="material-symbols-outlined text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
      {hasHalf ? (
        <span
          className="material-symbols-outlined text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star_half
        </span>
      ) : null}
      {Array.from({ length: 5 - full - (hasHalf ? 1 : 0) }).map((_, index) => (
        <span
          key={`empty-${index}`}
          className="material-symbols-outlined text-sm"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function InstructorProfilePage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("courses");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let alive = true;

    const loadInstructorData = async () => {
      setLoading(true);
      setError("");

      try {
        const requestedProviderId = searchParams.get("providerId");
        const { data: providerResponse } = await getProviders();
        const providerList = providerResponse?.data ?? [];

        const selectedProvider =
          providerList.find((item) => item._id === requestedProviderId) ||
          providerList.find((item) => item.email === DEMO_PROVIDER_EMAIL) ||
          providerList[0] ||
          null;

        if (!selectedProvider) {
          throw new Error("No provider data found in MongoDB");
        }

        const { data: courseResponse } = await getProviderCourses(
          selectedProvider._id,
        );

        if (!alive) return;

        setProvider(selectedProvider);
        setCourses(courseResponse?.data ?? []);
      } catch (fetchError) {
        if (!alive) return;
        setProvider(null);
        setCourses([]);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Failed to load instructor data.",
        );
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadInstructorData();

    return () => {
      alive = false;
    };
  }, [searchParams]);

  const mappedCourses = useMemo(() => {
    return courses.map((course, index) => {
      const price = course.price || 0;
      const promotionPrice = course.price_promotion;
      const displayPrice = promotionPrice ?? price;
      const showDiscount =
        promotionPrice !== null && promotionPrice !== undefined;

      return {
        id: course._id,
        badge: course.feature ? "Featured" : null,
        title: course.course_title,
        category: course.category_id?.cate_name || "Course",
        duration: formatCourseDuration(course),
        rating: course.feature ? "4.9" : "4.6",
        reviews: `(${course.students || 0})`,
        oldPrice: showDiscount ? formatVnd(price) : null,
        price: formatVnd(displayPrice),
        image:
          course.image_url ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBnHWFhCLx2J0Hdp90ILe-xGRXW2PGhxwRG4MAOcCdxNakzwpdINR8dZlvf_wJaay40pm5sCcuZxYGw5H9_owoi03h9lerzmfzWqG6dGs0obgMsHVVj9_xvAc2hLr4nKmgfWG27vpYwxQUR_rmX-sfq0Bv3WrLDL65jBCDAEItJuKoX-epHD3yYcBwnUxGQrFy1rDO5mkG2Sir6KCc-OabV0FSYvIsRWujrhRZ8XGUoeqLmV__Qe_x-wKQR_J1HGyK_tdSzX6O8Z-U",
        stars: STAR_PRESETS[index % STAR_PRESETS.length],
      };
    });
  }, [courses]);

  const derivedStats = useMemo(() => {
    const totalCourses = courses.length;
    const totalStudents = courses.reduce(
      (sum, course) => sum + (course.students || 0),
      0,
    );
    const totalReviews = courses.reduce(
      (sum, course) => sum + (course.students || 0),
      0,
    );

    return [
      { value: totalStudents.toLocaleString("vi-VN"), label: "Total Students" },
      { value: totalCourses.toString(), label: "Courses" },
      {
        value: totalCourses > 0 ? "4.8" : "0.0",
        label: "Avg Rating",
        icon: "star",
      },
      { value: totalReviews.toLocaleString("vi-VN"), label: "Reviews" },
    ];
  }, [courses]);

  const instructorName = provider?.provider_name || "Instructor";
  const instructorCareer = provider?.career || "Instructor profile";
  const instructorEmail = provider?.email || "Connected from MongoDB";
  const instructorProfile =
    provider?.profile?.trim() || "Instructor profile is not available yet.";

  const avatarUrl =
    (Array.isArray(provider?.images) ? provider.images[0] : provider?.images) ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAd6iIr3wnF1O2aqEhHFWdARgZBjFD1kNH4FP1tkCz3MUS-Qmk4ljXdCwGwxA2rqvY7iCnIvw7CVp8Ywu3VHvtipk3tJgAMbKwshCC5XloBcG-RuDJ4Ds0E-jEpzwZEwHcdi6D8xQ_IDROcIign-OYdem7ev7KhR_6H1XKg2mL62OejyZsKhDjzITui1C3QLGt9ETnR2w1mg5LglksHepQgE9Ll_4gUE9mufThSHj73nmMZVOrMrIJCo9NXbnbYpzA_30dcYgrRbyU";

  const content = useMemo(() => {
    if (activeTab === "courses") {
      return (
        <>
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              All Courses
            </h2>
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary transition-colors font-body-sm text-body-sm"
              />
            </div>
          </div>

          {mappedCourses.length === 0 ? (
            <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 text-on-surface-variant">
              No courses found for this instructor in MongoDB.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {mappedCourses.map((course) => (
                <article
                  key={course.id}
                  className="group glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {course.badge ? (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-primary-container/80 backdrop-blur-md text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          {course.badge}
                        </span>
                      </div>
                    ) : null}
                    <img
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={course.image}
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary/10 text-secondary text-label-sm font-label-sm px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <span className="text-on-surface-variant text-label-sm font-label-sm">
                        • {course.duration}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-[20px] leading-tight text-on-surface group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <RatingStars stars={course.stars} />
                      <span className="text-on-surface font-label-sm text-label-sm">
                        {course.rating}
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        {course.reviews}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                      <div className="flex flex-col">
                        {course.oldPrice ? (
                          <span className="text-on-surface-variant text-[12px] line-through">
                            {course.oldPrice}
                          </span>
                        ) : null}
                        <span className="text-on-surface font-bold text-headline-md">
                          {course.price}
                        </span>
                      </div>
                      <button className="bg-primary-container/10 text-primary hover:bg-primary-container hover:text-on-primary p-2.5 rounded-xl transition-all duration-300">
                        <span className="material-symbols-outlined">
                          add_shopping_cart
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      );
    }

    if (activeTab === "about") {
      return (
        <div className="glass-card p-8 rounded-3xl mt-8">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
            About
          </h3>
          <p className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
            {instructorProfile}
          </p>
        </div>
      );
    }

    return (
      <div className="glass-card p-8 rounded-3xl mt-8">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
          {activeTab === "reviews" ? "Learner Reviews" : "Resources"}
        </h3>
        <p className="text-on-surface-variant">
          This section can be connected to API data later.
        </p>
      </div>
    );
  }, [activeTab, mappedCourses, instructorProfile]);

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <div className="pt-24 pb-stack-lg">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
          <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-stack-lg md:p-12 border border-outline-variant/20 shadow-sm">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row gap-stack-lg items-center md:items-start text-center md:text-left">
              <img
                alt="Instructor Avatar"
                className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-white shadow-xl"
                src={avatarUrl}
              />

              <div className="flex-1 space-y-4">
                <h1 className="font-display text-display text-on-surface">
                  {instructorName}
                </h1>
                <p className="font-body-lg text-body-lg text-secondary font-medium italic">
                  {instructorCareer}
                </p>
                <p className="font-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                  {instructorEmail}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {derivedStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="glass-card p-4 rounded-2xl flex flex-col items-center md:items-start"
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-headline-md text-headline-md text-primary">
                          {stat.value}
                        </span>
                        {stat.icon ? (
                          <span
                            className="material-symbols-outlined text-primary text-xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {stat.icon}
                          </span>
                        ) : null}
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsFollowing((prev) => !prev)}
                  className="w-full md:w-48 bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">
                    {isFollowing ? "person_remove" : "person_add"}
                  </span>
                  {isFollowing ? "Following" : "Follow Instructor"}
                </button>
                <button className="w-full md:w-48 border-2 border-primary text-primary font-label-md text-label-md py-4 rounded-xl hover:bg-primary/5">
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="border-b border-outline-variant/30 mb-8 overflow-x-auto">
            <div className="flex gap-stack-lg min-w-max">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`font-label-md text-label-md px-4 py-4 border-b-2 transition-all ${isActive ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 text-on-surface-variant">
              Loading instructor data from MongoDB...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-error/20 bg-error/5 p-6 text-error">
              {error}
            </div>
          ) : (
            content
          )}
        </section>
      </div>
    </div>
  );
}
