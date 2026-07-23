import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetCourseDetail = (courseId) => {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8080/courses/${courseId}`
      );
      return res.data;
    },
    enabled: !!courseId, // chỉ fetch khi có id
  });
};

export default useGetCourseDetail;