import React, { useState } from "react";
import { Result, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import api from "../../../../lib/api"; 

export default function ProviderStatusView({ providerData, onReRegister }) {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false); 

  const status = providerData?.status; 

  const handleGoToDashboard = async () => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      const { data } = await api.post("/refresh-token", {});

      localStorage.setItem("accessToken", data.accessToken);

      if (user) {
        updateUser({ ...user, role: "provider" });
      }

      setTimeout(() => {
        navigate("/provider");
      }, 50); 

    } catch (error) {
      console.error("Lỗi đồng bộ quyền đối tác:", error);
      alert("Đã có lỗi xảy ra khi đồng bộ quyền. Vui lòng thử lại!");
    } finally {
      setIsUpgrading(false);
    }
  };

  if (status === "pending") {
    return (
      <Result
        status="info"
        title="Hồ sơ đang được chờ duyệt"
        subTitle="Hệ thống đã ghi nhận yêu cầu của bạn. Admin sẽ kiểm tra và phản hồi trong thời gian sớm nhất."
      />
    );
  }

  if (status === "approved") {
    return (
      <Result
        status="success"
        title="Chúc mừng! Bạn đã là đối tác"
        subTitle="Hồ sơ đăng ký nhà cung cấp của bạn đã được phê duyệt chính thức."
        extra={[
          <Button 
            type="primary" 
            key="manage" 
            size="large" 
            className="bg-green-600 border-none" 
            onClick={handleGoToDashboard} 
            loading={isUpgrading}
          >
            Đi đến trang quản lý nhà cung cấp
          </Button>,
        ]}
      />
    );
  }

  if (status === "rejected") {
    return (
      <div className="max-w-md mx-auto">
        <Result
          status="error"
          title="Yêu cầu bị từ chối"
          subTitle="Hồ sơ đăng ký chưa đạt yêu cầu của hệ thống."
          extra={[
            <Button type="primary" key="retry" size="large" onClick={onReRegister}>
              Đăng ký lại
            </Button>,
          ]}
        >
          {providerData.rejection_reason && (
            <Alert
              message="Lý do từ chối từ Admin:" 
              description={providerData.rejection_reason}
              type="error"
              showIcon
            />
          )}
        </Result>
      </div>
    );
  }

  return null;
}