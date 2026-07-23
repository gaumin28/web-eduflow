import { Popconfirm } from "antd";
import CloseIcon from "../../../../../../components/icons/CloseIcon.jsx";

import BoxAddCourseRequest from "./BoxAddCourseRequest/BoxAddCourseRequest.jsx";
import BoxEditCourseRequest from "./BoxEditCourseRequest/BoxEditCourseRequest.jsx";

const BoxShowCourseRequest = ({ courseId, showCourse, refetch }) => {
  return (
    <div className="tab-content rounded-b-[15px] px-4 mb-4 overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div className="border-l-[3px] border-l-[#3525CD] pl-2">
          <h2 className="font-semibold text-[#989898] text-[18px]">
            Yêu cầu về khóa học
          </h2>
        </div>
        <BoxAddCourseRequest refetch={refetch} courseId={courseId} />
      </div>
      <div
        className="
                    text-[#000000] text-[12px] 
                    md:text-[14px] lg:text-[16px] font-sans text-justify
                "
      >
        {(!showCourse || showCourse.length === 0) && (
          <p className="text-gray-400 italic text-center py-4">
            Chưa có yêu cầu nào cho khóa học này
          </p>
        )}

        {showCourse &&
          showCourse.length > 0 &&
          showCourse.map((item) => (
            <div
              key={item._id}
              className="
                            border-dashed border border-[#d4d4d4]
                            py-2 my-2 px-8 rounded-[10px]
                            transform transition duration-300 ease-in-out
                            hover:border-[#3525CD] hover:text-[#3525CD]
                        "
            >
              <div className="flex justify-between items-center py-2">
                {item.request_name}

                <div className="flex items-center">
                  <BoxEditCourseRequest
                    courseId={courseId}
                    request={item}
                    refetch={refetch}
                  />

                  <Popconfirm
                    title="Bạn chắc chắn muốn xóa yêu cầu này?"
                    // onConfirm={() => handleDelete(item._id)}
                  >
                    <button
                      className="
                                        text-red-500 hover:text-red-700 transition p-2 group
                                        hover:bg-[#ffd5bf] rounded-[5px]
                                        hover:scale-95 hover:opacity-65 cursor-pointer
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

export default BoxShowCourseRequest;
