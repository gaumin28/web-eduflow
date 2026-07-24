import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useCart } from "../../contexts/CartContext";
import { checkoutCart } from "../../services/cartService";

const PAYMENT_OPTIONS = [
  {
    key: "card",
    label: "Thẻ tín dụng",
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

function validateCheckoutForm(paymentType, formValues) {
  const errors = {};

  if (paymentType === "card") {
    if (!formValues.cardholderName.trim()) {
      errors.cardholderName = "Vui lòng nhập tên chủ thẻ.";
    }

    const cardNumberDigits = formValues.cardNumber.replace(/\D/g, "");
    if (!cardNumberDigits) {
      errors.cardNumber = "Vui lòng nhập số thẻ.";
    } else if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
      errors.cardNumber = "Số thẻ không hợp lệ.";
    }

    const expiry = formValues.expiryDate.trim();
    if (!expiry) {
      errors.expiryDate = "Vui lòng nhập ngày hết hạn.";
    } else if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) {
      errors.expiryDate = "Vui lòng dùng định dạng MM/YY.";
    }

    const cvvDigits = formValues.cvv.replace(/\D/g, "");
    if (!cvvDigits) {
      errors.cvv = "Vui lòng nhập CVV.";
    } else if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      errors.cvv = "CVV không hợp lệ.";
    }
  }

  if (!formValues.streetAddress.trim()) {
    errors.streetAddress = "Vui lòng nhập địa chỉ đường.";
  }

  if (!formValues.city.trim()) {
    errors.city = "Vui lòng nhập thành phố.";
  }

  if (!formValues.postalCode.trim()) {
    errors.postalCode = "Vui lòng nhập mã bưu chính.";
  }

  return errors;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [paymentType, setPaymentType] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    streetAddress: "",
    city: "",
    postalCode: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

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
  const liveValidationErrors = useMemo(
    () => validateCheckoutForm(paymentType, formValues),
    [paymentType, formValues],
  );
  const isCheckoutFormValid = Object.keys(liveValidationErrors).length === 0;
  const canCompletePurchase =
    cartItems.length > 0 && !isSubmitting && isCheckoutFormValid;

  const handleCompletePurchase = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    const validationErrors = validateCheckoutForm(paymentType, formValues);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      message.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    setFieldErrors({});

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

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mt-15 py-stack-lg min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Thanh toán
            </h1>

            <div className="space-y-4">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Phương thức thanh toán
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
                  Tên chủ thẻ
                </label>
                <input
                  className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                    fieldErrors.cardholderName
                      ? "border-error"
                      : "border-outline-variant"
                  }`}
                  placeholder="Nguyen Van A"
                  type="text"
                  value={formValues.cardholderName}
                  onChange={(event) =>
                    handleFieldChange("cardholderName", event.target.value)
                  }
                />
                {fieldErrors.cardholderName ? (
                  <p className="text-error text-xs">
                    {fieldErrors.cardholderName}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">
                  Số thẻ
                </label>
                <div className="relative">
                  <input
                    className={`w-full bg-surface-container-lowest border rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      fieldErrors.cardNumber
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    placeholder="0000 0000 0000 0000"
                    type="text"
                    value={formValues.cardNumber}
                    onChange={(event) =>
                      handleFieldChange("cardNumber", event.target.value)
                    }
                  />
                  <span className="absolute right-4 top-3.5 material-symbols-outlined text-on-surface-variant">
                    lock
                  </span>
                </div>
                {fieldErrors.cardNumber ? (
                  <p className="text-error text-xs">{fieldErrors.cardNumber}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Ngày hết hạn
                  </label>
                  <input
                    className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      fieldErrors.expiryDate
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    placeholder="MM/YY"
                    type="text"
                    value={formValues.expiryDate}
                    onChange={(event) =>
                      handleFieldChange("expiryDate", event.target.value)
                    }
                  />
                  {fieldErrors.expiryDate ? (
                    <p className="text-error text-xs">
                      {fieldErrors.expiryDate}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    CVV
                  </label>
                  <input
                    className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      fieldErrors.cvv
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    placeholder="123"
                    type="text"
                    value={formValues.cvv}
                    onChange={(event) =>
                      handleFieldChange("cvv", event.target.value)
                    }
                  />
                  {fieldErrors.cvv ? (
                    <p className="text-error text-xs">{fieldErrors.cvv}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Địa chỉ thanh toán
              </p>
              <div className="glass-card p-stack-md rounded-xl space-y-4 shadow-sm">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Địa chỉ đường
                  </label>
                  <input
                    className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      fieldErrors.streetAddress
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    placeholder="123 Đường Giáo Dục"
                    type="text"
                    value={formValues.streetAddress}
                    onChange={(event) =>
                      handleFieldChange("streetAddress", event.target.value)
                    }
                  />
                  {fieldErrors.streetAddress ? (
                    <p className="text-error text-xs">
                      {fieldErrors.streetAddress}
                    </p>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Thành phố
                    </label>
                    <input
                      className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                        fieldErrors.city
                          ? "border-error"
                          : "border-outline-variant"
                      }`}
                      placeholder="TP. Ho Chi Minh"
                      type="text"
                      value={formValues.city}
                      onChange={(event) =>
                        handleFieldChange("city", event.target.value)
                      }
                    />
                    {fieldErrors.city ? (
                      <p className="text-error text-xs">{fieldErrors.city}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Mã bưu chính
                    </label>
                    <input
                      className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                        fieldErrors.postalCode
                          ? "border-error"
                          : "border-outline-variant"
                      }`}
                      placeholder="94103"
                      type="text"
                      value={formValues.postalCode}
                      onChange={(event) =>
                        handleFieldChange("postalCode", event.target.value)
                      }
                    />
                    {fieldErrors.postalCode ? (
                      <p className="text-error text-xs">
                        {fieldErrors.postalCode}
                      </p>
                    ) : null}
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
                Tóm tắt đơn hàng
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
                        Giảng viên: {item.instructor}
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
                  <span>Tạm tính</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Giảm giá</span>
                  <span>-{formatMoney(saleDiscount)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Thuế</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="flex justify-between font-headline-md text-headline-md text-on-surface pt-2">
                  <span>Tổng cộng</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompletePurchase}
                disabled={!canCompletePurchase}
                className="w-full py-4 rounded-xl font-label-md text-label-md text-on-primary shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group bg-linear-to-r from-primary-container to-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {isSubmitting ? "Đang xử lý..." : "Hoàn tất thanh toán"}
                </span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              {cartItems.length > 0 && !isCheckoutFormValid ? (
                <p className="font-body-sm text-body-sm text-error text-center">
                  Vui lòng điền đầy đủ các trường bắt buộc để tiếp tục.
                </p>
              ) : null}

              <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                Khi nhấn "Hoàn tất thanh toán", bạn đồng ý với Điều khoản dịch
                vụ và Chính sách hoàn tiền của EduFlow.
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
                  Cam kết hoàn tiền trong 30 ngày
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Hoàn tiền 100%, không cần giải thích.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
