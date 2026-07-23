function getPages(page, totalPages) {
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = Math.max(1, safePage - 2);
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (!totalPages || totalPages <= 1) return null;

  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pages = getPages(safePage, totalPages);

  const goToPage = (nextPage) => {
    onPageChange(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/30 px-5 py-4">
      <p className="text-body-sm text-on-surface-variant">
        Page <span className="font-semibold text-on-surface">{safePage}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || safePage <= 1}
          onClick={() => goToPage(safePage - 1)}
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_left
          </span>
          Previous
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((item) => (
            <button
              key={item}
              type="button"
              className={`h-9 min-w-9 rounded-lg px-3 text-label-md font-label-md transition-colors ${
                item === safePage
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
              }`}
              disabled={disabled || item === safePage}
              onClick={() => goToPage(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || safePage >= totalPages}
          onClick={() => goToPage(safePage + 1)}
        >
          Next
          <span className="material-symbols-outlined text-[18px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
