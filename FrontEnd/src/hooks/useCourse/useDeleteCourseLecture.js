// hooks/useCourse/useDeleteCourseLecture.js
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useDeleteCourseLecture = () => {
  return useMutation({
    mutationKey: ["DeleteCourseLecture"],
    mutationFn: async (lectureId) => {
      const res = await api.delete(`/lectures/${lectureId}`);
      return res.data;
    },
  });
};

export default useDeleteCourseLecture;