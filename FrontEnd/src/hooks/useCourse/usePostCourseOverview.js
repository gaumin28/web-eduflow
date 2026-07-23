// hooks/useCourse/usePostCourseOverview.js
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const usePostCourseOverview = () => {
  return useMutation({
    mutationKey: ["CourseOverview"],
    mutationFn: async ({ courseId, overview_name }) => {
      const res = await api.post(
        `/courses/${courseId}/overviews`,
        { overview_name }
      );
      return res.data;
    },
  });
};

export default usePostCourseOverview;