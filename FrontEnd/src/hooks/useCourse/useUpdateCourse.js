import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useUpdateCourse = () => {
  return useMutation({
    mutationKey: ["UpdateCourse"],
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/courses/${id}`, payload);
      return res.data;
    },
  });
};

export default useUpdateCourse;