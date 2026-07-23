import api from "../lib/api";

export const getCategories = () => api.get("/categories");

export const getFeatureCourses = () => api.get("/courses-feature");

export const getProviders = () => api.get("/providers");
