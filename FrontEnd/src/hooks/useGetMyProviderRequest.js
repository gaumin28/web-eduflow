import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const useGetMyProviderRequest = () => {
  return useQuery({
    queryKey: ["myProviderRequest"],  
    queryFn: async () => {
      const res = await api.get("/provider/my-request");
      
      return res.data.data; 
    },
    keepPreviousData: true
  });
};

export default useGetMyProviderRequest;