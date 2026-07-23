import api from "../lib/api";

export const getProviders = () => api.get("/providers");

export const getProviderCourses = (providerId) =>
  api.get(`/providers/${providerId}/courses`);
