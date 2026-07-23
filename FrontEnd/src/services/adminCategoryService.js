import api from "../lib/api";

function cleanParams(params = {}) {
  const result = {};
  Object.entries(params).forEach(([key, value]) => {
    if (
      value === "" ||
      value === "all" ||
      value === undefined ||
      value === null
    ) {
      return;
    }
    result[key] = value;
  });
  return result;
}

export const getAdminCategories = async (params = {}) => {
  const response = await api.get("/admin/categories", {
    params: cleanParams(params),
  });
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/admin/categories", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

export const updateCategoryStatus = async (id, isActive) => {
  const response = await api.patch(`/admin/categories/${id}/status`, {
    isActive,
  });
  return response.data;
};
