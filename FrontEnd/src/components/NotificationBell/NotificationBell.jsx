import { Badge, Popover, Avatar, Button, Spin } from "antd";
import useGetNotifications from "../../hooks/useGetNotifications";
import useMarkNotificationsAsRead from "../../hooks/useMarkNotificationsAsRead";
import socket from "../../socket/socket";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function NotificationBell({ user }) {
  const queryClient = useQueryClient();
  
  const isAdmin = user?.role === "admin";
  const userId = user?._id;
  const targetKey = isAdmin ? "admin" : userId;

  const { data: notifications = [], isLoading } = useGetNotifications({ isAdmin, userId });
  const { mutate: markAsReadMutate, isPending } = useMarkNotificationsAsRead({ isAdmin, userId });
 
  // Duy trì Socket linh hoạt theo phòng
  useEffect(() => {
    if (!user || !userId) return; 
    
    if (!socket.connected) socket.connect();
    
    const roomName = isAdmin ? "admin-room" : userId.toString();
    socket.emit("join-room", roomName);

    socket.on("new_notification", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", targetKey] });
    });

    return () => {
      socket.off("new_notification");
    };
  }, [queryClient, user, isAdmin, userId, targetKey]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const menuDropdown = (
    <div className="w-80">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <span className="font-bold">{isAdmin ? "Thông báo hệ thống" : "Thông báo của bạn"}</span>
        {unreadCount > 0 && (
          <Button 
            type="link" 
            size="small" 
            onClick={() => markAsReadMutate({ isAll: true })} 
            loading={isPending}
          >
            Đọc tất cả
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-6"><Spin size="small" /></div>
      ) : (
        <div className="max-h-96 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
          {notifications?.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">Không có thông báo nào</div>
          ) : (
            notifications.map((item) => {
              const getRoleLabel = (role) => {
                switch(role) {
                  case "admin": return { text: "Admin", className: "bg-red-50 text-red-600 border border-red-200" };
                  case "customer": return { text: "Học viên", className: "bg-green-50 text-green-600 border border-green-200" };
                  case "provider": return { text: "Giảng viên", className: "bg-blue-50 text-blue-600 border border-blue-200" };
                  default: return { text: role || "Hệ thống", className: "bg-gray-50 text-gray-600 border border-gray-200" };
                }
              };
              
              const roleBadge = getRoleLabel(item.sender?.role);

              return (
                <div 
                  key={item._id}
                  className={`flex items-start gap-3 p-2.5 rounded transition-all cursor-pointer ${
                    !item.isRead 
                      ? "bg-[#fdb5b550] hover:bg-[#fdb5b575] font-medium" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    if (!item.isRead) {
                      markAsReadMutate({ notificationId: item._id });
                    }
                  }}
                >
                  <Avatar src={item.sender?.avatar} className="flex-shrink-0 mt-0.5">
                    {item.sender?.username?.[0]}
                  </Avatar>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-gray-800 block truncate">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-600 break-words leading-relaxed">
                      {item.content}
                    </span>
                    
                    {item.sender && (
                      <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                        <span className="text-gray-400">Bởi:</span>
                        <span className="font-semibold text-gray-700">{item.sender?.username}</span>
                        <span className="text-gray-300">|</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wide ${roleBadge.className}`}>
                          {roleBadge.text}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link 
                    to={`${item.link}`} 
                    className="text-gray-400 hover:text-blue-500 self-center flex-shrink-0 p-1 rounded-full hover:bg-gray-200/50 transition-colors ml-1"
                    onClick={(e) => e.stopPropagation()} 
                  > 
                    <span className="material-symbols-outlined text-lg block">arrow_forward</span>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  return (
    <Popover content={menuDropdown} trigger="click" placement="bottomRight">
      <button className="relative rounded-full p-2 text-on-surface-variant hover:bg-surface-container">
        <Badge count={unreadCount} size="small">
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </Badge>
      </button>
    </Popover>
  );
}