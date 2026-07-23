import {
  BarcodeOutlined,
  CalendarOutlined,
  HistoryOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Card, Divider } from "antd";

import BoxEditInfoCourse from "./BoxEditInfoCourse/BoxEditInfoCourse";

const BoxShowCourseInfo = ({ showCourse, refetch }) => {
  return (
    <div className="pt-4 pb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="border-l-[3px] border-l-[#4F46E5] pl-2">
          <h2 className="font-semibold text-[#4F46E5] text-[18px]">
            Thực hiện
          </h2>
        </div>

        <BoxEditInfoCourse course={showCourse.course} refetch={refetch} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Left Column: Media & Description */}
        <div className="lg:col-span-2">
          <div
            className="
                    border border-gray-200 rounded-[5px] p-4 h-auto bg-[#ffffff] overflow-hidden
                "
          >
            <div className="aspect-video h-full w-full flex items-center justify-center bg-gray-100 ">
              {showCourse?.course.video_url?.trim() ? (
                <iframe
                  className="w-full h-full"
                  src={showCourse.course.video_url}
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
          </div>

          {/* Description Section */}
          <section className="mt-3.75">
            <h2 className="font-['Geist'] text-[24px] font-semibold mb-4 flex items-center gap-2 text-[#0b1c30]">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Mô tả khóa học
            </h2>
            <div className="bg-[#ffffff] px-[32px] h-53.75 rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <p className="font-['Inter'] pt-[16px] text-[16px] text-on-surface-variant leading-relaxed line-clamp-7">
                {showCourse.course.description}
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: Course Stats Card */}
        <div className="lg:col-span-1 ">
          <Card
            className="bg-[#ffffff] rounded-xl border border-outline-variant/30 shadow-sm h-full"
            style={{ padding: "5px" }}
          >
            <h3 className="font-['Geist'] text-[24px] font-semibold text-[#0b1c30] ">
              Thông tin Khóa học
            </h3>
            <Divider />
            {/* Details List */}
            <div className="space-y-5">
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="font-['Geist'] text-[14px] font-medium text-on-surface-variant flex items-center gap-2">
                  <BarcodeOutlined className="text-[18px]" /> Course ID
                </span>
                <span className="font-['Geist'] text-[14px] font-bold text-[#0b1c30]">
                  {showCourse.course._id}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="font-['Geist'] text-[14px] font-medium text-on-surface-variant flex items-center gap-2">
                  <CalendarOutlined className="text-[18px]" /> Ngày tạo
                </span>
                <span className="font-['Geist'] text-[14px] font-medium text-[#0b1c30]">
                  {new Date(showCourse.course.createdAt).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="font-['Geist'] text-[14px] font-medium text-on-surface-variant flex items-center gap-2">
                  <HistoryOutlined className="text-[18px]" /> Cập nhật cuối
                </span>
                <span className="font-['Geist'] text-[14px] font-medium text-[#0b1c30]">
                  {new Date(showCourse.course.updatedAt).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="font-['Geist'] text-[14px] font-medium text-on-surface-variant flex items-center gap-2">
                  <AppstoreOutlined className="text-[18px]" /> Danh mục
                </span>
                <span className="font-['Geist'] text-[14px] font-bold text-primary">
                  Phát triển web
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="font-['Geist'] text-[14px] font-medium text-on-surface-variant flex items-center gap-2">
                  <UserOutlined className="text-[18px]" /> Giảng viên
                </span>
                <span className="font-['Geist'] text-[14px] font-medium text-[#0b1c30]">
                  {showCourse.course.provider_name}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="font-['Geist'] text-[14px] font-medium text-on-surface-variant flex items-center gap-2">
                  <TeamOutlined className="text-[18px]" /> Học viên
                </span>
                <span className="font-['Geist'] text-[14px] font-bold text-[#0b1c30]">
                  {showCourse.course.students}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-['Geist'] text-[14px] font-medium text-on-surface-variant flex items-center gap-2">
                  <ClockCircleOutlined className="text-[18px]" /> Thời lượng
                </span>
                <span className="font-['Geist'] text-[14px] font-medium text-[#0b1c30]">
                  {showCourse.course.duration}
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col mt-5 border-t pt-5 border-t-[#d4d4d4] space-y-3">
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-medium text-on-surface-variant ">
                  Giá khóa học:
                </p>
                <span className="text-[#e70000] text-[20px] font-bold">
                  {showCourse.course.price === 0 ? (
                    <span className="text-green-400 font-semibold">Free</span>
                  ) : (
                    `${Number(showCourse.course.price).toLocaleString("vi-VN")} VND`
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-medium text-on-surface-variant ">
                  Giá giảm:
                </p>
                <span className="text-[#e70000] text-[20px] font-bold">
                  {showCourse.course.price_promotion === null ||
                  showCourse.course.price_promotion === 0 ? (
                    <span className="text-[#d8d8d8] font-semibold">—</span>
                  ) : (
                    `${Number(showCourse.course.price_promotion).toLocaleString("vi-VN")} VND`
                  )}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoxShowCourseInfo;
