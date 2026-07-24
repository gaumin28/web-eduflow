import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { getCourses } from "../../services/courseService";

const COUPON_DISCOUNT = 15;

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return currencyFormatter.format(value);
}

export default function ShoppingCartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [removingItemIds, setRemovingItemIds] = useState(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const { data: recommendationsData = [] } = useQuery({
    queryKey: ["cart-recommendations"],
    queryFn: async () => {
      const { data: res } = await getCourses({ page: 1, limit: 6 });
      return Array.isArray(res?.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const removeItem = (itemId) => {
    setRemovingItemIds((prev) => new Set(prev).add(itemId));

    window.setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItemIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }, 350);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsCouponApplied(true);
  };

  const originalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.originalPrice ?? item.price),
        0,
      ),
    [cartItems],
  );

  const saleDiscount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + Math.max((item.originalPrice ?? item.price) - item.price, 0),
        0,
      ),
    [cartItems],
  );

  const couponDiscount = isCouponApplied ? COUPON_DISCOUNT : 0;
  const totalDiscount = saleDiscount + couponDiscount;
  const taxableAmount = Math.max(originalPrice - totalDiscount, 0);
  const tax = cartItems.length > 0 ? taxableAmount * 0.1 : 0;
  const total = taxableAmount + tax;

  const recommendedCourses = useMemo(() => {
    const cartIds = new Set(
      cartItems.map((item) => String(item.id ?? item._id)),
    );
    return recommendationsData
      .filter((course) => !cartIds.has(String(course._id)))
      .slice(0, 2);
  }, [recommendationsData, cartItems]);

  const handleRecommendationClick = (courseId) => {
    navigate(`/course/detail/${courseId}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mt-15 py-stack-lg min-h-screen">
      <header className="mb-stack-lg">
        <h1 className="font-display text-display text-on-surface">Giỏ hàng</h1>
        <p className="font-body-md text-on-surface-variant">
          Bạn có {cartItems.length} mục trong giỏ hàng.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-stack-md">
          {cartItems.map((item) => {
            const isRemoving = removingItemIds.has(item.id);
            const wishlisted = isWishlisted(item.id);

            return (
              <article
                key={item.id}
                className={`glass-card p-stack-md rounded-xl flex flex-col md:flex-row gap-stack-md group hover:shadow-md transition-all duration-300 ${
                  isRemoving
                    ? "translate-x-10 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                <div className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                    alt={item.title}
                  />
                  {item.tag ? (
                    <div className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="font-label-sm text-label-sm text-primary">
                        {item.tag}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-headline-md text-headline-md text-on-surface">
                        {item.title}
                      </h3>
                      <button
                        type="button"
                        className="text-on-surface-variant hover:text-error transition-colors"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                      Giảng viên: {item.instructor} • {item.duration}
                    </p>

                    <div className="flex items-center gap-1 text-tertiary">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-label-md text-label-md">
                        {item.rating} ({item.reviews.toLocaleString("vi-VN")}{" "}
                        đánh giá)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-md text-headline-md text-primary">
                        {formatMoney(item.price)}
                      </span>
                      {item.originalPrice ? (
                        <span className="font-body-sm text-body-sm line-through text-on-surface-variant">
                          {formatMoney(item.originalPrice)}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(item.id)}
                      className="text-primary font-label-md text-label-md hover:underline"
                    >
                      {wishlisted
                        ? "Đã trong yêu thích"
                        : "Chuyển vào yêu thích"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {cartItems.length === 0 ? (
            <div className="glass-card rounded-xl p-stack-lg text-center">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
                shopping_cart
              </span>
              <h2 className="font-headline-md text-headline-md mt-2">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Thêm vài khóa học để bắt đầu học ngay hôm nay.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-stack-md">
            <section className="glass-card p-stack-md rounded-xl">
              <h4 className="font-label-md text-label-md text-on-surface mb-stack-sm">
                Khuyến mãi
              </h4>
              <div className="flex gap-2">
                <div className="relative flex grow">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    local_offer
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
                    placeholder="Nhập mã giảm giá"
                    type="text"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    disabled={isCouponApplied}
                  />
                </div>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg font-label-md transition-opacity ${
                    isCouponApplied
                      ? "bg-tertiary-container text-on-tertiary-container"
                      : "bg-secondary-container text-on-secondary"
                  }`}
                  onClick={handleApplyCoupon}
                  disabled={isCouponApplied}
                >
                  {isCouponApplied ? "Đã áp dụng!" : "Áp dụng"}
                </button>
              </div>
            </section>

            <section className="bg-surface-container-highest p-stack-lg rounded-xl shadow-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-stack-lg">
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Giá gốc</span>
                  <span>{formatMoney(originalPrice)}</span>
                </div>
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Giảm giá khóa học</span>
                  <span className="text-error">
                    -{formatMoney(totalDiscount)}
                  </span>
                </div>
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Thuế</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="h-px bg-outline-variant/30 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-headline-md text-on-surface">
                    Tổng cộng
                  </span>
                  <span className="font-display text-[28px] text-primary">
                    {formatMoney(total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full bg-linear-to-r from-primary to-secondary text-on-primary font-headline-md py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
              >
                Tiến hành thanh toán
              </button>

              <div className="mt-stack-md flex items-center justify-center gap-2 text-on-surface-variant text-body-sm opacity-70">
                <span className="material-symbols-outlined text-[16px]">
                  lock
                </span>
                <span>Thanh toán an toàn được cung cấp bởi Stripe</span>
              </div>
            </section>

            <section className="space-y-stack-sm">
              <h4 className="font-label-md text-label-md text-on-surface-variant px-1">
                Có thể bạn cũng thích
              </h4>
              <div className="grid grid-cols-2 gap-stack-sm">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map((item) => {
                    const displayPrice =
                      item.price_promotion !== null &&
                      item.price_promotion !== undefined
                        ? item.price_promotion
                        : item.price;

                    return (
                      <article
                        key={item._id}
                        className="bg-surface rounded-lg p-2 border border-outline-variant/30 hover:border-primary/50 cursor-pointer transition-colors group"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleRecommendationClick(item._id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleRecommendationClick(item._id);
                          }
                        }}
                      >
                        <div className="aspect-video rounded-md bg-surface-variant overflow-hidden mb-2">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              item.image_url ||
                              "https://placehold.co/400x225/4f46e5/ffffff?text=No+Image"
                            }
                            alt={item.course_title}
                          />
                        </div>
                        <p className="font-label-sm text-label-sm truncate">
                          {item.course_title}
                        </p>
                        <p className="font-label-md text-label-md text-primary">
                          {formatMoney(displayPrice || 0)}
                        </p>
                      </article>
                    );
                  })
                ) : (
                  <p className="col-span-2 font-body-sm text-on-surface-variant">
                    Chưa có khóa học gợi ý.
                  </p>
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
