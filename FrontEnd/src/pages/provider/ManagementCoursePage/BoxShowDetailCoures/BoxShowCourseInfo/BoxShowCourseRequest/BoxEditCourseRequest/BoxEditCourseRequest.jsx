import { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import EditCourseIcon from "../../../../../../../components/icons/EditCourseIcon";
import useUpdateCourseRequest from "../../../../../../../hooks/useCourse/useUpdateCourseRequest";

const BoxEditCourseRequest = ({ request, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { mutate: updateRequest, isLoading } = useUpdateCourseRequest();

  const showModal = () => {
    setOpen(true);
    form.setFieldsValue({
      _id: request._id,
      request_name: request.request_name,
    });
  };

  const handleSubmit = (values) => {
    updateRequest(
      {
        requestId: request._id,
        request_name: values.request_name,
      },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Cập nhật yêu cầu khóa học thành công",
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
          text-blue-500 hover:text-blue-700 transition p-2 group
          duration-300 ease-in-out hover:bg-[#ffd5bf] rounded-[5px]
          hover:scale-105 hover:opacity-65 cursor-pointer
        "
      >
        <EditCourseIcon
          size={18}
          className="group-hover:scale-125 group-hover:fill-blue-500"
        />
      </button>

      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <h1 className="text-[20px] font-semibold mb-4">
          Chỉnh sửa yêu cầu khóa học
        </h1>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item label={<span className="text-[12px]">Mã</span>} name="_id">
            <Input disabled className="custom-input" />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Yêu cầu khóa học</span>}
            name="request_name"
            rules={[
              { required: true, message: "Vui lòng nhập yêu cầu khóa học!" },
            ]}
          >
            <Input
              className="custom-input"
              placeholder="Nhập yêu cầu khóa học"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={isLoading}
              className=" w-full"
              style={{ backgroundColor: "#3525CD", color: "#ffffff" }}
            >
              Xác nhận cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BoxEditCourseRequest;
