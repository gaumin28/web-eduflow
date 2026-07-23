import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, notification } from "antd";
import { useNavigate } from "react-router-dom";

import useFetchCategory from "../../../../../../hooks/useCourse/useFetchCategory";
import { useAuth } from "../../../../../../contexts/AuthContext";
import useUpdateCourse from "../../../../../../hooks/useCourse/useUpdateCourse";

const { Option } = Select;

const BoxEditInfoCourse = ({ course, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: categoryData, isLoading: categoryLoading } = useFetchCategory();
  const { user } = useAuth();
  const { mutate: updateCourse, isPending } = useUpdateCourse();

  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !course || categoryLoading) return;

    form.setFieldsValue({
      category_id: course?.category_id?._id || course?.category_id,
      courseName: course?.course_title,
      price: course?.price,
      image_url: course?.image_url,
      video_url: course?.video_url || "",
      duration: course?.duration,
      description: course?.description,
    });
  }, [open, course, categoryLoading, form]);

  const handleSubmit = (values) => {
    const payload = {
      category_id: values.category_id,
      course_title: values.courseName,
      price: Number(values.price),
      image_url: values.image_url,
      video_url: values.video_url?.trim() || "",
      description: values.description,
      duration: values.duration,
      feature: course?.feature ?? false,
    };

    updateCourse(
      { id: course?._id, payload },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Cập nhật thông tin khóa học thành công!",
          });

          setOpen(false);
          form.resetFields();
          refetch?.();
        },
        onError: (error) => {
          const status = error?.response?.status;

          if (status === 401) {
            notification.error({
              title: "Phiên đăng nhập đã hết hạn!",
              description: "Vui lòng đăng nhập lại",
            });

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            setTimeout(() => navigate("/login"), 1500);
          } else {
            notification.error({
              title: "Thất bại",
              description:
                error?.response?.data?.message || "Cập nhật khóa học thất bại",
            });
          }
        },
      },
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          bg-[#4F46E5] text-white px-4 py-2 rounded
          hover:scale-95 hover:opacity-70 transition cursor-pointer
        "
      >
        Chỉnh sửa khóa học
      </button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <h1 className="text-[20px] font-semibold mb-4">Chỉnh sửa khóa học</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* PROVIDER + CATEGORY */}
          <div className="flex gap-2">
            <Form.Item label="Nhà cung cấp" className="w-full">
              <Input value={user?.username} disabled />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="category_id"
              className="w-full"
              rules={[{ required: true, message: "Chọn danh mục" }]}
            >
              <Select
                loading={categoryLoading}
                placeholder="Chọn danh mục"
                allowClear
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

            {/* video  */}
            <Form.Item
              label="Video giới thiệu"
              name="video_url"
              className="w-full"
              rules={[]}
            >
              <Input placeholder="https://... (có thể để trống)" />
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
            className="w-full bg-[#4F46E5] text-white"
            style={{ backgroundColor: "#4F46E5", color: "#ffffff" }}
          >
            Lưu chỉnh sửa
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoxEditInfoCourse;
