
import api from "../lib/api";

export const exportCourseExcel = async () => {
  const res = await api.get(
    "/my-courses/export-excel",
    {
      responseType: "blob",
    }
  );

  return res.data;
};