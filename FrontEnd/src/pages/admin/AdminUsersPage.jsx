import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserDetail,
  getUsers,
  updateUserStatus,
} from "../../services/adminUserService";
import UserDetailModal from "../../components/admin/UserDetailModal";
import UserStatusBadge from "../../components/admin/UserStatusBadge";
import Pagination from "../../components/ui/Pagination";

const ROLE_OPTIONS = ["all", "customer", "provider", "admin"];
const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "locked", label: "Locked" },
];
const LIMIT_OPTIONS = [5, 10, 20];

function getUserId(user) {
  return user?._id || user?.id || user?.userId || "";
}

function getUsername(user) {
  return user?.username || user?.fullName || user?.name || "Unnamed user";
}

function getInitials(user) {
  const name = getUsername(user);
  const fallback = user?.email || "U";
  const source = name === "Unnamed user" ? fallback : name;
  return source
    .split(/[ .@_-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function unwrapUsersResponse(response) {
  const payload =
    response?.data && response?.pagination === undefined
      ? response.data
      : response || {};
  return {
    users: Array.isArray(payload.data) ? payload.data : [],
    pagination: payload.pagination || {},
  };
}

function unwrapUserDetail(response) {
  const payload =
    response?.data && response?.user === undefined
      ? response.data
      : response || {};
  return payload.user || payload.data || payload;
}

function getApiErrorMessage(err, fallback) {
  if (err.response?.status === 403) {
    return "You do not have permission to manage users.";
  }

  return err.response?.data?.message || err.message || fallback;
}

function RoleBadge({ role }) {
  const normalized = String(role || "customer").toLowerCase();
  const roleClass =
    normalized === "admin"
      ? "bg-primary-container/20 text-primary"
      : normalized === "provider"
        ? "bg-tertiary-fixed text-tertiary"
        : "bg-secondary-fixed text-secondary";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold capitalize ${roleClass}`}
    >
      <span className="material-symbols-outlined text-[16px]">
        {normalized === "admin"
          ? "admin_panel_settings"
          : normalized === "provider"
            ? "co_present"
            : "person"}
      </span>
      {normalized}
    </span>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const currentUserId = getUserId(currentUser);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      search: debouncedSearch.trim(),
      role: role === "all" ? "" : role,
    };

    if (status === "active") params.isActive = true;
    if (status === "locked") params.isActive = false;

    return params;
  }, [debouncedSearch, limit, page, role, status]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getUsers(queryParams);
      const { users: nextUsers, pagination: nextPagination } =
        unwrapUsersResponse(response);
      setUsers(nextUsers);
      setPagination({
        page: nextPagination.page || page,
        limit: nextPagination.limit || limit,
        total: nextPagination.total || nextUsers.length,
        totalPages: nextPagination.totalPages || 1,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load users."));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [limit, page, queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  const handleViewDetail = async (targetUser) => {
    setDetailOpen(true);
    setSelectedUser(targetUser);
    setDetailLoading(true);
    setDetailError("");
    setError("");
    try {
      const response = await getUserDetail(getUserId(targetUser));
      setSelectedUser(unwrapUserDetail(response));
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load user detail.");
      setDetailError(message);
      setError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    const targetId = getUserId(targetUser);
    const nextStatus = !targetUser.isActive;

    if (currentUserId && targetId === currentUserId && !nextStatus) {
      setError("You cannot lock your own admin account from this screen.");
      return;
    }

    const confirmed = window.confirm(
      nextStatus
        ? `Unlock ${getUsername(targetUser)}?`
        : `Lock ${getUsername(targetUser)}?`,
    );
    if (!confirmed) return;

    setActionLoading(targetId);
    setError("");
    try {
      const response = await updateUserStatus(targetId, nextStatus);
      const updatedUser = unwrapUserDetail(response);
      const mergedUser = {
        ...targetUser,
        ...updatedUser,
        isActive:
          typeof updatedUser.isActive === "boolean"
            ? updatedUser.isActive
            : nextStatus,
      };

      setUsers((prev) =>
        prev.map((item) => (getUserId(item) === targetId ? mergedUser : item)),
      );
      setSelectedUser((prev) =>
        prev && getUserId(prev) === targetId
          ? { ...prev, ...mergedUser }
          : prev,
      );
      setDetailError("");
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        `Failed to ${nextStatus ? "unlock" : "lock"} user.`,
      );
      setError(message);
      if (detailOpen && selectedUser && getUserId(selectedUser) === targetId) {
        setDetailError(message);
      }
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="space-y-[24px]">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-container/15 px-3 py-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span className="font-label-sm text-label-sm uppercase">
              User Management
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Manage Users
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Search, filter, inspect, lock, and unlock EduFlow accounts.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={fetchUsers}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              loading ? "animate-spin" : ""
            }`}
          >
            refresh
          </span>
          Refresh
        </button>
      </section>

      <section className="glass-card rounded-xl">
        <div className="grid grid-cols-1 gap-4 border-b border-outline-variant/30 p-5 lg:grid-cols-[1fr_180px_180px_120px]">
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-body-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Search username or email..."
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={role}
            onChange={handleRoleChange}
          >
            {ROLE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All roles" : item}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={status}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={limit}
            onChange={handleLimitChange}
          >
            {LIMIT_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item} / page
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="m-5 flex items-start gap-3 rounded-lg border border-error-container bg-error-container/40 p-4 text-on-error-container">
            <span className="material-symbols-outlined">error</span>
            <p className="text-body-sm">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                {["User", "Role", "Status", "Created At", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 font-label-md text-label-md"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                Array.from({ length: limit }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-surface-container" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 rounded bg-surface-container" />
                          <div className="h-3 w-48 rounded bg-surface-container" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-7 w-24 rounded-full bg-surface-container" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-7 w-20 rounded-full bg-surface-container" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-24 rounded bg-surface-container" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-9 w-32 rounded bg-surface-container" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/15 text-primary">
                        <span className="material-symbols-outlined text-[32px]">
                          group_off
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">
                          No users found
                        </h3>
                        <p className="mt-1 text-body-sm text-on-surface-variant">
                          Try changing the search text or filters.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((item) => {
                  const itemId = getUserId(item);
                  const isBusy = actionLoading === itemId;

                  return (
                    <tr
                      key={itemId}
                      className="transition-colors hover:bg-primary-container/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-xs font-bold text-primary">
                            {getInitials(item) || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-body-sm font-semibold text-on-surface">
                              {getUsername(item)}
                            </p>
                            <p className="truncate text-[12px] text-on-surface-variant">
                              {item.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={item.role} />
                      </td>
                      <td className="px-6 py-4">
                        <UserStatusBadge isActive={item.isActive} />
                      </td>
                      <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                            onClick={() => handleViewDetail(item)}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                            View
                          </button>
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-label-md font-label-md text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${
                              item.isActive ? "bg-error" : "bg-primary"
                            }`}
                            disabled={isBusy}
                            onClick={() => handleToggleStatus(item)}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {item.isActive ? "lock" : "lock_open"}
                            </span>
                            {isBusy ? "..." : item.isActive ? "Lock" : "Unlock"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          disabled={loading}
          onPageChange={setPage}
        />
      </section>

      {detailLoading && detailOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-on-surface/35 p-margin-mobile backdrop-blur-sm">
          <div className="glass-card flex items-center gap-3 rounded-xl p-5 shadow-xl">
            <span className="material-symbols-outlined animate-spin text-primary">
              progress_activity
            </span>
            <span className="font-label-md text-label-md text-on-surface">
              Loading user detail...
            </span>
          </div>
        </div>
      )}

      <UserDetailModal
        open={detailOpen && !detailLoading}
        user={selectedUser}
        error={detailError}
        actionLoading={Boolean(actionLoading)}
        onClose={() => {
          setDetailOpen(false);
          setDetailError("");
        }}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
