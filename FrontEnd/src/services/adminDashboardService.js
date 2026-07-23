import api from "../lib/api";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard/stats");
  return response.data;
};

export const getRevenueChart = async () => {
  const response = await api.get("/admin/dashboard/revenue-chart");
  return response.data;
};

export const getDashboardTables = async () => {
  const response = await api.get("/admin/dashboard/tables");
  return response.data;
};
