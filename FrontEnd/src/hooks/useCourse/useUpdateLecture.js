
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useUpdateCourseLecture = () => {
  return useMutation({
    mutationKey: ["UpdateCourseLecture"],
    mutationFn: async ({ lectureId, payload }) => {
      const res = await api.put(
        `/lectures/${lectureId}`,
        payload
      );
      return res.data;
    },
  });
};

export default useUpdateCourseLecture;