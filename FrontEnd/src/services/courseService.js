import api from "../lib/api";

/**
 *
 * @param {Object} params
 * @param {string} [params.category]  — filter by cate_name
 * @param {string} [params.q]         — keyword search by course title
 * @param {string} [params.price]     — "Free" | "Paid"
 * @param {string} [params.rating]    — placeholder
 * @param {string} [params.level]     — placeholder
 * @param {number} [params.page]      — current page (default 1)
 * @param {number} [params.limit]     — items per page (default 12)
 */
export const getCourses = (params = {}) => {
  // Remove empty/undefined values from the params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );

  return api.get("/api/courses", { params: cleanParams });
};

export const getCourseDetail = (id) => {
  return api.get(`/courses/${id}`);
};
