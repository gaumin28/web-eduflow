import api from "../lib/api";

export const getProviders = () => api.get("/providers");

export const getProviderCourses = (providerId) =>
  api.get(`/providers/${providerId}/courses`);

export const getProviderProfileContent = (providerId) =>
  api.get(`/providers/${providerId}/profile-content`);

export const submitCourseReview = (courseId, payload) =>
  api.post(`/courses/${courseId}/reviews`, payload);

export const deleteMyCourseReview = (courseId) =>
  api.delete(`/courses/${courseId}/reviews/me`);
