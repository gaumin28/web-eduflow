import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const useGetCourse = (page, limit, search) => {
  return useQuery({
    queryKey: ["courses", page, limit, search],
    queryFn: async () => {
      const res = await api.get("/courses-of-provider", {
        params: {
          page,
          limit,
          search,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useGetCourse;
