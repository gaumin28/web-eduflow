import api from "../lib/api";

// Task notes (Admin order API):
// - Fetch admin order list with filter/search params.

function cleanParams(params = {}) {
  // Send only meaningful filters to backend.
  const result = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) {
      return;
    }
    result[key] = value;
  });

  return result;
}

export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/admin/orders", {
    params: cleanParams(params),
  });
  return response.data;
};
