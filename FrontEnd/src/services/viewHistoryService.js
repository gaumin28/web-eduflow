import { getCourseDetail } from "./courseService";

export const getRecentlyViewed = async () => {
  try {
    const history = JSON.parse(localStorage.getItem("viewHistory") || "[]");
    if (!history.length) return { data: { data: [] } };

    const promises = history.map((id) => getCourseDetail(id));
    const results = await Promise.allSettled(promises);

    const courses = results
      .filter((r) => r.status === "fulfilled" && r.value.data && r.value.data.course)
      .map((r) => r.value.data.course);

    const formattedCourses = courses.map((c) => ({
      _id: c._id,
      course_title: c.course_title,
      image_url: c.image_url,
      price: c.price,
      price_promotion: c.price_promotion,
      students: c.students || 0,
      provider: c.provider_id?.provider_name || c.provider?.provider_name || "Unknown Instructor",
      duration: c.duration,
    }));

    return { data: { data: formattedCourses } };
  } catch (error) {
    console.error("Error loading view history from localStorage", error);
    return { data: { data: [] } };
  }
};

export const recordView = async (courseId) => {
  try {
    let history = JSON.parse(localStorage.getItem("viewHistory") || "[]");

    // Remove if exists to put it at the beginning
    history = history.filter((id) => id !== courseId);
    history.unshift(courseId);

    // Keep only the top 10 recent
    if (history.length > 10) {
      history = history.slice(0, 10);
    }

    localStorage.setItem("viewHistory", JSON.stringify(history));
    return { success: true };
  } catch (error) {
    console.error("Error saving view history to localStorage", error);
    return { success: false };
  }
};
