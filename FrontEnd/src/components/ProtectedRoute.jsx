import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Nếu đang check dữ liệu từ localStorage/API thì hiển thị loading
  if (loading) return null;

  // CHƯA ĐĂNG NHẬP: Đá về trang login là hoàn toàn đúng
  if (!user) return <Navigate to="/login" replace />;

  // ĐÃ ĐĂNG NHẬP NHƯNG SAI QUYỀN: 
  // Không đá về /login nữa, mà đá về trang thông báo lỗi hoặc trang chủ dòng /
  if (roles && !roles.includes(user.role)) {
    console.log(`Quyền hiện tại: ${user.role}, Quyền yêu cầu:`, roles);
    
    // Bạn có thể tạo 1 trang /403 hoặc tạm thời đá về trang chủ "/" thay vì /login
    return <Navigate to="/" replace />; 
  }

  return children;
}