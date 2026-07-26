import api from "../lib/api";

// Task notes (Instructor pages API):
// - Load provider list and provider courses.
// - Load instructor profile tabs content.
// - Submit/delete customer review for instructor courses.

export const getProviders = () => api.get("/providers");

export const getProviderCourses = (providerId) =>
  api.get(`/providers/${providerId}/courses`);

export const getProviderProfileContent = (providerId) =>
  api.get(`/providers/${providerId}/profile-content`);

export const submitCourseReview = (courseId, payload) =>
  api.post(`/courses/${courseId}/reviews`, payload);

export const deleteMyCourseReview = (courseId) =>
  api.delete(`/courses/${courseId}/reviews/me`);
