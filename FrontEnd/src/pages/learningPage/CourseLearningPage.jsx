import React, { useMemo, useState } from "react";
import { Tabs, Button, Breadcrumb, Spin, message } from "antd";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  BulbOutlined,
  CheckCircleFilled,
  UserOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  LockOutlined,
  RightOutlined,
} from "@ant-design/icons";
import useGetLearningCourseDetail from "../../hooks/useCourse/useGetLearningCourse";
import BoxQuizCardItem from "./BoxQuizCardItem/BoxQuizCardItem";
import useUpdateLearningProgress from "../../hooks/useCourse/useUpdateCourseCurrentLecture";
import useCompleteLecture from "../../hooks/useCourse/useCompleteLecture";

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const {
    data: courseData,
    isLoading,
    isError,
    refetch,
  } = useGetLearningCourseDetail(courseId);

  const course = courseData?.course;
  const progress = courseData?.progress;
  const overviews = courseData?.overviews || [];
  const requests = courseData?.requests || [];
  const sections = useMemo(
    () => courseData?.sections || [],
    [courseData?.sections],
  );
  const { mutate: updateLearningProgress } = useUpdateLearningProgress();
  const { mutate: completeLecture } = useCompleteLecture();
  // ID bài giảng user đang chọn trong phiên hiện tại
  const [selectedLectureId, setSelectedLectureId] = useState(null);

  // Hàm xử lý khi người dùng chọn video bài giảng
  function getEmbedUrl(url) {
    if (!url) return "";

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    return url;
  }

  const currentLecture = useMemo(() => {
    if (!sections.length) return null;

    const targetLectureId = selectedLectureId || progress?.current_lecture_id;
    if (!targetLectureId) return null;

    return (
      sections
        .flatMap((section) => section.lectures)
        .find((item) => item._id === targetLectureId) || null
    );
  }, [sections, selectedLectureId, progress?.current_lecture_id]);

  const currentVideo = useMemo(() => {
    if (currentLecture?.vid_lectures_url) {
      return getEmbedUrl(currentLecture.vid_lectures_url);
    }
    return getEmbedUrl(course?.video_url);
  }, [currentLecture, course?.video_url]);

  const handleSelectLecture = (section, lecture) => {
    if (!section.is_unlocked) {
      return message.error({
        content: (
          <>
            Bài giảng chưa mở khóa.
            <br />
            Vui lòng hoàn thành các bài giảng trước đó để mở khóa bài học này!
          </>
        ),
      });
    }

    setSelectedLectureId(lecture._id);

    // Lưu bài giảng đang học
    updateLearningProgress({
      courseId: course._id,
      lectureId: lecture._id,
    });

    // Nếu có video và chưa hoàn thành thì đánh dấu hoàn thành
    if (lecture.vid_lectures_url && !lecture.is_completed) {
      completeLecture(
        {
          courseId: course._id,
          lectureId: lecture._id,
        },
        {
          onSuccess: () => {
            lecture.is_completed = true; // cập nhật UI ngay
          },
          onError: () => {
            message.error("Không thể cập nhật tiến độ");
          },
        },
      );
    }
  };
  // CSS dùng chung cho hiệu ứng Glassmorphism và Scrollbar
  const customStyles = `
    .glass-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226, 232, 240, 0.5);
    }
    .dark .glass-card {
        background: rgba(33, 49, 69, 0.7);
        border-color: rgba(70, 69, 85, 0.3);
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #c7c4d8;
        border-radius: 10px;
    }
    .video-container {
        aspect-ratio: 16/9;
        background: #020617;
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
  `;

  // Nếu đang gọi API
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff]">
        <Spin size="large" description="Đang tải dữ liệu khóa học..." />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff]">
        <p className="text-on-surface-variant">
          Không thể tải khóa học hoặc khóa học không tồn tại.
        </p>
      </div>
    );
  }

  const overviewContent = (
    <div className="pt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Takeaways */}
        <div className="glass-card p-4 rounded-xl">
          <h3 className="text-sm font-medium tracking-wide text-primary mb-2 flex items-center gap-2">
            <BulbOutlined className="text-[18px]" /> Tổng quan về khóa học
          </h3>
          <ul className="text-sm text-on-surface-variant space-y-2">
            {overviews.map((overview) => (
              <li key={overview._id} className="flex items-start gap-2">
                <CheckCircleFilled className="text-secondary text-[16px] mt-0.5" />{" "}
                {overview.overview_name}
              </li>
            ))}
          </ul>
        </div>
        {/* Instructor */}
        <div className="glass-card p-4 rounded-xl">
          <h3 className="text-sm font-medium tracking-wide text-primary mb-2 flex items-center gap-2">
            <UserOutlined className="text-[18px]" /> Instructor
          </h3>
          <div className="flex items-center gap-4">
            <img
              alt="Instructor Profile"
              className="h-12 w-12 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQfLdiRmLgEIH3_MUTbTiJTUAiygf_fhKIJcibFgXWpPbVbDPJH7eP_2o4uFh-CDzkQ6QFqeZAYt7HTWfW_Adb4OToLRcRRMXpV-jXtYyQs7GlUKgG0Qqx_SZhgmSIr7SfqhwnPEBbbIaLkAOjtpDPEdLP_qahGoyFIAV2fE7CiTK2LWR_gEu9vBoegljjY_o1EL3N4J2-eBQgvh9qGoN2xh3slUzr_52zYQecXG_P5rAl2AiyP-iR-kJCtN9MeimdcxGxBN1z4-o"
            />
            <div>
              <p className="text-sm font-medium tracking-wide text-on-surface">
                {course.provider_name}
              </p>
              <p className="text-sm text-on-surface-variant">
                Giảng viên cung cấp khóa học
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const requestsContent = (
    <div className="pt-4 space-y-4">
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-sm font-medium tracking-wide text-primary mb-2 flex items-center gap-2">
          <BulbOutlined className="text-[18px]" /> Yêu cầu khóa học
        </h3>
        <ul className="text-sm text-on-surface-variant space-y-2">
          {requests.map((req) => (
            <li key={req._id} className="flex items-start gap-2">
              <CheckCircleFilled className="text-secondary text-[16px] mt-0.5" />{" "}
              {req.request_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Items cho ANTD Tabs
  const tabItems = [
    { key: "overview", label: "Tổng quan", children: overviewContent },
    { key: "request", label: "Yêu cầu", children: requestsContent },
    {
      key: "description",
      label: "Mô tả",
      children: (
        <div className="pt-4 text-on-surface-variant">{course.description}</div>
      ),
    },
  ];

  // Tính toán phần trăm tiến độ
  const completedLecturesCount = progress?.completed_lecture_ids?.length || 0;
  const totalLecturesCount = course.total_lectures || 1;
  const progressPercentage = Math.round(
    (completedLecturesCount / totalLecturesCount) * 100,
  );

  // Format ngày upload
  const formattedDate = new Date(course.updatedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-[#f8f9ff] text-on-surface text-base font-normal transition-colors duration-300 min-h-screen font-sans">
      <style>{customStyles}</style>

      <div className="pt-24 pb-8 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LECTURE CANVAS (LEFT SIDE) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-2">
              <Breadcrumb
                items={[
                  {
                    title: (
                      <Link
                        to="#"
                        className="flex items-center text-primary text-sm font-medium hover:underline group"
                      >
                        <ArrowLeftOutlined className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Quản lý khóa học của tôi
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <span className="text-on-surface-variant text-sm font-medium">
                        {course.course_title}
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            {/* Immersive Video Player */}
            <div className="aspect-video max-h-125 w-full flex items-center justify-center bg-gray-100 ">
              {currentVideo ? (
                <iframe
                  className="w-full h-full"
                  key={currentVideo}
                  src={currentVideo}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <p className="text-gray-400 text-sm font-semibold">
                  Chưa có video
                </p>
              )}
            </div>

            {/* Video Metadata */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold leading-tight text-on-surface">
                  {course.course_title}
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  Uploaded {formattedDate} • {course.category_name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  icon={<ShareAltOutlined />}
                  size="large"
                  className="rounded-xl border-outline-variant text-sm font-medium hover:bg-surface-container"
                >
                  Chia sẻ
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="large"
                  className="rounded-xl bg-secondary-container border-none text-on-secondary-container text-sm font-medium hover:opacity-90"
                >
                  Tải xuống
                </Button>
              </div>
            </div>

            {/* ANTD Tabs Section */}
            <div className="mt-8">
              <Tabs
                defaultActiveKey="overview"
                items={tabItems}
                tabBarStyle={{
                  borderColor: "rgba(199, 196, 216, 0.3)",
                  marginBottom: "0",
                }}
              />
            </div>
          </div>

          {/* SIDEBAR CONTENT (RIGHT SIDE) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-2xl overflow-hidden sticky top-24 flex flex-col h-[calc(100vh-140px)]">
              <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
                <div>
                  <h2 className="text-sm font-medium tracking-wide text-on-surface">
                    Nội dung khóa học
                  </h2>
                  <p className="text-xs font-semibold text-on-surface-variant">
                    Đã hoàn thành {progressPercentage}% •{" "}
                    {completedLecturesCount}/{totalLecturesCount} bài giảng
                  </p>
                </div>
                <Button
                  type="text"
                  icon={<FilterOutlined className="text-xl text-outline" />}
                />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {sections.map((section, index) => (
                  <React.Fragment key={section._id}>
                    {/* Header Module */}
                    <div className="pt-4 pb-2 px-4">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Module {index + 1}: {section.chapter_title}
                      </p>
                    </div>

                    {/* Danh sách Lectures */}
                    {section.lectures.map((lecture) => {
                      const isUnlocked = section.is_unlocked;
                      const isCompleted = lecture.is_completed;
                      const isCurrent = currentLecture?._id === lecture._id;

                      let icon;

                      if (!isUnlocked) {
                        icon = (
                          <LockOutlined className="text-outline text-[20px]" />
                        );
                      } else if (isCompleted) {
                        icon = (
                          <CheckCircleFilled className="text-green-500 text-[20px]" />
                        );
                      } else {
                        icon = (
                          <PlayCircleOutlined className="text-outline text-[20px]" />
                        );
                      }

                      return (
                        <div
                          key={lecture._id}
                          onClick={() => handleSelectLecture(section, lecture)}
                          className={`
                              flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer
                              ${!isUnlocked ? "opacity-70" : ""}
                              ${
                                isCurrent
                                  ? "bg-primary-container/20 border border-primary"
                                  : "hover:bg-primary-container/10"
                              }
                            `}
                        >
                          {icon}

                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !isUnlocked ? "text-outline" : ""
                              }`}
                            >
                              {lecture.title}
                            </p>

                            <p className="text-xs font-semibold text-on-surface-variant">
                              {lecture.duration}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-3 space-y-3">
                      {section.quizzes.map((quiz) => (
                        <BoxQuizCardItem
                          key={quiz._id}
                          quiz={quiz}
                          refetch={refetch}
                        />
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="p-4 bg-surface-container">
                <Button
                  size="large"
                  className="w-full bg-primary text-on-primary rounded-xl text-sm font-medium tracking-wide h-12 transition-all duration-300 ease-in-out hover:opacity-90 border-none flex items-center justify-center"
                >
                  Next Lesson <RightOutlined />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
