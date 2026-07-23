import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const usePostCourseLecture = () => {
  return useMutation({
    mutationKey: ["CourseLecture"],
    mutationFn: async ({ sectionId, payload }) => {
      const res = await api.post(`/sections/${sectionId}/lectures`, payload);
      return res.data;
    },
  });
};

export default usePostCourseLecture;