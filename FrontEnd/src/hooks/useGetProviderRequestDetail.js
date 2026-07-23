import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const useGetProviderRequestDetail = (providerId) => {
  return useQuery({
    queryKey: ["provider-requests", providerId],
    queryFn: async () => {
      const res = await api.get(
        `http://localhost:8080/providers-requests/${providerId}`
      );
      return res.data;
    },
    enabled: !!providerId, // chỉ fetch khi có id
  });
};

export default useGetProviderRequestDetail;