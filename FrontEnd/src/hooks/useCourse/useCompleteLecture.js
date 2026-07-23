import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useCompleteLecture = () => {
  return useMutation({
    mutationFn: async ({ courseId, lectureId }) => {
      const res = await api.put(
        "/course-progress/complete-lecture",
        {
          courseId,
          lectureId,
        }
      );

      return res.data;
    },
  });
};

export default useCompleteLecture;