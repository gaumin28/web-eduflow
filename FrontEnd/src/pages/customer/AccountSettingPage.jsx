import { useRef, useState } from "react";
import { Button, Card, Form, Input, Modal, message } from "antd";
import {
  UserOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const AccountSettingPage = () => {
  const [profileForm] = Form.useForm();
  const fileInputRef = useRef(null);

  const [avatarSrc, setAvatarSrc] = useState(
    "https://i.pravatar.cc/300?img=68",
  );

  const handleUpdateProfile = async (values) => {
    console.log("Profile:", values);

    try {
      // TODO: call API update profile

      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      error.message("Cập nhật thất bại!");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setAvatarSrc(previewUrl);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      console.log("Upload Avatar:", file);

      // TODO:
      // const { data } = await updateAvatar(formData);

      message.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error(error);
      message.error("Tải ảnh thất bại!");
    }
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Xóa tài khoản",
      icon: <ExclamationCircleOutlined />,
      content:
        "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
      },
      onOk() {
        message.warning("Chức năng đang phát triển");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cài đặt tài khoản</h1>

          <p className="text-gray-500 text-sm mt-2">
            Quản lý thông tin cá nhân và hồ sơ của bạn.
          </p>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Avatar */}
          <Card className="rounded-2xl">
            <div className="flex flex-col items-center py-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <UploadOutlined className="text-white text-3xl" />
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-semibold">Ảnh đại diện</h3>

              <p className="text-center text-gray-500 mt-2 mb-5">
                Tải lên ảnh mới để cá nhân hóa hồ sơ của bạn.
              </p>

              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
              >
                Cập nhật ảnh
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>
          </Card>

          {/* Profile Form */}
          <Card className="lg:col-span-2 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <UserOutlined />
              <h3 className="text-xl font-semibold">Thông tin cá nhân</h3>
            </div>

            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={{
                username: "alex_johnson",
                email: "alex.j@example.com",
                bio: "Người học đam mê công nghệ và lập trình.",
              }}
            >
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đăng nhập",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Ngày tạo tài khoản">
                  <Input defaultValue="15/01/2024" disabled />
                </Form.Item>
              </div>

              <Form.Item label="Giới thiệu bản thân" name="bio">
                <TextArea rows={4} />
              </Form.Item>

              <div className="flex justify-end">
                <Button type="primary" htmlType="submit">
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card
          className="border border-red-200 rounded-2xl"
          styles={{
            body: {
              backgroundColor: "#fff7f7",
            },
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-red-600">Đóng tài khoản</h3>

              <p className="text-gray-500 mt-2">
                Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên quan. Hành động
                này không thể hoàn tác.
              </p>
            </div>

            <Button danger size="large" onClick={handleDeleteAccount}>
              Xóa tài khoản
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettingPage;
