import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Modal,
  Radio,
  Space,
  Typography,
  notification,
} from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

import useGetQuizForStudent from "../../../hooks/useCourse/quizz/useGetQuizForStudent";
import useSubmitQuiz from "../../../hooks/useCourse/quizz/useSubmitQuiz";

const { Title, Text } = Typography;

const BoxModalQuizzQuestion = ({ quiz, refetch }) => {
  const [open, setOpen] = useState(false);

  const { data: quizDetail, isLoading } = useGetQuizForStudent(quiz._id, open);

  const { mutate: submitQuiz, isPending } = useSubmitQuiz();

  // {questionId : answerId}
  const [answers, setAnswers] = useState({});

  // kết quả sau khi submit
  const [result, setResult] = useState(null);

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const handleChooseAnswer = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleOpen = () => {
    setAnswers({});
    setResult(null);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (answeredCount < quizDetail?.total_questions) {
      return notification.warning({
        title: "Chưa hoàn thành",
        description: "Vui lòng trả lời tất cả câu hỏi trước khi nộp bài.",
      });
    }

    submitQuiz(
      {
        quizId: quiz._id,
        answers,
      },
      {
        onSuccess: async (res) => {
          setResult(res.data);

          if (res.data.passed) {
            await refetch();
          }

          notification.success({
            title: res.data.passed
              ? "🎉 Chúc mừng! Bạn đã vượt qua bài quiz."
              : "❌ Bạn chưa vượt qua bài quiz.",
          });
        },

        onError: (error) => {
          notification.error({
            title: "Nộp bài thất bại",
            description: error?.response?.data?.message || "Đã xảy ra lỗi.",
          });
        },
      },
    );
  };

  return (
    <>
      <Button
        type={quiz.is_completed ? "default" : "primary"}
        onClick={handleOpen}
      >
        {quiz.is_completed ? "Làm lại" : "Làm bài"}
      </Button>

      <Modal
        open={open}
        width={700}
        centered
        destroyOnHidden
        onCancel={() => setOpen(false)}
        title={
          <div className="text-center">
            <Title level={4}>Ôn tập Quiz - {quiz.title}</Title>

            <Text type="secondary">
              Đã trả lời {answeredCount}/{quizDetail?.total_questions} câu
            </Text>
          </div>
        }
        footer={[
          <Button key="close" onClick={() => setOpen(false)}>
            Đóng
          </Button>,

          !result && (
            <Button
              key="submit"
              type="primary"
              loading={isPending}
              onClick={handleSubmit}
            >
              Nộp bài
            </Button>
          ),
        ]}
      >
        {result && (
          <Card
            className={`mb-5 ${
              result.passed
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <Title level={5}>
              {result.passed
                ? "🎉 Chúc mừng! Bạn đã vượt qua bài quiz."
                : "❌ Bạn chưa đạt. Hãy thử lại."}
            </Title>

            <Text>
              Đúng {result.correctCount}/{result.totalQuestions} câu
            </Text>
          </Card>
        )}

        <Space orientation="vertical" size={20} className="w-full">
          {quizDetail?.questions?.map((question) => (
            <Card
              key={question._id}
              size="small"
              className="shadow-sm rounded-xl"
            >
              <Title level={5}>
                Câu {question.order}. {question.question}
              </Title>

              <Divider />

              <Radio.Group
                className="w-full"
                disabled={!!result}
                value={answers[question._id]}
                onChange={(e) =>
                  handleChooseAnswer(question._id, e.target.value)
                }
              >
                <Space orientation="vertical" className="w-full">
                  {question.answers.map((answer) => {
                    const questionResult = result?.answers?.[question._id];

                    const isCorrect =
                      questionResult?.correctAnswerId === answer._id;

                    const isWrong =
                      questionResult?.userAnswerId === answer._id &&
                      !questionResult?.isCorrect;

                    return (
                      <div
                        key={answer._id}
                        className={`flex justify-between items-center rounded-lg border px-4 py-3 transition
                          ${
                            isCorrect
                              ? "bg-green-50 border-green-500"
                              : isWrong
                                ? "bg-red-50 border-red-500"
                                : "border-gray-200"
                          }`}
                      >
                        <Radio value={answer._id}>
                          <b>{answer.answer_label}.</b> {answer.answer_text}
                        </Radio>

                        {isCorrect && (
                          <CheckCircleFilled className="text-green-600 text-lg" />
                        )}

                        {isWrong && (
                          <CloseCircleFilled className="text-red-600 text-lg" />
                        )}
                      </div>
                    );
                  })}
                </Space>
              </Radio.Group>
            </Card>
          ))}
        </Space>
      </Modal>
    </>
  );
};

export default BoxModalQuizzQuestion;
