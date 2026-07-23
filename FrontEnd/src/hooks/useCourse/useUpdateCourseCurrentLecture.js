import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

const useUpdateLearningProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lectureId }) => {
      const res = await api.put(
        "/course-progress/update-learning-progress",
        {
          courseId,
          lectureId,
        }
      );

      return res.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courses", "learning", variables.courseId],
      });
    },
  });
};

export default useUpdateLearningProgress;