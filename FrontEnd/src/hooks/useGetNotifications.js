import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const useGetNotifications = ({ isAdmin, userId }) => {
  return useQuery({
    queryKey: ["notifications", isAdmin ? "admin" : userId], 
    queryFn: async () => {
      const endpoint = isAdmin ? "/admin/notifications" : "/notifications";
      const res = await api.get(endpoint);
      return res.data;
    },
    enabled: !!userId, // Chỉ chạy khi user đã đăng nhập thành công
  });
};

export default useGetNotifications;