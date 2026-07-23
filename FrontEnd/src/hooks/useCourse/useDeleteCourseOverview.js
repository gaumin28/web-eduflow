// hooks/useCourseOverview/useDeleteCourseOverview.js

import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useDeleteCourseOverview = () => {
  return useMutation({
    mutationKey: ["DeleteCourseOverview"],
    mutationFn: async ({ courseId, overviewId }) => {
      const res = await api.delete(
        `/courses/${courseId}/overviews/${overviewId}`
      );

      return res.data;
    },
  });
};

export default useDeleteCourseOverview;