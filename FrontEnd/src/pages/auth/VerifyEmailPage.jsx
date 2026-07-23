import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { verifyEmail, resendVerification } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

const STATE = {
  PENDING: "pending",
  SUCCESS: "success",
};

export default function VerifyEmailPage() {
  const [activeState, setActiveState] = useState(STATE.PENDING);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const displayEmail = location.state?.email ?? user?.email ?? "your email";

  // Auto-verify if token present in URL (?token=xxx)
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;
    verifyEmail(token)
      .then(() => setActiveState(STATE.SUCCESS))
      .catch(() => setVerifyError("Verification link is invalid or expired."));
  }, [searchParams]);

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    try {
      await resendVerification(displayEmail);
      setResendMsg("Verification email resent! Check your inbox.");
    } catch {
      setResendMsg("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleGoToDashboard = () => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    else if (user?.role === "instructor") navigate("/instructor/dashboard");
    else navigate("/dashboard");
  };

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md [&::selection]:bg-primary-container [&::selection]:text-on-primary-container">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -right-48 size-125 bg-tertiary/10 rounded-full blur-[100px] opacity-40" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop">
        {/* Logo */}
        <div className="mb-stack-lg">
          <h1 className="font-display text-display font-bold text-primary tracking-tight">
            EduFlow
          </h1>
        </div>

        <div className="w-full max-w-xl">
          {verifyError && (
            <p className="text-red-400 text-sm text-center mb-4">
              {verifyError}
            </p>
          )}

          {/* Pending Card */}
          {activeState === STATE.PENDING && (
            <div className="glass-card border border-outline-variant/30 rounded-xl p-stack-lg shadow-xl">
              <div className="flex flex-col items-center text-center">
                {/* Illustration */}
                <div className="relative w-48 h-48 mb-stack-lg float-animation">
                  <img
                    alt="Verification Pending"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH9-Bc22p28TBi5JzU0dZmNAdd9Tp3vLzotRiTVXjKevRdCHdhstTVcamMyx7YvV1SMu9t4KPKi3usX43yjlF_BtpXeBMb8438BlC3xtyrf5HBNsSXd3rHMb1WT40qMLIRX7q8AoIiekzEHbOorVoyNo86CljycxF_f21lWbdAT_ROIDZVdBGDY0CuWSj3KV5KR1IVOJ7mwujGl4omgqZPP4fXO7ZA2z-RtwLAdM7DgdjOwuwDMuQRpQzXyWyHLEfWf5QFfdvaI6g"
                  />
                  <div className="absolute inset-0 flex items-center justify-center translate-y-4">
                    <span className="material-symbols-outlined text-[64px] text-tertiary opacity-20">
                      mail
                    </span>
                  </div>
                </div>

                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
                  Verify your email
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg max-w-md">
                  We&apos;ve sent a verification link to{" "}
                  <span className="font-bold text-on-surface">
                    {displayEmail}
                  </span>
                  . Please click the link in the email to activate your account
                  and start learning.
                </p>

                <div className="flex flex-col sm:flex-row gap-stack-md w-full sm:w-auto">
                  <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    Open Email App
                    <span className="material-symbols-outlined text-[20px]">
                      open_in_new
                    </span>
                  </button>
                  <button
                    className="bg-surface-container-high text-on-surface-variant px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
                    onClick={handleResend}
                    disabled={resending}
                  >
                    {resending ? "Sending..." : "Resend Verification"}
                    <span className="material-symbols-outlined text-[20px]">
                      refresh
                    </span>
                  </button>
                </div>
                {resendMsg && (
                  <p className="mt-3 font-body-sm text-body-sm text-primary text-center">
                    {resendMsg}
                  </p>
                )}

                <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/30 w-full">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Can&apos;t find the email? Check your spam folder or{" "}
                    <a
                      className="text-primary font-semibold hover:underline"
                      href="#"
                    >
                      contact support
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Card */}
          {activeState === STATE.SUCCESS && (
            <div className="glass-card border border-outline-variant/30 rounded-xl p-stack-lg shadow-xl">
              <div className="flex flex-col items-center text-center">
                {/* Illustration */}
                <div className="relative w-48 h-48 mb-stack-lg">
                  <div className="absolute inset-0 bg-secondary/10 rounded-full scale-110 animate-pulse" />
                  <img
                    alt="Verification Success"
                    className="w-full h-full object-contain relative z-10"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpiQ_BacUX_nnOyvrulb9Q7y6oIWcmm2bYLsyaLTogoh-o1iymA9PLuzxLl2AEghkg2h1NjWlsnFzSU5kpt9PPsSWWObQRMbuy89AzKas-2lOXLw2iwQiwdnXqEs7JpfiGej452zxSZVDb6XeEX2rCQWyZbCOp0PeEP5QpFIvjSrBs58tx2cBVuvuQMxSs0Oix-iPWBP5qGwBD7xat4AjmkuEdJviVDi6jik05yxBszK8LHN_yZUWiO7ACYbCITaV0_mSGrmsQuyE"
                  />
                </div>

                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
                  Email Verified
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg max-w-md">
                  Your account is now fully active! You&apos;re all set to join
                  thousands of other students in their learning journey.
                </p>

                <div className="w-full sm:w-auto">
                  <button
                    onClick={handleGoToDashboard}
                    className="bg-linear-to-r from-primary to-tertiary text-on-primary px-12 py-4 rounded-xl font-label-md text-label-md shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                  >
                    Go to Dashboard
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>

                <div className="mt-stack-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                    Setup Complete
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Footer */}
        <footer className="mt-stack-lg text-center opacity-60">
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              verified_user
            </span>
            Secure Academic Environment by EduFlow
          </p>
        </footer>
      </main>
    </div>
  );
}
