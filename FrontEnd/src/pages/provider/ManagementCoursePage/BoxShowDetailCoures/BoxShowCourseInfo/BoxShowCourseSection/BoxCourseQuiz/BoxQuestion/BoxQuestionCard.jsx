import {
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Divider,
  Popconfirm,
  notification,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import useDeleteQuestion from "../../../../../../../../hooks/useCourse/quizz/useDeleteQuestion";
import BoxEditQuestion from "./BoxEditQuestion";

const { Title, Text } = Typography;

const BoxQuestionCard = ({ question, refetch }) => {
  const { mutate: deleteQuestion, isPending } = useDeleteQuestion();
  return (
    <Card
      hoverable
      className="shadow-sm"
      style={{
        borderRadius: 10,
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <Title level={5}>
            {question.order}. {question.question}
          </Title>

          <Divider style={{ margin: "12px 0" }} />

          <div className="space-y-3">
            {question.answers?.map((answer) => (
              <div
                key={answer._id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  answer.is_correct
                    ? "bg-green-50 border border-green-300"
                    : "bg-gray-50 border-[0.5px] border-gray-300 "
                }`}
              >
                <div>
                  <Text strong>{answer.answer_label}.</Text>

                  <Text className="ml-2">{answer.answer_text}</Text>
                </div>

                {answer.is_correct && <Tag color="green">Đáp án đúng</Tag>}
              </div>
            ))}
          </div>
        </div>

        <Space orientation="vertical">
          <BoxEditQuestion question={question} />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa câu hỏi?"
            description="Toàn bộ đáp án của câu hỏi sẽ bị xóa."
            okText="Xóa"
            cancelText="Hủy"
            placement="topLeft"
            okButtonProps={{
              danger: true,
              loading: isPending,
            }}
            onConfirm={() =>
              deleteQuestion(question._id, {
                onSuccess: (data) => {
                  notification.success({
                    title: "Thành công",
                    description: data.message,
                  });

                  refetch();
                },
                onError: (error) => {
                  notification.error({
                    title: "Thất bại",
                    description:
                      error?.response?.data?.message || "Xóa câu hỏi thất bại",
                  });
                },
              })
            }
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
};

export default BoxQuestionCard;
