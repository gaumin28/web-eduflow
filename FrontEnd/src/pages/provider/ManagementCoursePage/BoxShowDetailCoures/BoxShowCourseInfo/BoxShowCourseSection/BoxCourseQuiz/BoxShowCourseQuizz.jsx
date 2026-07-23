import {
  Card,
  Button,
  Typography,
  Space,
  Popconfirm,
  notification,
} from "antd";
import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import BoxEditCourseQuiz from "./BoxEditCourseQuiz";
import BoxManageQuestion from "./BoxQuestion/BoxManageQuestion";
import useDeleteQuizz from "../../../../../../../hooks/useCourse/quizz/useDeleteQuizz";

const { Title, Paragraph } = Typography;

const BoxShowCourseQuiz = ({ quiz, refetch }) => {
  const { mutate: deleteQuizz, isPending } = useDeleteQuizz();
  return (
    <Card size="small" className="mt-3 border border-blue-200 bg-blue-50">
      <Space orientation="vertical" className="w-full">
        <Title level={5} className="mb-0!">
          <FileTextOutlined /> Tiêu đề quiz:{" "}
          <span className="text-[20px] font-bold">{quiz.title}</span>
        </Title>

        <Paragraph className="mb-2! ml-5! text-gray-500">
          Mô tả:{" "}
          <span className="text-[15px] font-semibold">{quiz.description}</span>
        </Paragraph>

        <Space>
          <BoxManageQuestion quiz={quiz} refetch={refetch} />

          <BoxEditCourseQuiz quiz={quiz} refetch={refetch} />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa quiz?"
            description="Toàn bộ câu hỏi của quiz sẽ bị xóa."
            okText="Xóa"
            cancelText="Hủy"
            placement="topLeft"
            okButtonProps={{
              danger: true,
              loading: isPending,
            }}
            onConfirm={() =>
              deleteQuizz(quiz._id, {
                onSuccess: (data) => {
                  notification.success({
                    message: "Thành công",
                    description: data.message,
                  });

                  refetch();
                },
                onError: (error) => {
                  notification.error({
                    message: "Thất bại",
                    description:
                      error?.response?.data?.message || "Xóa quiz thất bại",
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
      </Space>
    </Card>
  );
};

export default BoxShowCourseQuiz;
