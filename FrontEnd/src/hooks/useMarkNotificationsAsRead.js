import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const useMarkNotificationsAsRead = ({ isAdmin, userId }) => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async ({ notificationId, isAll } = {}) => {
      let endpoint = "";

      if (isAdmin) {
        endpoint = isAll ? "/admin/notifications/read-all" : `/admin/notifications/${notificationId}/read`;
      } else {
        endpoint = isAll ? "/notifications/user/read-all" : `/notifications/${notificationId}/read`;
      }

      const res = await api.patch(endpoint);
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Làm mới cache danh sách thông báo
      queryClient.invalidateQueries({ queryKey: ["notifications", isAdmin ? "admin" : userId] });
    },
    onError: (error) => {
      console.error("Lỗi khi đánh dấu đã đọc thông báo:", error);
    }
  });
};

export default useMarkNotificationsAsRead;