import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/api";

const useUpdateQuizzCourse = () => {
  return useMutation({
    mutationKey: ["Quiz"],
    mutationFn: async ({ quizId, payload }) => {
      const res = await api.put(`/quiz/${quizId}`, payload);
      return res.data;
    },
  });
};

export default useUpdateQuizzCourse;