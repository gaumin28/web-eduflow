import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import EditCourseIcon from "../../../../../../../components/icons/EditCourseIcon";
import useUpdateCourseOverview from "../../../../../../../hooks/useCourse/useUpdateCourseOverview";

const BoxEditCourseOverview = ({ overview, courseId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { mutate: updateOverview, isPending } = useUpdateCourseOverview();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        overview_name: overview.overview_name,
      });
    }
  }, [open, overview, form]);

  const handleEdit = (values) => {
    updateOverview(
      {
        courseId,
        overviewId: overview._id,
        overview_name: values.overview_name,
      },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Cập nhật tổng quan khóa học thành công",
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
      }
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
                text-blue-500 hover:text-blue-700 transition p-2 group
            duration-300 ease-in-out hover:bg-[#ffd5bf] rounded-[5px]
            hover:scale-105 hover:opacity-65 cursor-pointer 
        " 
      >
          <EditCourseIcon 
              size={18}
              className="
                  group-hover:scale-125 group-hover:fill-blue-500
              "
          />
      </button>
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <h1 className="text-[20px] font-semibold text-black">
          Sửa tổng quan khóa học
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-[12px]">Tổng quan khóa học</span>}
            name="overview_name"
            rules={[
              { required: true, message: "Vui lòng nhập tổng quan khóa học!" },
            ]}
          >
            <Input placeholder="Nhập tổng quan khóa học" />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={isPending}
              type="primary"
              className="custom-btn w-full"
            >
              Xác nhận cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BoxEditCourseOverview;