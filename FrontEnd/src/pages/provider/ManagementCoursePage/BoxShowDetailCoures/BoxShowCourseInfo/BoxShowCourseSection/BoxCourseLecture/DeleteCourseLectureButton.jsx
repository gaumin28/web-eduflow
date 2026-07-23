import { Popconfirm, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import useDeleteCourseLecture from "../../../../../../../hooks/useCourse/useDeleteCourseLecture";

const DeleteLectureButton = ({ lectureId, refetch }) => {
  const { mutate: deleteLecture, isPending } = useDeleteCourseLecture();

  const handleDelete = () => {
    deleteLecture(lectureId, {
      onSuccess: (data) => {
        notification.success({
          title: "Thành công",
          description: data?.message || "Xóa bài giảng thành công!",
        });
        refetch?.();
      },
      onError: (err) => {
        notification.error({
          title: "Thất bại",
          description: err?.response?.data?.message,
        });
      },
    });
  };

  return (
    <Popconfirm
      title="Xóa bài giảng?"
      description="Bạn chắc chắn muốn xóa bài giảng này?"
      okText="Xóa"
      cancelText="Hủy"
      onConfirm={handleDelete}
    >
      <button
        disabled={isPending}
        className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
      >
        <DeleteOutlined />
      </button>
    </Popconfirm>
  );
};

export default DeleteLectureButton;