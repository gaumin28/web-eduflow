import { useState, useRef, useEffect } from "react";
const ratingOptions = [
  { id: "rating-4", label: "4.0 & Up", stars: 4 },
  { id: "rating-3", label: "3.0 & Up", stars: 3 },
];
const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const priceOptions = ["Paid", "Free"];
const durationOptions = ["0-3 Hours", "3-7 Hours", "7+ Hours"];
const PRICE_DEBOUNCE_MS = 600;
/**
 * PriceRangeSection — Min/Max price inputs with debounce and validation.
 */
function PriceRangeSection({
  minPrice,
  maxPrice,
  onFilterChange,
  isOpen,
  onToggle,
}) {
  const [localMin, setLocalMin] = useState(minPrice || "");
  const [localMax, setLocalMax] = useState(maxPrice || "");
  const debounceMinRef = useRef(null);
  const debounceMaxRef = useRef(null);
  // Cleanup timers
  useEffect(() => {
    return () => {
      if (debounceMinRef.current) clearTimeout(debounceMinRef.current);
      if (debounceMaxRef.current) clearTimeout(debounceMaxRef.current);
    };
  }, []);
  const handleMinChange = (value) => {
    // Block negative input
    const sanitized = value === "" ? "" : Math.max(0, Number(value)).toString();
    setLocalMin(sanitized);
    if (debounceMinRef.current) clearTimeout(debounceMinRef.current);
    debounceMinRef.current = setTimeout(() => {
      onFilterChange("minPrice", sanitized || null);
    }, PRICE_DEBOUNCE_MS);
  };
  const handleMaxChange = (value) => {
    const sanitized = value === "" ? "" : Math.max(0, Number(value)).toString();
    setLocalMax(sanitized);
    if (debounceMaxRef.current) clearTimeout(debounceMaxRef.current);
    debounceMaxRef.current = setTimeout(() => {
      onFilterChange("maxPrice", sanitized || null);
    }, PRICE_DEBOUNCE_MS);
  };
  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    if (debounceMinRef.current) clearTimeout(debounceMinRef.current);
    if (debounceMaxRef.current) clearTimeout(debounceMaxRef.current);
    // Clear both at once
    onFilterChange("minPrice", null);
    onFilterChange("maxPrice", null);
  };
  // Validation: min > max
  const hasError =
    localMin !== "" && localMax !== "" && Number(localMin) > Number(localMax);
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
      >
        Price Range
        <span
          className="material-symbols-outlined text-[18px] transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </span>
      </button>
      {isOpen ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={localMin}
              onChange={(e) => handleMinChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-body-sm bg-surface-container-lowest outline-none transition-colors ${
                hasError
                  ? "border-error focus:ring-error/30 focus:ring-2"
                  : "border-outline-variant focus:ring-primary/30 focus:ring-2 focus:border-primary"
              }`}
            />
            <span className="text-on-surface-variant text-body-sm shrink-0">
              —
            </span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={localMax}
              onChange={(e) => handleMaxChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-body-sm bg-surface-container-lowest outline-none transition-colors ${
                hasError
                  ? "border-error focus:ring-error/30 focus:ring-2"
                  : "border-outline-variant focus:ring-primary/30 focus:ring-2 focus:border-primary"
              }`}
            />
          </div>
          {hasError && (
            <p className="text-[12px] text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                error
              </span>
              Min price cannot exceed Max price
            </p>
          )}
          {(localMin || localMax) && (
            <button
              onClick={handleClear}
              className="text-body-sm text-primary hover:underline transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                close
              </span>
              Clear price range
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
/**
 * FilterSidebar — collapsible filter panel for course list page.
 *
 * Props:
 *   - filters       : { category, price, rating, level }
 *   - categories    : [{ _id, cate_name, icon_key, quantity }]
 *   - onFilterChange: (key: string, value: any) => void
 */
export default function FilterSidebar({
  filters,
  categories = [],
  onFilterChange,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    rating: true,
    level: true,
    price: true,
    priceRange: true,
    duration: true,
  });
  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-stack-lg">
        <div>
          <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-4">
            Filters
          </h3>
          {/* ── Category ──────────────────────────────── */}
          {categories.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => toggleSection("category")}
                className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
              >
                Category
                <span
                  className="material-symbols-outlined text-[18px] transition-transform"
                  style={{
                    transform: openSections.category
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
              </button>
              {openSections.category ? (
                <div className="space-y-2">
                  {/* "All" option */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      className="w-4 h-4 border-outline-variant text-primary"
                      name="category"
                      type="radio"
                      checked={!filters.category}
                      onChange={() => onFilterChange("category", null)}
                    />
                    <span
                      className={`text-body-sm ${!filters.category ? "text-on-surface font-medium" : "text-on-surface-variant"}`}
                    >
                      All Categories
                    </span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        className="w-4 h-4 border-outline-variant text-primary"
                        name="category"
                        type="radio"
                        checked={filters.category === cat.cate_name}
                        onChange={() =>
                          onFilterChange("category", cat.cate_name)
                        }
                      />
                      <span
                        className={`text-body-sm ${filters.category === cat.cate_name ? "text-on-surface font-medium" : "text-on-surface-variant"}`}
                      >
                        {cat.cate_name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          {/* ── Rating ─────────────────────────────────── */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("rating")}
              className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
            >
              Rating
              <span
                className="material-symbols-outlined text-[18px] transition-transform"
                style={{
                  transform: openSections.rating
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </button>
            {openSections.rating ? (
              <div className="space-y-2">
                {ratingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                      type="checkbox"
                      checked={filters.rating === String(option.stars)}
                      onChange={() => {
                        const newVal =
                          filters.rating === String(option.stars)
                            ? null
                            : String(option.stars);
                        onFilterChange("rating", newVal);
                      }}
                    />
                    <span className="flex items-center text-body-sm text-on-surface-variant group-hover:text-on-surface">
                      <span className="flex text-yellow-500 mr-2">
                        {Array.from({ length: option.stars }).map((_, i) => (
                          <span
                            key={`${option.id}-${i}`}
                            className="material-symbols-outlined text-[16px]"
                            style={{
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            star
                          </span>
                        ))}
                        {Array.from({ length: 5 - option.stars }).map(
                          (_, i) => (
                            <span
                              key={`${option.id}-empty-${i}`}
                              className="material-symbols-outlined text-[16px]"
                            >
                              star
                            </span>
                          ),
                        )}
                      </span>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          {/* ── Level ──────────────────────────────────── */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("level")}
              className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
            >
              Level
              <span
                className="material-symbols-outlined text-[18px] transition-transform"
                style={{
                  transform: openSections.level
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </button>
            {openSections.level ? (
              <div className="space-y-2">
                {levelOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary"
                      type="checkbox"
                      checked={filters.level === option}
                      onChange={() => {
                        const newVal = filters.level === option ? null : option;
                        onFilterChange("level", newVal);
                      }}
                    />
                    <span className="text-body-sm text-on-surface-variant">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          {/* ── Price ──────────────────────────────────── */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("price")}
              className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
            >
              Price
              <span
                className="material-symbols-outlined text-[18px] transition-transform"
                style={{
                  transform: openSections.price
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </button>
            {openSections.price ? (
              <div className="space-y-2">
                {priceOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      className="w-4 h-4 border-outline-variant text-primary"
                      name="price"
                      type="radio"
                      checked={filters.price === option}
                      onChange={() => {
                        // Toggle off if clicking the same option
                        const newVal = filters.price === option ? null : option;
                        onFilterChange("price", newVal);
                      }}
                    />
                    <span className="text-body-sm text-on-surface-variant">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          {/* ── Price Range ─────────────────────────────── */}
          <PriceRangeSection
            key={`${filters.minPrice || ""}-${filters.maxPrice || ""}`}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onFilterChange={onFilterChange}
            isOpen={openSections.priceRange}
            onToggle={() => toggleSection("priceRange")}
          />
          {/* ── Duration ──────────────────────────────── */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("duration")}
              className="w-full font-label-md text-label-md text-on-surface mb-3 flex items-center justify-between"
            >
              Duration
              <span
                className="material-symbols-outlined text-[18px] transition-transform"
                style={{
                  transform: openSections.duration
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </button>
            {openSections.duration ? (
              <div className="space-y-2">
                {durationOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary"
                      type="checkbox"
                    />
                    <span className="text-body-sm text-on-surface-variant">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
