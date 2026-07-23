import { useState } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import usePostQuestionCourse from "../../../../../../../../hooks/useCourse/quizz/usePostQuestionCourse";


const { Title } = Typography;

const labels = ["A", "B", "C", "D"];

const BoxAddQuestion = ({ quizId, refetch }) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const { mutate: addQuestion, isPending } = usePostQuestionCourse();


  const handleAdd = (values) => {

      const labels = ["A", "B", "C", "D"];

      const payload = {
        quiz_id: quizId,
        question: values.question,

        answers: labels.map((_, index) => ({
          answer_text: values.answers[index],
          is_correct: values.correctAnswer === index,
        })),
      };

      addQuestion(payload, {
        onSuccess: () => {

          notification.success({
            message: "Thành công",
            description: "Thêm câu hỏi thành công!",
          });

          form.resetFields();
          setOpen(false);
          refetch?.();
        },

        onError: (error) => {

          notification.error({
            message: "Thất bại",
            description:
              error?.response?.data?.message ||
              "Không thể thêm câu hỏi",
          });

        },
    });
  };
  

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      >
        Thêm câu hỏi
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
          Thêm câu hỏi
        </Title>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{
            correctAnswer: 0,
          }}
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

          <div 
            className="grid grid-cols-2 gap-3"
          >
            {labels.map((label, index) => (
              <Card
                key={label}
                size="small"
                className="mb-3 "
              >
                <Form.Item
                  label={`Đáp án ${label}`}
                  name={["answers", index]}
                  rules={[
                    {
                      required: true,
                      message: `Nhập đáp án ${label}`,
                    },
                  ]}
                  className="mb-0 p-0 w-full"
                >
                  <Input.TextArea
                    rows={1}
                    placeholder={`Nhập đáp án ${label}`}
                  />
                </Form.Item>
              </Card>
            ))}
          </div>

          <Button
            htmlType="submit"
            loading={isPending}
            className="w-full"
            style={{
              background: "#3525CD",
              color: "#fff",
            }}
          >
            Thêm câu hỏi
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoxAddQuestion;