import { PlayCircleOutlined, LockOutlined } from "@ant-design/icons";

import BoxEditCourseLecture from "./BoxCourseLecture/BoxEditCourseLecture";
import DeleteLectureButton from "./BoxCourseLecture/DeleteCourseLectureButton";

export default function BoxLesson({
  lecture,

  refetch,
}) {
  return (
    <div
      className="
        group flex items-center justify-between py-3 rounded px-7 bg-[#f3f3f3]
        transform transition duration-300 ease-in-out hover:bg-[#e0e0e0d8]"
    >
      {/* LEFT */}
      <div className="flex items-center gap-2">
        {lecture.preview ? (
          <PlayCircleOutlined className="text-green-400" />
        ) : (
          <LockOutlined className="text-gray-400" />
        )}
        <span className="text-[#000000] text-[14px]">{lecture.title}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <span className="text-[#000000] text-[14px]">{lecture.duration}</span>

        <BoxEditCourseLecture lecture={lecture} refetch={refetch} />
        <DeleteLectureButton lectureId={lecture._id} refetch={refetch} />
      </div>
    </div>
  );
}
