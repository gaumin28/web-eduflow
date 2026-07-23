import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
  Radio,
  Card,
  Divider,
  notification,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import useUpdateQuestionQuiz from "../../../../../../../../hooks/useCourse/quizz/useUpdateQuestionQuiz";

const { Title } = Typography;

const labels = ["A", "B", "C", "D"];

const BoxEditQuestion = ({ question, refetch }) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const { mutate: updateQuestion, isPending } = useUpdateQuestionQuiz();

    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (open && question) {
            form.setFieldsValue({
                question: question.question,
                correctAnswer: question.answers.findIndex(
                    item => item.is_correct
                ),
                answers: question.answers.map(
                    item => item.answer_text
                ),
            });
        }
    }, [open, question, form]);

    const handleUpdate = (values) => {
        const payload = {
        question: values.question,
        answers: labels.map((_, index) => ({
            answer_text: values.answers[index],
            is_correct: values.correctAnswer === index,
        })),
        };

        updateQuestion(
        {
            questionId: question._id,
            payload,
        },
        {
            onSuccess: () => {
            notification.success({
                title: "Thành công",
                description: "Cập nhật câu hỏi thành công!",
            });

            setOpen(false);
            form.resetFields();
            refetch?.();
            },

            onError: (error) => {
            notification.error({
                title: "Thất bại",
                description:
                error?.response?.data?.message ||
                "Không thể cập nhật câu hỏi",
            });
            },
        }
        );
    };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        onClick={handleOpen}
      >
        Sửa
      </Button>

      <Modal
        open={open}
        width={700}
        footer={null}
        destroyOnHidden
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
      >
        <Title level={4}>
          Cập nhật câu hỏi
        </Title>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Câu hỏi"
            name="question"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập câu hỏi",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập câu hỏi..."
            />
          </Form.Item>

          <Form.Item
            label="Đáp án đúng"
            name="correctAnswer"
            rules={[
              {
                required: true,
                message: "Chọn đáp án đúng",
              },
            ]}
          >
            <Radio.Group>
              {labels.map((label, index) => (
                <Radio
                  key={label}
                  value={index}
                >
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Divider />

          <div className="grid grid-cols-2 gap-3">
            {labels.map((label, index) => (
              <Card
                key={label}
                size="small"
              >
                <Form.Item
                  label={`Đáp án ${label}`}
                  name={["answers", index]}
                  className="mb-0"
                  rules={[
                    {
                      required: true,
                      message: `Nhập đáp án ${label}`,
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder={`Nhập đáp án ${label}`}
                  />
                </Form.Item>
              </Card>
            ))}
          </div>

          <Button
            htmlType="submit"
            loading={isPending}
            type="primary"
            className="w-full"
          >
            Cập nhật câu hỏi
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoxEditQuestion;