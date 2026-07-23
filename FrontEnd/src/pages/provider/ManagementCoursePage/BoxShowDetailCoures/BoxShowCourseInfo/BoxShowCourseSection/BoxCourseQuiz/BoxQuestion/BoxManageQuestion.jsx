import { useState } from "react";
import { Drawer, Button, Empty, Spin, Space, Typography } from "antd";
import { FileTextOutlined, ReloadOutlined } from "@ant-design/icons";

import BoxQuestionCard from "./BoxQuestionCard";
import BoxAddQuestion from "./BoxAddQuestion";

import useGetQuestionByQuiz from "../../../../../../../../hooks/useCourse/quizz/useGetQuestionByQuiz";
import useLoading from "../../../../../../../../hooks/useCourse/useLoading";
const { Title, Text } = Typography;

const BoxManageQuestion = ({ quiz }) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetQuestionByQuiz(
    quiz._id,
  );
  const loading = useLoading(isFetching, 300);
  return (
    <>
      <Button
        type="primary"
        icon={<FileTextOutlined />}
        onClick={() => setOpen(true)}
      >
        Quản lý câu hỏi
      </Button>

      <Drawer
        open={open}
        size={600}
        destroyOnHidden
        title={
          <div>
            <Title level={4} style={{ marginBottom: 2 }}>
              Tiêu đề: {data?.title}
            </Title>

            <Text type="secondary">Mô tả: {data?.description}</Text>
          </div>
        }
        onClose={() => setOpen(false)}
      >
        {/* Header */}

        <div className="flex justify-between mb-6">
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={refetch}
            loading={loading}
          >
            Làm mới
          </Button>

          <BoxAddQuestion quizId={data?._id} refetch={refetch} />
        </div>

        {/* Loading */}

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        )}

        {/* Empty */}

        {!isLoading && data?.questions.length === 0 && (
          <Empty description="Quiz chưa có câu hỏi" />
        )}

        {/* List */}

        {!isLoading && data?.questions.length > 0 && (
          <Space orientation="vertical" size={16} className="w-full">
            {data?.questions.map((question) => (
              <BoxQuestionCard
                key={question._id}
                question={question}
                refetch={refetch}
              />
            ))}
          </Space>
        )}
      </Drawer>
    </>
  );
};

export default BoxManageQuestion;
