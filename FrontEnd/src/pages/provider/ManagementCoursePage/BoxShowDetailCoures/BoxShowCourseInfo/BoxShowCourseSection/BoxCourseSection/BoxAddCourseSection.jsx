import { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import usePostCourseSection from "../../../../../../../hooks/useCourse/usePostCourseSection";

const BoxAddCourseSection = ({ refetch, courseId }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate: addSection, isPending } = usePostCourseSection();

  const handleAdd = (values) => {
    const payload = {
      chapter_title: values.chapter_title,
      duration: values.duration,
    };

    addSection(
      { courseId, payload },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Thêm bài học/section thành công!",
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
            setTimeout(() => navigate("/login"), 1200);
            return;
          }

          notification.error({
            title: "Thất bại",
            description:
              error?.response?.data?.message || "Thêm section thất bại",
          });
        },
      },
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          bg-[#3525CD] text-white px-4 py-2 rounded transition duration-300 ease-in-out
          hover:scale-95 hover:opacity-65 cursor-pointer
        "
      >
        + Thêm bài học
      </button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <h1 className="text-[20px] font-semibold text-[#000000] mb-4">
          Thêm bài học
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-[12px]">Tên bài học</span>}
            name="chapter_title"
            rules={[{ required: true, message: "Vui lòng nhập tên bài học!" }]}
          >
            <Input className="custom-input" placeholder="Nhập tên bài học" />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Thời gian</span>}
            name="duration"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian bài học!" },
            ]}
          >
            <Input
              className="custom-input"
              placeholder="Nhập thời gian bài học"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            loading={isPending}
            className="w-full bg-[#3525CD] text-white"
            style={{ backgroundColor: "#3525CD", color: "#ffffff" }}
          >
            Xác nhận thêm
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoxAddCourseSection;
