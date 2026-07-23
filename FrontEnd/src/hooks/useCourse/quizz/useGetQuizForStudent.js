import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

const useGetQuizForStudent = (quizId, open) => {
  return useQuery({
    queryKey: ["StudentQuiz", quizId],
    enabled: !!quizId && open,
    queryFn: async () => {
      const res = await api.get(`/learning/quiz/${quizId}`);
      return res.data.data;
    },
  });
};

export default useGetQuizForStudent;