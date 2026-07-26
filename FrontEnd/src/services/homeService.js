import api from "../lib/api";

// Task notes (Homepage data services):
// - Categories for homepage/category search.
// - Featured courses section.
// - Provider list used by homepage/instructor pages.

export const getCategories = () => api.get("/categories");

export const getFeatureCourses = () => api.get("/courses-feature");

export const getProviders = () => api.get("/providers");
