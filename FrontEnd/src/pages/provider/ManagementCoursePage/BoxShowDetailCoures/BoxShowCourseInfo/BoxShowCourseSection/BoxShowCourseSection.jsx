import { Collapse, Space, Popconfirm, Spin, notification } from "antd";
import { CaretDownOutlined, ReloadOutlined } from "@ant-design/icons";
import BoxLesson from "./BoxLesson";

import CloseIcon from "../../../../../../components/icons/CloseIcon";
import BoxEditCourseSection from "./BoxCourseSection/BoxEditCourseSection";
import BoxAddCourseSection from "./BoxCourseSection/BoxAddCourseSection";
import BoxAddCourseLecture from "./BoxCourseLecture/BoxAddCourseLecture";
import useLoading from "../../../../../../hooks/useCourse/useLoading";
import useDeleteCourseSection from "../../../../../../hooks/useCourse/useDeleteCourseSection";
import BoxAddCourseQuiz from "./BoxCourseQuiz/BoxAddCourseQuiz";
import BoxShowCourseQuiz from "./BoxCourseQuiz/BoxShowCourseQuizz";

const BoxShowCourseSection = ({
  showCourse,
  courseId,
  refetch,
  isLoading,
  isFetching,

  onEditLecture,
  onDeleteLecture,
}) => {
  const sections = Array.isArray(showCourse) ? showCourse : [];
  const { mutate: deleteSection } = useDeleteCourseSection();

  const items = sections.map((section) => ({
    key: section._id,
    label: (
      <div className="flex justify-between items-start w-full px-13.75 py-2">
        {/* LEFT */}
        <div className="flex flex-col gap-1 text-[12px] lg:text-[14px]">
          <span className="font-semibold text-white">
            {section.chapter_title}
          </span>
          <div className="flex items-center gap-3 text-white text-[12px] opacity-90">
            <span>{section.lectures?.length || 0} bài giảng</span>
            <span>{section.duration}</span>
          </div>
        </div>

        {/* RIGHT */}
        <Space
          size="small"
          style={{ paddingRight: "15px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <BoxEditCourseSection section={section} />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa chương học?"
            description="Toàn bộ bài giảng trong chương sẽ bị xóa"
            onConfirm={() =>
              deleteSection(
                {
                  courseId,
                  sectionId: section._id,
                },
                {
                  onSuccess: () => {
                    notification.success({
                      title: "Thành công",
                      description: "Xóa chương học thành công!",
                    });
                    refetch();
                  },
                  onError: (error) => {
                    notification.error({
                      title: "Thất bại",
                      description:
                        error?.response?.data?.message ||
                        "Xóa chương học thất bại",
                    });
                  },
                },
              )
            }
          >
            <button
              className="
                  text-red-500 hover:text-red-700 transition p-2 group
                    duration-300 ease-in-out hover:bg-[#ffd5bf] rounded-[5px]
                    hover:scale-105 hover:opacity-65 cursor-pointer 
                "
            >
              <CloseIcon size={18} />
            </button>
          </Popconfirm>
        </Space>
      </div>
    ),

    children: (
      <div className="flex flex-col gap-2 px-13.75 py-3">
        {section.lectures?.length > 0 ? (
          section.lectures.map((lecture) => (
            <BoxLesson
              key={lecture._id}
              lecture={lecture}
              refetch={refetch}
              onEdit={() => onEditLecture?.(lecture, section)}
              onDelete={() => onDeleteLecture?.(lecture._id, section)}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400 italic ">Chưa có bài giảng!</p>
        )}

        <BoxAddCourseLecture sectionId={section._id} refetch={refetch} />
        {section.quizzes?.length > 0 ? (
          <BoxShowCourseQuiz quiz={section.quizzes[0]} refetch={refetch} />
        ) : (
          <BoxAddCourseQuiz sectionId={section._id} refetch={refetch} />
        )}
      </div>
    ),
  }));
  const loading = useLoading(isLoading || isFetching, 300);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-75">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      {/* HEADER – LÚC NÀO CŨNG HIỆN */}
      <div className="flex justify-end py-2 gap-4">
        <button
          onClick={refetch}
          disabled={isFetching}
          className="
            border border-dashed border-[#c8c8c8]
            px-3 py-2 rounded-[5px]
            transition
            hover:scale-95
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <ReloadOutlined spin={isFetching} /> Làm mới
        </button>
        <BoxAddCourseSection refetch={refetch} courseId={courseId} />
      </div>

      {/* NẾU CHƯA CÓ DỮ LIỆU */}
      {sections.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-md p-6 text-center bg-white mb-4">
          <p className="text-gray-400 italic">Chưa có thông tin chương học</p>
        </div>
      )}

      {/* NẾU CÓ DỮ LIỆU */}
      {sections.length > 0 && (
        <Collapse
          accordion
          items={items}
          defaultActiveKey={[items[0]?.key]}
          expandIconPlacement="start"
          expandIcon={({ isActive }) => (
            <CaretDownOutlined
              rotate={isActive ? 180 : 0}
              style={{ color: "white" }}
            />
          )}
          style={{ backgroundColor: "#1F2937", marginBottom: "15px" }}
        />
      )}
    </div>
  );
};

export default BoxShowCourseSection;
