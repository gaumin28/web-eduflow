import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/api";

const usePostQuiz = () => {
  return useMutation({
    mutationKey: ["Quiz"],
    mutationFn: async (payload) => {
      const res = await api.post("/quiz", payload);
      return res.data;
    },
  });
};

export default usePostQuiz;