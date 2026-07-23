import UserStatusBadge from "./UserStatusBadge";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-4">
      <p className="mb-1 text-label-sm font-label-sm uppercase text-outline">
        {label}
      </p>
      <p className="wrap-break-word text-body-sm text-on-surface">
        {value || "-"}
      </p>
    </div>
  );
}

export default function UserDetailModal({
  user,
  open,
  onClose,
  onToggleStatus,
  actionLoading,
  error,
}) {
  if (!open || !user) return null;

  const username = user.username || user.fullName || user.name || "User";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-on-surface/45 p-margin-mobile backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl rounded-xl shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/30 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
              <span className="material-symbols-outlined">
                admin_panel_settings
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {username}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          {error && (
            <div className="rounded-lg border border-error-container bg-error-container/40 p-4 text-body-sm text-on-error-container sm:col-span-2">
              {error}
            </div>
          )}
          <DetailRow label="Username" value={username} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Role" value={user.role} />
          <div className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-4">
            <p className="mb-2 text-label-sm font-label-sm uppercase text-outline">
              Status
            </p>
            <UserStatusBadge isActive={user.isActive} />
          </div>
          <DetailRow label="Created at" value={formatDate(user.createdAt)} />
          <DetailRow label="Updated at" value={formatDate(user.updatedAt)} />
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-outline-variant/30 p-6 sm:flex-row">
          <button
            type="button"
            className="rounded-lg border border-outline-variant px-4 py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-label-md text-label-md text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${
              user.isActive ? "bg-error" : "bg-primary"
            }`}
            disabled={actionLoading}
            onClick={() => onToggleStatus(user)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {user.isActive ? "lock" : "lock_open"}
            </span>
            {actionLoading
              ? "Processing..."
              : user.isActive
                ? "Lock user"
                : "Unlock user"}
          </button>
        </div>
      </div>
    </div>
  );
}
