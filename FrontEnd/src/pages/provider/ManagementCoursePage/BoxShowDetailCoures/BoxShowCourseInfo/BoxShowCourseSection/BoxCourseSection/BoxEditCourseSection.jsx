import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { useParams } from "react-router-dom";
import useUpdateCourseSection from "../../../../../../../hooks/useCourse/useUpdateCourseSection";
import EditCourseIcon from "../../../../../../../components/icons/EditCourseIcon";

const BoxEditCourseSection = ({ section, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { id: courseId } = useParams();
  const { mutate: updateSection, isPending } = useUpdateCourseSection();

  useEffect(() => {
    if (open && section) {
      form.setFieldsValue({
        chapter_title: section.chapter_title,
        duration: section.duration,
      });
    }
  }, [open, section, form]);

  const onSubmit = (values) => {
    updateSection(
      {
        courseId,
        sectionId: section._id,
        payload: values,
      },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Cập nhật section thành công!",
          });
          setOpen(false);
          refetch?.();
        },
        onError: (error) => {
          notification.error({
            title: "Thất bại",
            description:
              error?.response?.data?.message || "Cập nhật section thất bại",
          });
        },
      },
    );
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(true)}
        className="
                text-blue-500 hover:text-blue-700 transition p-2 group
            duration-300 ease-in-out hover:bg-[#3525CD] rounded-[5px]
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

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
        style={{ zIndex: 1000 }}
      >
        <h2 className="text-[18px] font-semibold mb-3">
          Sửa bài học / Section
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Tên bài học"
            name="chapter_title"
            rules={[{ required: true, message: "Nhập tên bài học" }]}
          >
            <Input placeholder="Nhập tên bài học" />
          </Form.Item>

          <Form.Item
            label="Thời gian"
            name="duration"
            rules={[{ required: true, message: "Nhập thời gian" }]}
          >
            <Input placeholder="VD: 10 phút" />
          </Form.Item>

          <Button
            htmlType="submit"
            loading={isPending}
            className="w-full bg-[#3525CD] text-white"
            style={{ backgroundColor: "#3525CD", color: "#ffffff" }}
          >
            Lưu thay đổi
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default BoxEditCourseSection;
