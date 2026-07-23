import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

const useRejectProvider = () => {
  return useMutation({
    mutationFn: async ({ providerId, rejection_reason }) => {
      const res = await api.patch(`/providers/${providerId}/reject`, { rejection_reason });
      return res.data;
    },
  });
};

export default useRejectProvider;