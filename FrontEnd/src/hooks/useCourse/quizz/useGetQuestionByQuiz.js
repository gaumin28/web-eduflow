import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

const useGetQuestionByQuiz = (quizId) => {
  return useQuery({
    queryKey: ["QuizQuestion", quizId],
    queryFn: async () => {
      const res = await api.get(`/quiz/${quizId}/questions`);
      return res.data.data;
    },
    keepPreviousData: true
  });
};

export default useGetQuestionByQuiz;