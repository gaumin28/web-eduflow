import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const useGetProviderRequests = (page, limit, status) => {
  return useQuery({
    queryKey: ["provider-requests", page, limit, status],
    queryFn: async () => {
      const res = await api.get("/providers-requests", {
        params: {
          page,
          limit,
          status: status === "all" ? undefined : status, 
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useGetProviderRequests;