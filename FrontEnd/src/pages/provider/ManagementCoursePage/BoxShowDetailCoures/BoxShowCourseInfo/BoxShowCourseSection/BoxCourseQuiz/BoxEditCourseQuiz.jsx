import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useUpdateQuizzCourse from "../../../../../../../hooks/useCourse/quizz/useUpdateQuizzCourse";

const BoxEditCourseQuiz = ({ quiz, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate: updateQuiz, isPending } = useUpdateQuizzCourse();

  useEffect(() => {
    if (open && quiz) {
      form.setFieldsValue({
        title: quiz.title,
        description: quiz.description,
      });
    }
  }, [open, quiz, form]);

  const handleUpdate = (values) => {
    const payload = {
      title: values.title,
      description: values.description,
    };

    updateQuiz(
      {
        quizId: quiz._id,
        payload,
      },
      {
        onSuccess: () => {
          notification.success({
            message: "Thành công",
            description: "Cập nhật Quiz thành công!",
          });

          form.resetFields();
          setOpen(false);
          refetch?.();
        },

        onError: (error) => {
          const status = error?.response?.status;

          if (status === 401) {
            notification.error({
              message: "Phiên đăng nhập hết hạn",
            });

            localStorage.clear();
            navigate("/login");
            return;
          }

          notification.error({
            message: "Thất bại",
            description:
              error?.response?.data?.message || "Cập nhật Quiz thất bại",
          });
        },
      }
    );
  };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        onClick={() => setOpen(true)}
      >
        Sửa
      </Button>

      <Modal
        open={open}
        footer={null}
        destroyOnHidden
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
      >
        <h1 className="text-[20px] font-semibold text-[#000000] mb-4">
          Cập nhật Quiz
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-[12px]">Tên Quiz</span>}
            name="title"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên Quiz!",
              },
            ]}
          >
            <Input
              className="custom-input"
              placeholder="Nhập tên Quiz"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Mô tả</span>}
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả!",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả Quiz"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            loading={isPending}
            className="w-full"
            style={{
              backgroundColor: "#3525CD",
              color: "#fff",
            }}
          >
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoxEditCourseQuiz;