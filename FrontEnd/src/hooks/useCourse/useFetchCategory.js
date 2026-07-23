
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchCategory = () => {
  return useQuery({
    queryKey: ["Category"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/categories");
      return res.data; 
    },
    keepPreviousData: true,
  });
};

export default useFetchCategory;