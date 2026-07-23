import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/api";

const usePostQuestionCourse = () => {
  return useMutation({
    mutationKey: ["QuizQuestion"],
    mutationFn: async (payload) => {
      const res = await api.post("/quiz/question", payload);
      return res.data;
    },
  });
};

export default usePostQuestionCourse;