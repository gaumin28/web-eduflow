import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const useGetCourseDetail = (courseId) => {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId, // chỉ fetch khi có id
  });
};

export default useGetCourseDetail;
