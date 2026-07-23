import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/api";

const useDeleteQuestion = () => {
    return useMutation({
        mutationKey: ["DeleteQuestion"],
        mutationFn: async (questionId) => {
            const res = await api.delete(`/questions/${questionId}`);
            return res.data;
        },
    });
};

export default useDeleteQuestion;