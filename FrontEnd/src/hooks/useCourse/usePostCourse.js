import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const usePostCourse = () => {
  return useMutation({
    mutationKey: ["Course"],
    mutationFn: async (payload) => {
      const res = await api.post("/courses", payload);
      return res.data;
    },
  });
};

export default usePostCourse;