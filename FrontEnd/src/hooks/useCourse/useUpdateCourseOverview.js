

import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useUpdateCourseOverview = () => {
  return useMutation({
    mutationKey: ["UpdateCourseOverview"],
    mutationFn: async ({ courseId, overviewId, overview_name }) => {
      const res = await api.put(
        `/courses/${courseId}/overviews/${overviewId}`,
        { overview_name }
      );
      return res.data;
    },
  });
};

export default useUpdateCourseOverview;