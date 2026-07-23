import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useDeleteCourseSection = () => {
  return useMutation({
    mutationKey: ["DeleteCourseSection"],
    mutationFn: async ({ courseId, sectionId }) => {
      const res = await api.delete(
        `/courses/${courseId}/sections/${sectionId}`
      );
      return res.data;
    },
  });
};

export default useDeleteCourseSection;