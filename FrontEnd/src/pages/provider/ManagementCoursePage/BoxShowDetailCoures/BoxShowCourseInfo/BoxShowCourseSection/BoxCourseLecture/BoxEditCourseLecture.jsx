import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Switch, notification } from "antd";

import useUpdateCourseLecture from "../../../../../../../hooks/useCourse/useUpdateLecture";
import EditCourseIcon from "../../../../../../../components/icons/EditCourseIcon";

const BoxEditCourseLecture = ({ lecture, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { mutate: updateLecture, isPending } = useUpdateCourseLecture();

  useEffect(() => {
    if (open && lecture) {
      form.setFieldsValue({
        title: lecture.title,
        duration: lecture.duration,
        vid_lectures_url: lecture.vid_lectures_url,
        preview: lecture.preview,
      });
    }
  }, [open, lecture, form]);

  const handleEdit = (values) => {
    updateLecture(
      {
        lectureId: lecture?._id,
        payload: values,
      },
      {
        onSuccess: () => {
          notification.success({
            title: "Thành công",
            description: "Cập nhật bài giảng thành công!",
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
        onClick={() => setOpen(true)}
        className="
                text-blue-500 hover:text-blue-700 transition p-2 
                duration-300 ease-in-out hover:bg-[#ffd5bf] rounded-[5px]
                    hover:opacity-65 cursor-pointer hover:scale-125
            "
      >
        <EditCourseIcon
          size={18}
          className="
                        group-hover:fill-blue-500
                "
        />
      </button>

      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <h1 className="text-[20px] font-semibold text-black">Sửa bài giảng</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-[12px]">Tên bài giảng</span>}
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tên bài giảng!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Thời lượng</span>}
            name="duration"
            rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
          >
            <Input placeholder="VD: 05:30" />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Video bài giảng (URL)</span>}
            name="vid_lectures_url"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Cho xem thử (preview)</span>}
            name="preview"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={isPending}
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

export default BoxEditCourseLecture;
