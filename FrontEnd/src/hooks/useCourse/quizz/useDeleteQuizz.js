import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/api";

const useDeleteQuizz = () => {
    return useMutation({
        mutationKey: ["DeleteQuizz"],
        mutationFn: async (quizID) => {
            const res = await api.delete(`/quiz/${quizID}`);
            return res.data;
        },
    });
};

export default useDeleteQuizz;