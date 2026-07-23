import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useUpdateCourseSection = () => {
  return useMutation({
    mutationKey: ["UpdateCourseSection"],
    mutationFn: async ({ courseId, sectionId, payload }) => {
      const res = await api.put(
        `/courses/${courseId}/course-sections/${sectionId}`,
        payload
      );
      return res.data;
    },
  });
};

export default useUpdateCourseSection;