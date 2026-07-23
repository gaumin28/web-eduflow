

import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useDeleteCourse = () => {
  return useMutation({
    mutationKey: ["DeleteCourse"],
    mutationFn: async (courseId) => {
      const res = await api.delete(`/courses/${courseId}`);
      return res.data;
    },
  });
};

export default useDeleteCourse;