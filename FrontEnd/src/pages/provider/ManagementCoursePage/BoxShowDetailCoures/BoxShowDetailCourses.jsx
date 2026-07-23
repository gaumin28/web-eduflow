import { useState } from "react";
import { Tabs } from "antd";
import { Link, useParams } from "react-router-dom";
import ChevronLeftIcon from "../../../../components/icons/ChevronLeftIcon";
import useGetCourseDetail from "../../../../hooks/useCourse/useGetCourseDetail";
import BoxShowCourseInfo from "./BoxShowCourseInfo/BoxShowCourseInfo";
import BoxShowCourseOverview from "./BoxShowCourseInfo/BoxShowCourseOverview/BoxShowCourseOverview";
import BoxShowCourseSection from "./BoxShowCourseInfo/BoxShowCourseSection/BoxShowCourseSection";
import BoxShowCourseRequest from "./BoxShowCourseInfo/BoxShowCourseRequest/BoxShowCourseRequest";

export default function ProviderCourseDetailManagementPage() {
  // Cấu hình Tabs cho Ant Design
  const [activeTab, setActiveTab] = useState("1");
  const { id: courseId } = useParams();
  const {
    data: showCourse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetCourseDetail(courseId);

  if (isLoading) return <>Loading...</>;
  if (error) return <>Error: {error.message}</>;
  if (!showCourse) return null;

  const items = [
    {
      key: "1",
      label: "Thông Tin Khóa Học",
      children: (
        <BoxShowCourseInfo
          courseId={courseId}
          showCourse={showCourse}
          refetch={refetch}
        />
      ),
    },
    {
      key: "2",
      label: "Tổng quan bài học",
      children: (
        <BoxShowCourseOverview
          courseId={courseId}
          showCourse={showCourse.overviews}
          refetch={refetch}
        />
      ),
    },
    {
      key: "3",
      label: "Nội dung bài học",
      children: (
        <BoxShowCourseSection
          courseId={courseId}
          showCourse={showCourse.sections}
          refetch={refetch}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      ),
    },
    {
      key: "4",
      label: "Yêu cầu",
      children: (
        <BoxShowCourseRequest
          courseId={courseId}
          showCourse={showCourse.requests}
          refetch={refetch}
        />
      ),
    },
  ];

  return (
    <div
      className="
        h-full w-full overflow-y-auto overflow-x-hidden text-[#0b1c30] bg-[#f8f9ff] 
        font-['Inter',sans-serif] antialiased selection:bg-primary-container selection:text-on-primary-container 
      "
    >
      <div className="w-full mx-auto py-2.5 grow">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-3">
          <Link
            to="/provider/courses"
            className="text-blue-500 hover:underline text-sm mb-2 inline-block"
          >
            <button
              type="button"
              className="
                      flex items-center gap-1
                      bg-gray-200 text-gray-700 p-1 rounded-full transition duration-300 ease-in-out
                      hover:scale-95 hover:opacity-65 cursor-pointer
                  "
            >
              <ChevronLeftIcon size={30} />
            </button>
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold ">
            Chi tiết khóa học
          </h1>
        </div>
        <h1 className="font-['Geist'] text-[22px] font-semibold text-[#0b1c30] leading-[1.2] tracking-[-0.01em] mb-3">
          {showCourse.course.course_title}
        </h1>
        {/* Tabs Section */}
        <div className="mb-[32px]">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
            className=" custom-tabs bg-white p-4 rounded-lg shadow"
          />
        </div>
      </div>
    </div>
  );
}
