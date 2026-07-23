import { message, Popconfirm } from "antd";
import CloseIcon from "../../../../../../components/icons/CloseIcon";

import BoxAddCourseOverview from "./BoxAddCourseOverview/BoxAddCourseOverview";
import BoxEditCourseOverview from "./BoxEditCourseOverview/BoxEditCourseOverview";
import useDeleteCourseOverview from "../../../../../../hooks/useCourse/useDeleteCourseOverview";

const BoxShowCourseOverview = ({ courseId, showCourse, refetch }) => {
  const { mutate: deleteOverview, isPending } = useDeleteCourseOverview();

  const handleDelete = (overviewId) => {
    deleteOverview(
      {
        courseId,
        overviewId,
      },
      {
        onSuccess: (data) => {
          message.success(data?.message || "Xóa tổng quan thành công");
          refetch();
        },
        onError: (error) => {
          message.error(
            error?.response?.data?.message || "Xóa tổng quan thất bại",
          );
        },
      },
    );
  };

  return (
    <div className="tab-content rounded-b-[15px] px-4 mb-4 overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div className="border-l-[3px] border-l-[#4F46E5] pl-2">
          <h2 className="font-semibold text-[#989898] text-[18px]">
            Tổng quan về khóa học
          </h2>
        </div>
        <BoxAddCourseOverview courseId={courseId} refetch={refetch} />
      </div>
      <div
        className="
                    text-[#000000] text-[12px] 
                    md:text-[14px] lg:text-[16px] font-sans text-justify
                "
      >
        {(!showCourse || showCourse.length === 0) && (
          <div
            className="
                        border-dashed border border-[#d4d4d4]
                        py-6 px-4 rounded-[10px]
                        text-center text-gray-400 italic
                    "
          >
            Chưa có thông tin tổng quan
          </div>
        )}

        {showCourse &&
          showCourse.length > 0 &&
          [...(showCourse || [])].reverse().map((item) => (
            <div
              key={item._id}
              className="
                                border-dashed border border-[#d4d4d4]
                                py-2 my-2 px-8 rounded-[10px]
                                transform transition duration-300 ease-in-out
                                hover:border-[#4F46E5] hover:text-[#4F46E5]
                            "
            >
              <div className="flex justify-between items-center py-2">
                {item.overview_name}

                <div className="flex items-center ">
                  <BoxEditCourseOverview
                    overview={item}
                    courseId={courseId}
                    refetch={refetch}
                  />

                  <Popconfirm
                    title="Xóa tổng quan khóa học"
                    description="Bạn có chắc chắn muốn xóa mục này không?"
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{
                      loading: isPending,
                      danger: true,
                    }}
                    placement="left"
                    onConfirm={() => handleDelete(item._id)}
                  >
                    <button
                      className="
                                            text-red-500 hover:text-red-700 transition p-2 group
                                            hover:bg-[#ffd5bf] rounded-[5px]
                                            hover:scale-95 hover:opacity-65
                                        "
                    >
                      <CloseIcon
                        size={18}
                        className="group-hover:scale-125 group-hover:fill-red-500"
                      />
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BoxShowCourseOverview;
