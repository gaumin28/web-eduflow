export default function UserStatusBadge({ isActive }) {
  const active = Boolean(isActive);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-error-container/70 text-on-error-container"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-green-600" : "bg-error"
        }`}
      />
      {active ? "Active" : "Locked"}
    </span>
  );
}
