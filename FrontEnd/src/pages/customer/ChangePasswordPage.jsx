import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";

const { Text } = Typography;

export default function ChangePasswordPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      setError("");

      await changePassword(
        values.currentPassword,
        values.newPassword,
        values.confirmPassword,
      );

      message.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại!");

      await logout();
      navigate("/login", { replace: true });

      form.resetFields();
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể cập nhật mật khẩu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Thay đổi mật khẩu</h1>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>
            Thay đổi mật khẩu đăng nhập. Nếu quên mật khẩu vui lòng chọn
          </span>

          <Link
            to="/forgot-password"
            className="text-primary hover:underline font-medium"
          >
            Quên mật khẩu
          </Link>
        </div>
      </div>

      {/* Form */}
      <Card
        className="rounded-xl"
        title={
          <div className="flex items-center gap-2">
            <LockOutlined />
            <span>Đổi mật khẩu</span>
          </div>
        }
      >
        {error && (
          <Alert type="error" message={error} showIcon className="mb-5" />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu hiện tại",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu mới",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={saving}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Card>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <Text type="secondary">
          Không nhận ra thiết bị đăng nhập hoặc phát hiện hoạt động bất thường?
        </Text>

        <div className="mt-2">
          <Link to="/support" className="text-primary hover:underline">
            Liên hệ bộ phận hỗ trợ bảo mật
          </Link>
        </div>
      </div>
    </div>
  );
}
