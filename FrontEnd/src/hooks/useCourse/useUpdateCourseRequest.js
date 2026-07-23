// hooks/courseRequest/useUpdateCourseRequest.js
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

const useUpdateCourseRequest = () => {
  return useMutation({
    mutationKey: ["UpdateCourseRequest"],
    mutationFn: async ({ requestId, request_name }) => {
      const res = await api.put(
        `/courses/requests/${requestId}`,
        { request_name }
      );
      return res.data;
    },
  });
};

export default useUpdateCourseRequest;