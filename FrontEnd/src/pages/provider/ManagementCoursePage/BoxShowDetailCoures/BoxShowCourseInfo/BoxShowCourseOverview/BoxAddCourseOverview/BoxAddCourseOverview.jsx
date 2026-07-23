import { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";

import usePostCourseOverview from "../../../../../../../hooks/useCourse/usePostCourseOverview";

const BoxAddCourseOverview = ({ courseId, refetch }) => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const { mutate: addOverview } = usePostCourseOverview();

  const handleAdd = (values) => {
    addOverview(
      {
        courseId,
        overview_name: values.overview_name,
      },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Thêm tổng quan khóa học thành công",
          });
          setOpen(false);
          refetch?.();
        },
        onError: (err) => {
          notification.error({
            title: "Thất bại",
            description: err?.response?.data?.message,
          });
        },
      },
    );
  };

  return (
    <>
      <button
        onClick={showModal}
        className="
          bg-[#4F46E5] text-white px-4 py-2 rounded transition duration-300 ease-in-out 
          hover:scale-95 hover:opacity-65 cursor-pointer
        "
      >
        + Thêm tổng quan khóa học
      </button>
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <div>
          <h1 className="text-[20px] font-semibold text-[#000000">
            Thêm tổng quan khóa học
          </h1>
          <Form layout="vertical" onFinish={handleAdd} autoComplete="off">
            {/* Course ID (ẩn hoặc disabled) */}
            <Form.Item name="course_id" initialValue={courseId} hidden>
              <Input />
            </Form.Item>

            {/* Overview name */}
            <Form.Item
              label={<span className="text-[12px]">Tổng quan khóa học</span>}
              name="overview_name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tổng quan khóa học!",
                },
              ]}
            >
              <Input
                className="custom-input"
                placeholder="Nhập tổng quan khóa học"
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                className="custom-btn w-full"
              >
                Xác nhận thêm
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default BoxAddCourseOverview;
