import { useState } from "react";
import { Modal, Form, Input, Button, Switch, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import usePostCourseLecture from "../../../../../../../hooks/useCourse/usePostCourseLecture";

const BoxAddCourseLecture = ({ sectionId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { mutate: addLecture, isPending } = usePostCourseLecture();

  const handleAdd = (values) => {
    const payload = {
      title: values.title,
      duration: values.duration,
      vid_lectures_url: values.vid_lectures_url,
      preview: values.preview ?? false,
    };

    addLecture(
      { sectionId, payload },
      {
        onSuccess: (data) => {
          notification.success({
            title: "Thành công",
            description: "Thêm bài giảng thành công!",
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
      },
    );
  };

  return (
    <div className="mb-[8px]">
      <button
        onClick={() => setOpen(true)}
        className="
          mt-2 w-full flex items-center justify-center gap-2
          border border-dashed border-gray-500 transform transition duration-300
          text-gray-300 hover:text-blue-500 hover:scale-95
          hover:border-blue-500 cursor-pointer rounded-md py-2
        "
      >
        <PlusOutlined />
        <span>Thêm bài giảng</span>
      </button>

      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <h1 className="text-[20px] font-semibold text-black">Thêm bài giảng</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          autoComplete="off"
        >
          {/* KHÔNG required, chỉ hiển thị sectionId nếu muốn */}
          <Form.Item label={<span className="text-[12px]">Section ID</span>}>
            <Input disabled value={sectionId} />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Tên bài giảng</span>}
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tên bài giảng!" },
            ]}
          >
            <Input className="custom-input" placeholder="Nhập tên bài giảng" />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Thời lượng</span>}
            name="duration"
            rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
          >
            <Input className="custom-input" placeholder="VD: 05:30" />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Video bài giảng (URL)</span>}
            name="vid_lectures_url"
            rules={[
              { required: true, message: "Vui lòng nhập url video bài giảng!" },
            ]}
          >
            <Input
              className="custom-input"
              placeholder="Nhập url video bài giảng"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Cho xem thử (preview)</span>}
            name="preview"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={isPending}
              className=" w-full text-white"
              style={{ backgroundColor: "#3525CD", color: "#ffffff" }}
            >
              Xác nhận thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BoxAddCourseLecture;
