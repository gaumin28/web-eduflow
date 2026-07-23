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

    if (key === "isActive" && value === "true") {
      result[key] = true;
      return;
    }

    if (key === "isActive" && value === "false") {
      result[key] = false;
      return;
    }

    result[key] = value;
  });

  return result;
}

export const getUsers = async (params = {}) => {
  const response = await api.get("/users", {
    params: cleanParams(params),
  });
  return response.data;
};

export const getUserDetail = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUserStatus = async (id, isActive) => {
  const response = await api.patch(`/users/${id}/status`, { isActive });
  return response.data;
};
