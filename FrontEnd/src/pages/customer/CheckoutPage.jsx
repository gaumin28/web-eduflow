import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useCart } from "../../contexts/CartContext";
import { checkoutCart } from "../../services/cartService";

const PAYMENT_OPTIONS = [
  {
    key: "card",
    label: "Credit Card",
    icon: "credit_card",
  },
  {
    key: "paypal",
    label: "PayPal",
    icon: "account_balance_wallet",
  },
  {
    key: "gpay",
    label: "Google Pay",
    icon: "payments",
  },
];

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return currencyFormatter.format(value);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [paymentType, setPaymentType] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
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
  const taxableAmount = Math.max(subtotal - saleDiscount, 0);
  const tax = cartItems.length > 0 ? taxableAmount * 0.1 : 0;
  const total = taxableAmount + tax;

  const handleCompletePurchase = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await checkoutCart({ payment_method: paymentType });
      await clearCart();
      message.success("Checkout thành công!");
      navigate("/user/dashboard");
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      message.error(backendMessage || "Checkout thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mt-15 py-stack-lg min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Checkout
            </h1>

            <div className="space-y-4">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Payment Method
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PAYMENT_OPTIONS.map((option) => {
                  const active = paymentType === option.key;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setPaymentType(option.key)}
                      className={`cursor-pointer glass-card p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        active
                          ? "border-primary ring-2 ring-primary/20 bg-primary-container/5"
                          : "border-transparent hover:border-outline-variant"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          active ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {option.icon}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`glass-card p-stack-md rounded-xl space-y-4 shadow-sm transition-opacity ${
                paymentType === "card"
                  ? "opacity-100"
                  : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">
                  Cardholder Name
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="John Doe"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                  />
                  <span className="absolute right-4 top-3.5 material-symbols-outlined text-on-surface-variant">
                    lock
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Expiry Date
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="MM/YY"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    CVV
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="123"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Billing Address
              </p>
              <div className="glass-card p-stack-md rounded-xl space-y-4 shadow-sm">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Street Address
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="123 Education Lane"
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      City
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="San Francisco"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Postal Code
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="94103"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="glass-card rounded-2xl p-stack-lg shadow-sm flex flex-col gap-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
                      <img
                        className="w-full h-full object-cover"
                        alt={item.title}
                        src={item.image}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-label-md text-label-md text-on-surface leading-snug">
                        {item.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Instructor: {item.instructor}
                      </p>
                      <p className="font-label-md text-label-md text-primary mt-1">
                        {formatMoney(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 ? (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Giỏ hàng của bạn đang trống.
                  </p>
                ) : null}
              </div>

              <hr className="border-outline-variant/30" />

              <div className="space-y-2">
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Discount</span>
                  <span>-{formatMoney(saleDiscount)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Taxes</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="flex justify-between font-headline-md text-headline-md text-on-surface pt-2">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompletePurchase}
                disabled={cartItems.length === 0 || isSubmitting}
                className="w-full py-4 rounded-xl font-label-md text-label-md text-on-primary shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group bg-linear-to-r from-primary-container to-primary"
              >
                <span>
                  {isSubmitting ? "Processing..." : "Complete Purchase"}
                </span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                By clicking "Complete Purchase", you agree to EduFlow&apos;s
                Terms of Service and Refund Policy.
              </p>

              <div className="flex justify-center items-center gap-6 pt-2 grayscale opacity-60">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    verified_user
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    SSL Secure
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    encrypted
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    AES-256
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    shield
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    PCI DSS
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 flex items-center gap-4 bg-surface-container-low border-dashed">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  published_with_changes
                </span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface">
                  30-Day Money Back Guarantee
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  No questions asked, 100% refund.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
