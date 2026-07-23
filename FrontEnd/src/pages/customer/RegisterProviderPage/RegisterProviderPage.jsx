import React, { useState } from "react";
import { Spin } from "antd";
import ProviderStatusView from "./ProviderStatusView/ProviderStatusView";
import useGetMyProviderRequest from "../../../hooks/useGetMyProviderRequest";
import RegisterFormAndInfoProvider from "./RegisterFormAndInfoProvider/RegisterFormAndInfoProvider";

const RegisterProviderPage = () => {
  const { data: provider, isLoading, refetch } = useGetMyProviderRequest();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" description="Đang tải dữ liệu..." />
      </div>
    );
  }

  // Chưa từng đăng ký hồ sơ HOẶC hồ sơ bị từ chối và bấm nút Đăng ký lại
  if (!provider || isEditing) {
    return (
      <RegisterFormAndInfoProvider
        initialValues={provider} 
        onSubmitSuccess={() => {
          setIsEditing(false); // Thoát chế độ sửa đổi
          refetch();           // Bắn API kéo trạng thái 'pending' mới về để tự động ẩn form
        }}
      />
    );
  }

  // Đã có hồ sơ trong DB (Gồm các trạng thái: pending, approved, rejected)
  return (
    <ProviderStatusView
      providerData={provider}
      onReRegister={() => setIsEditing(true)} // Khi bấm đăng ký lại, kích hoạt Form hiện lên
    />
  );
};

export default RegisterProviderPage;