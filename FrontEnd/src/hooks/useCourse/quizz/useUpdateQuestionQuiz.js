import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/api";

const useUpdateQuestion = () => {
  return useMutation({
    mutationKey: ["UpdateQuestion"],
    mutationFn: async ({ questionId, payload }) => {
      const res = await api.put(
        `/questions/${questionId}`,
        payload
      );

      return res.data;
    },
  });
};

export default useUpdateQuestion;