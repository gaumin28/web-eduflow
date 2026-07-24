import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const useFetchCategory = () => {
  return useQuery({
    queryKey: ["Category"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useFetchCategory;
