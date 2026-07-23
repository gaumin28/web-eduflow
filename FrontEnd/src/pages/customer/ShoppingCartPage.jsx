import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

const RECOMMENDATIONS = [
  {
    id: "rec-1",
    title: "Product Management 101",
    price: 19.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdQvcCu52_hlHrN1ml7EOThZL5cfENwl7U9Y52kl6MM58026wFNGDBJTwxpiJ2wKt89gObpcbxko7ME2qnmN99DBJfNPR4QqkuXpphZ8a_R4E5uw5f0B_3NZjA6MgtwmzfXgJGo8LFmjnYGu-2-PvuweKehmWBq54ba7o1hY8lyR19I-JuX4UlM17P0V-JJ6LIaf77yRAF1lDFplq6pJDIphikTMRr_ntlifhbJy_XngBgGxtwrxwKyY0Uxhdov6tin0TPkgau57M",
  },
  {
    id: "rec-2",
    title: "Cybersecurity Basics",
    price: 24.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKIw0Aze2GvU9QU2bTf8G5my7xexiAYYPfWfg-hPGdjGY-wu0MwQazVh3kIhplM5JBDvUk7IYlIx_jeQfpNk5_OZHLqvG-Y2OJIH2OnLLCkAoLNMIIOBtZT8Ii7olraKvifiJIIalD-sDy0UMtHh573gaBk-2lZR8BPU-t8F6HbvH2dke6b3QerTVZD9um1HUKEur1940No4CqQ3rj16HfCMRESSQAKnQyrU0d1T3ey4bS4WnS1EXwpUe0vMsD3ol99tQPkJ3pcNc",
  },
];

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
  const [removingItemIds, setRemovingItemIds] = useState(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

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

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mt-15 py-stack-lg min-h-screen">
      <header className="mb-stack-lg">
        <h1 className="font-display text-display text-on-surface">
          Shopping Cart
        </h1>
        <p className="font-body-md text-on-surface-variant">
          You have {cartItems.length} item{cartItems.length === 1 ? "" : "s"} in
          your cart.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-stack-md">
          {cartItems.map((item) => {
            const isRemoving = removingItemIds.has(item.id);

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
                      By {item.instructor} • {item.duration}
                    </p>

                    <div className="flex items-center gap-1 text-tertiary">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-label-md text-label-md">
                        {item.rating} ({item.reviews.toLocaleString("en-US")}{" "}
                        reviews)
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
                      className="text-primary font-label-md text-label-md hover:underline"
                    >
                      Move to Wishlist
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
                Your cart is empty
              </h2>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Add some courses to start learning today.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-stack-md">
            <section className="glass-card p-stack-md rounded-xl">
              <h4 className="font-label-md text-label-md text-on-surface mb-stack-sm">
                Promotions
              </h4>
              <div className="flex gap-2">
                <div className="relative grow">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    local_offer
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
                    placeholder="Enter coupon code"
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
                  {isCouponApplied ? "Applied!" : "Apply"}
                </button>
              </div>
            </section>

            <section className="bg-surface-container-highest p-stack-lg rounded-xl shadow-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                Order Summary
              </h2>

              <div className="space-y-4 mb-stack-lg">
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Original Price</span>
                  <span>{formatMoney(originalPrice)}</span>
                </div>
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Course Discounts</span>
                  <span className="text-error">
                    -{formatMoney(totalDiscount)}
                  </span>
                </div>
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Tax</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="h-px bg-outline-variant/30 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-headline-md text-on-surface">
                    Total
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
                Proceed to Checkout
              </button>

              <div className="mt-stack-md flex items-center justify-center gap-2 text-on-surface-variant text-body-sm opacity-70">
                <span className="material-symbols-outlined text-[16px]">
                  lock
                </span>
                <span>Secure checkout powered by Stripe</span>
              </div>
            </section>

            <section className="space-y-stack-sm">
              <h4 className="font-label-md text-label-md text-on-surface-variant px-1">
                You might also like
              </h4>
              <div className="grid grid-cols-2 gap-stack-sm">
                {RECOMMENDATIONS.map((item) => (
                  <article
                    key={item.id}
                    className="bg-surface rounded-lg p-2 border border-outline-variant/30 hover:border-primary/50 cursor-pointer transition-colors group"
                  >
                    <div className="aspect-video rounded-md bg-surface-variant overflow-hidden mb-2">
                      <img
                        className="w-full h-full object-cover"
                        src={item.image}
                        alt={item.title}
                      />
                    </div>
                    <p className="font-label-sm text-label-sm truncate">
                      {item.title}
                    </p>
                    <p className="font-label-md text-label-md text-primary">
                      {formatMoney(item.price)}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
