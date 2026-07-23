import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

const useUpdateProviderStatus = () => {
  return useMutation({
    mutationFn: async ({ providerId, status }) => {
      const res = await api.patch(`/provider/${providerId}/status`, { status });
      return res.data;
    },
  });
};

export default useUpdateProviderStatus;