import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Spin,
  Tag,
  Image,
  message,
  Popconfirm,
  Modal,
  Input,
  Divider,
} from "antd";
import useGetProviderRequestDetail from "../../hooks/useGetProviderRequestDetail";
import useUpdateProviderStatus from "../../hooks/useUpdateProviderStatus";
import useRejectProvider from "../../hooks/useRejectProvider";

const STATUS_CONFIG = {
  pending: { color: "orange", text: "Đang chờ duyệt" },
  approved: { color: "green", text: "Đã phê duyệt" },
  rejected: { color: "red", text: "Đã từ chối" },
};

const AdminProviderRequestDetailPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  // --- State xử lý Modal từ chối ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const { mutate: rejectProvider, isPending: isRejectPending } =
    useRejectProvider(providerId);

  // --- Gọi API lấy chi tiết qua Hook đã viết ---
  const { data, isLoading, error, refetch } =
    useGetProviderRequestDetail(providerId);
  const provider = data?.data;
  const { mutate: updateStatus, isPending: isStatusPending } =
    useUpdateProviderStatus(providerId);

  // 🟢 Hàm xử lý DUYỆT hồ sơ
  const handleApprove = () => {
    updateStatus(
      { providerId, status: "approved" },
      {
        onSuccess: (res) => {
          message.success(
            res?.message ||
              "Đã phê duyệt yêu cầu trở thành đối tác thành công!",
          );
          refetch(); // Làm mới lại danh sách dữ liệu
        },
        onError: (err) => {
          message.error(err?.response?.data?.message || "Duyệt thất bại!");
        },
      },
    );
  };

  const handleConfirmReject = () => {
    if (!reason.trim()) {
      return message.warning("Vui lòng nhập lý do trước khi từ chối!");
    }

    rejectProvider(
      { providerId, rejection_reason: reason },
      {
        onSuccess: (res) => {
          message.success(res?.message || "Đã hủy hồ sơ thành công!");
          setIsModalOpen(false);
          setReason("");
          refetch();
        },
        onError: (err) => {
          message.error(err?.response?.data?.message || "Thao tác thất bại!");
        },
      },
    );
  };

  // --- Giao diện đang tải hoặc lỗi ---
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Spin size="large" />
        <span className="text-on-surface-variant font-body-md animate-pulse">
          Đang tải hồ sơ đối tác...
        </span>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
        <span className="material-symbols-outlined text-[48px] text-error mb-2">
          error
        </span>
        <h3 className="font-headline-md text-on-surface">
          Không tìm thấy yêu cầu!
        </h3>
        <p className="text-body-sm text-on-surface-variant mb-4">
          {error?.response?.data?.message ||
            "Có lỗi xảy ra trong quá trình tải dữ liệu."}
        </p>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const statusStyle = STATUS_CONFIG[provider.status] || {
    color: "default",
    text: provider.status,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 rounded-xl border-outline-variant/50 hover:text-primary"
            type="text"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </Button>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Chi tiết hồ sơ đăng ký
            </span>
            <h2 className="text-headline-md font-bold text-on-surface m-0">
              Xác thực yêu cầu đối tác
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-on-surface-variant">
            Trạng thái hiện tại:
          </span>
          <Tag
            color={statusStyle.color}
            className="px-3 py-0.5 rounded-full text-xs font-bold uppercase m-0"
          >
            {statusStyle.text}
          </Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* CỘT TRÁI: THÔNG TIN NHANH (PROFILE CARD) */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative group w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 mb-4 shadow-sm">
            <img
              src={provider.avatar || "https://i.pravatar.cc/200"}
              alt={provider.provider_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              onError={(e) => {
                e.target.src = "https://placehold.co/200x200?text=No+Avatar";
              }}
            />
          </div>

          <h3 className="text-headline-md font-bold text-on-surface m-0">
            {provider.provider_name}
          </h3>
          <p className="text-body-md text-primary font-semibold mt-1 mb-4">
            {provider.career || "Chưa xác định nghề nghiệp"}
          </p>

          <Divider className="my-2 border-outline-variant/20" />

          {/* Chi tiết liên hệ nhanh */}
          <div className="w-full text-left space-y-3.5 mt-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">
                mail
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] text-on-surface-variant uppercase font-medium">
                  Email liên kết
                </span>
                <span className="text-body-sm text-on-surface font-semibold break-all">
                  {provider.user_id?.email || provider.email || "---"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">
                phone
              </span>
              <div>
                <span className="block text-[11px] text-on-surface-variant uppercase font-medium">
                  Số điện thoại
                </span>
                <span className="text-body-sm text-on-surface font-semibold">
                  {provider.phone || "---"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">
                globe
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] text-on-surface-variant uppercase font-medium">
                  Website/Social
                </span>
                {provider.website ? (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-secondary hover:underline font-semibold break-all"
                  >
                    {provider.website}
                  </a>
                ) : (
                  <span className="text-body-sm text-on-surface font-semibold">
                    ---
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: GIỚI THIỆU CHI TIẾT & CHỨNG CHỈ (MAIN CONTENT) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin mô tả & Kinh nghiệm */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h4 className="text-body-lg font-bold text-on-surface border-l-4 border-primary pl-3 mb-3">
                Giới thiệu bản thân
              </h4>
              <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line bg-surface-container-low/20 p-4 rounded-xl border border-outline-variant/10">
                {provider.description ||
                  "Nhà cung cấp chưa cập nhật phần mô tả bản thân."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-low/20 p-4 rounded-xl border border-outline-variant/10">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">
                  Số năm kinh nghiệm
                </span>
                <p className="text-headline-md font-extrabold text-primary mt-1 m-0">
                  {provider.experience_years
                    ? `${provider.experience_years} năm`
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div className="bg-surface-container-low/20 p-4 rounded-xl border border-outline-variant/10">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">
                  Ngày đăng ký gửi yêu cầu
                </span>
                <p className="text-body-md font-semibold text-on-surface mt-1.5 m-0">
                  {provider.createdAt
                    ? new Date(provider.createdAt).toLocaleDateString("vi-VN", {
                        dateStyle: "long",
                      })
                    : "---"}
                </p>
              </div>
            </div>
          </div>

          {/* --- HỆ THỐNG CHỨNG CHỈ PHÓNG TO SẮC NÉT --- */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <h4 className="text-body-lg font-bold text-on-surface border-l-4 border-primary pl-3 mb-4">
              Hồ sơ năng lực & Chứng chỉ đính kèm
            </h4>

            {provider.images && provider.images.length > 0 ? (
              <Image.PreviewGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.images.map((cert, index) => {
                    const certUrl = cert.url || cert; // Chấp nhận cả array string hoặc array object
                    const certName = cert.name || `Chứng chỉ ${index + 1}`;
                    return (
                      <div
                        key={index}
                        className="group relative rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container-low aspect-4/3 flex items-center justify-center cursor-pointer shadow-sm"
                      >
                        {/* Antd Image tích hợp sẵn tính năng Click Zoom & Preview */}
                        <Image
                          src={certUrl}
                          alt={certName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fallback="https://placehold.co/240x180?text=Loi+anh"
                        />
                        {/* Overlay nhắc nhở khi Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none gap-1">
                          <span className="material-symbols-outlined text-[24px]">
                            zoom_in
                          </span>
                          <span className="text-[11px] font-bold tracking-wider">
                            Xem chi tiết
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Image.PreviewGroup>
            ) : (
              <div className="text-center py-10 bg-surface-container-low/20 rounded-xl border border-dashed border-outline-variant/40">
                <span className="material-symbols-outlined text-[32px] text-outline">
                  verified_user
                </span>
                <p className="text-body-sm text-on-surface-variant m-0 mt-1">
                  Đối tác không đính kèm chứng chỉ nào.
                </p>
              </div>
            )}
          </div>

          {/* --- KHU VỰC ACTION XỬ LÝ (CHỈ HIỂN THỊ KHI ĐANG PENDING) --- */}
          {provider.status === "pending" && (
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-body-md font-bold text-amber-900 m-0">
                  Yêu cầu này cần phê duyệt
                </h4>
                <p className="text-[12px] text-amber-800 m-0 mt-0.5">
                  Vui lòng kiểm tra kỹ lưỡng các thông tin chứng chỉ đính kèm
                  trước khi đưa ra quyết định.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  danger
                  type="text"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 h-auto border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-bold font-label-md"
                >
                  Từ chối
                </Button>
                <Popconfirm
                  title="Phê duyệt đối tác"
                  description="Bạn có chắc chắn muốn cấp quyền hoạt động như một đối tác chính thức cho tài khoản này?"
                  onConfirm={handleApprove}
                  okText="Đồng ý duyệt"
                  cancelText="Hủy"
                  okButtonProps={{ loading: isStatusPending }}
                >
                  <Button
                    type="primary"
                    className="px-5 py-2 h-auto rounded-xl font-bold font-label-md bg-green-600 hover:bg-green-700 border-none shadow-sm"
                  >
                    Duyệt hồ sơ
                  </Button>
                </Popconfirm>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL LÝ DO TỪ CHỐI --- */}
      <Modal
        title="Xác nhận từ chối hồ sơ đối tác"
        open={isModalOpen}
        onOk={handleConfirmReject}
        onCancel={() => {
          setIsModalOpen(false);
          setReason("");
        }}
        confirmLoading={isRejectPending}
        okText="Xác nhận từ chối"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <div className="py-3">
          <p className="mb-2 text-sm text-gray-600">
            Vui lòng nhập lý do cụ thể (Ví dụ: Thiếu chứng chỉ hành nghề, thông
            tin không rõ ràng...) để gửi phản hồi cho đối tác:
          </p>
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do hủy tại đây..."
            maxLength={300}
            showCount
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminProviderRequestDetailPage;
