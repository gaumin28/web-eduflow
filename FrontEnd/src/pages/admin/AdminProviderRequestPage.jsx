import { useState } from "react";
import { Table, Select, Button, Tag, Space } from "antd";
import { Link } from "react-router-dom";
import useGetProviderRequests from "../../hooks/useGetProviderRequests";

// --- Cấu hình hiển thị trạng thái ---
const STATUS_OPTIONS = [
  { value: "all", label: "Trạng thái: Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

const STATUS_TAGS = {
  pending: { color: "orange", text: "Chờ duyệt" },
  approved: { color: "green", text: "Đã duyệt" },
  rejected: { color: "red", text: "Từ chối" },
};

const AdminProviderRequestPage = () => {
  // --- State Quản lý Lọc và Phân trang ---
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Fetch API ---
  const { data, isLoading, isFetching, refetch } = useGetProviderRequests(
    page,
    pageSize,
    status,
  );

  const providers = data?.data || [];
  const paginationData = data?.pagination || { total: 0 };
  const loading = isLoading || isFetching;

  // --- Handlers ---
  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1); // Reset về trang 1 khi đổi bộ lọc
  };

  const handleRefresh = () => {
    setStatus("all");
    setPage(1);
    setPageSize(10);
    refetch();
  };

  // --- Cấu hình các Cột (Columns) cho Table ---
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      className: "font-label-md text-on-surface-variant text-xs",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Thông tin đối tác",
      key: "providerInfo",
      render: (_, record) => (
        <div className="flex items-center gap-4 group">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant/30 shrink-0">
            <img
              className="w-full h-full object-cover"
              src={record.avatar || "https://i.pravatar.cc/100"}
              alt={record.provider_name}
              onError={(e) => {
                e.target.src = "https://placehold.co/100x100?text=No+Avatar";
              }}
            />
          </div>
          <div>
            <p className="font-headline-md text-body-md text-on-surface font-bold m-0">
              {record.provider_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Nghề nghiệp",
      dataIndex: "career",
      key: "career",
      className: "font-body-sm text-on-surface-variant",
      render: (text) => text || <span className="text-gray-400">---</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const tagConfig = STATUS_TAGS[status] || {
          color: "default",
          text: status,
        };
        return (
          <Tag
            color={tagConfig.color}
            className="m-0 px-3 py-1 rounded-full text-xs font-label-md ant-tag-custom"
          >
            {tagConfig.text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Space size={4} className="justify-end">
          <Link to={`/admin/providers-requests/${record._id}`}>
            <Button
              type="text"
              className="p-2 h-auto flex items-center justify-center hover:bg-secondary/10 hover:text-secondary rounded-lg"
              title="Xem chi tiết"
            >
              <span className="material-symbols-outlined text-[20px]">
                visibility
              </span>
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="">
      {/* --- Page Header Area --- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-gutter">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-container/15 px-3 py-1 text-primary">
            <span className="material-symbols-outlined text-[16px]">
              manage_accounts
            </span>
            <span className="font-label-sm text-label-sm uppercase">
              Yêu cầu đối tác
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight m-0">
            Yêu Cầu Đăng Ký Đối Tác
          </h2>
          <p className="text-[12px] mt-1 text-on-surface-variant">
            Danh sách người dùng gửi yêu cầu xác thực hồ sơ trở thành nhà cung
            cấp.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2.5 h-auto border border-outline-variant/40 rounded-xl flex items-center justify-center gap-2"
            type="text"
          >
            <span
              className={`material-symbols-outlined text-on-surface-variant text-[20px] ${loading ? "animate-spin" : ""}`}
            >
              refresh
            </span>
            <span className="text-on-surface-variant font-label-md">
              Làm mới
            </span>
          </Button>
        </div>
      </div>

      {/* --- Controls / Filters --- */}
      <div className="bg-surface-container-lowest w-full py-4 px-9 rounded-2xl border border-outline-variant/30 shadow-sm flex justify-between items-center gap-4 my-4">
        <p className="text-on-surface-variant font-label-md"> Lọc:</p>
        <Select
          value={status}
          onChange={handleStatusChange}
          className=""
          options={STATUS_OPTIONS}
        />
      </div>

      {/* --- Table Section --- */}
      <div className="bg-surface-container-lowest rounded-2xl px-4 py-2 border border-outline-variant/30 shadow-sm overflow-hidden mt-4">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={providers}
          loading={loading}
          className="w-full"
          rowClassName="hover:bg-surface-container-low/30 transition-colors"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: paginationData.total || 0, // Lấy total từ API trả về
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            placement: "bottomCenter",
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
            showTotal: (total, range) => (
              <p className="font-body-sm text-on-surface-variant m-0">
                Hiển thị {range[0]} - {range[1]} trong số {total} yêu cầu
              </p>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default AdminProviderRequestPage;
