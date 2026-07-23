import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const useGetLearningCourseDetail = (courseId) => {
  return useQuery({
    queryKey: ["courses", "learning", courseId],
    queryFn: async () => {
      const res = await api.get(
        `http://localhost:8080/learning/courses/${courseId}`
      );
      return res.data.data;
    },
    enabled: !!courseId,
  });
};

export default useGetLearningCourseDetail;