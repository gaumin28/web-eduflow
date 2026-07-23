import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/api";

const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: async ({ quizId, answers }) => {
      const res = await api.post(`/quiz/${quizId}/submit`, {
        answers,
      });

      return res.data;
    },
  });
};

export default useSubmitQuiz;