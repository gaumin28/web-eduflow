import { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import usePostCourseRequest from "../../../../../../../hooks/useCourse/usePostCourseRequest";

const BoxAddCourseRequest = ({ courseId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { mutate: addRequest, isPending } = usePostCourseRequest();

  const handleAdd = (values) => {
    addRequest(
      {
        courseId,
        payload: {
          request_name: values.request_name,
        },
      },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Thêm yêu cầu khóa học thành công",
          });
          setOpen(false);
          form.resetFields();
          refetch?.();
        },
        onError: (err) => {
          notification.error({
            title: "Thất bại",
            description: err?.response?.data?.message,
          });
        },
      }
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          bg-[#3525CD] text-white px-4 py-2 rounded
          transition duration-300 ease-in-out
          hover:scale-95 hover:opacity-65
        "
      >
        + Thêm yêu cầu khóa học
      </button>

      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <h1 className="text-[20px] font-semibold text-black mb-4">
          Thêm yêu cầu khóa học
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-[12px]">Yêu cầu khóa học</span>}
            name="request_name"
            rules={[
              { required: true, message: "Vui lòng nhập yêu cầu khóa học!" },
            ]}
          >
            <Input
              className="custom-input"
              placeholder="VD: Cần có kiến thức JavaScript cơ bản"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={isPending}
              className="custom-btn w-full"
              style={{backgroundColor:"#3525CD", color:"#ffffff"}}
            >
              Xác nhận thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BoxAddCourseRequest;