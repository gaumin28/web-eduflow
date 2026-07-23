import { useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import useFetchCategory from "../../../../hooks/useCourse/useFetchCategory";
import { useAuth } from "../../../../contexts/AuthContext";
import usePostCourse from "../../../../hooks/useCourse/usePostCourse";
import { notification } from "antd";

import { useNavigate } from "react-router-dom";


const { Option } = Select;

const BoxAddinfoCourse = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: categoryData, isLoading: categoryLoading } = useFetchCategory();
  const { user } = useAuth();
  const { mutate: addCourse, isPending } = usePostCourse();
  const navigate = useNavigate();
  const handleSubmit = (values) => {
    const payload = {
      category_id: values.category,
      course_title: values.courseName,
      price: Number(values.price),
      image_url: values.image_url,
      video_url: values.video_url,
      description: values.description,
      duration: values.duration,
      feature: false,
    };

    addCourse(payload, {
      onSuccess: () => {
        notification.success({
          title: "Thành công",
          description: "Lưu thông tin khóa học thành công!",
        });

        setOpen(false);
        form.resetFields();
        refetch?.();
      },

      onError: (error) => {
        const status = error?.response?.status;

        if (status === 401) {
          // Báo lỗi TRƯỚC
          notification.error({
            title: "Phiên đăng nhập đã hết hạn!",
            description: "Vui lòng đăng nhập lại",
          });

          // Xóa token
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Chuyển trang SAU
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          notification.error({
            title: "Thất bại",
            description: "Lưu khóa học thất bại",
          });
        }
      },
    });
  };


  return (
    <>
      <Button 
        type="primary"
        onClick={() => setOpen(true)} 
        className="
          flex items-center gap-2 bg-primary text-white h-auto px-5 py-2.5 
          rounded-xl font-label-md border-none
        "
      >
        <span className="material-symbols-outlined text-white">add</span>
        Thêm khóa học mới
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <h1 className="text-[20px] font-semibold mb-4">
          Thêm khóa học mới
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* PROVIDER + CATEGORY */}
          <div className="flex gap-2">
            <Form.Item
              label="Nhà cung cấp"
              className="w-full"
            >
              <Input value={user?.username} disabled />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="category"
              className="w-full"
              rules={[{ required: true, message: "Chọn danh mục" }]}
            >
              <Select
                loading={categoryLoading}
                placeholder="Chọn danh mục"
              >
                {categoryData?.data.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.cate_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* COURSE NAME + PRICE */}
          <div className="flex gap-2">
            <Form.Item
              label="Tên khóa học"
              name="courseName"
              className="w-full"
              rules={[{ required: true, message: "Nhập tên khóa học" }]}
            >
              <Input placeholder="Nhập tên khóa học" />
            </Form.Item>

            <Form.Item
              label="Giá khóa học"
              name="price"
              className="w-full"
              rules={[{ required: true, message: "Nhập giá khóa học" }]}
            >
              <Input type="number" placeholder="VD: 499000" />
            </Form.Item>
          </div>

          {/* IMAGE + VIDEO */}
          <div className="flex gap-2">
            <Form.Item
              label="Ảnh khóa học"
              name="image_url"
              className="w-full"
              rules={[{ required: true, message: "Nhập link ảnh" }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item
              label="Video giới thiệu"
              name="video_url"
              className="w-full"
              rules={[{ required: true, message: "Nhập link video" }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>
          </div>

          {/* DURATION */}
          <Form.Item
            label="Thời gian khóa học"
            name="duration"
            rules={[{ required: true, message: "Nhập thời gian" }]}
          >
            <Input placeholder="VD: 36 giờ" />
          </Form.Item>

          {/* DESCRIPTION */}
          <Form.Item
            label="Mô tả khóa học"
            name="description"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea rows={4} placeholder="Mô tả khóa học..." />
          </Form.Item>

          <Button
            htmlType="submit"
            loading={isPending}
            type="primary"
            className="w-full bg-[#FF7D35] text-white"
          >
            Xác nhận thêm
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoxAddinfoCourse;