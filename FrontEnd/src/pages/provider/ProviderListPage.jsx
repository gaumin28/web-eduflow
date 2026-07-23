import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProviders } from "../../services/homeService";

export default function ProviderListPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProviders()
      .then(({ data }) => setProviders(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-24 pb-stack-lg min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-stack-md">
          <Link
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary"
            to="/"
          >
            Home
          </Link>
          <span className="material-symbols-outlined text-[16px] text-outline">
            chevron_right
          </span>
          <span className="font-label-md text-label-md text-primary">
            Nhà cung cấp
          </span>
        </nav>

        {/* Header */}
        <section className="mb-stack-lg p-stack-lg rounded-xl bg-linear-to-br from-tertiary-container to-primary-container text-on-primary-container relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-display text-display mb-4">Giảng viên & Nhà cung cấp</h1>
            <p className="font-body-lg text-body-lg opacity-90 leading-relaxed">
              Học hỏi từ các chuyên gia hàng đầu trong ngành. Đội ngũ giảng viên của chúng tôi luôn sẵn sàng chia sẻ kiến thức thực tế và kinh nghiệm quý báu để giúp bạn phát triển.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
            <span
              className="material-symbols-outlined text-[240px]"
              style={{ fontVariationSettings: "'wght' 100" }}
            >
              groups
            </span>
          </div>
        </section>

        {/* Grid List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface border border-outline-variant/30 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-surface-container" />
                <div className="h-4 bg-surface-container rounded w-24" />
                <div className="h-3 bg-surface-container rounded w-16" />
              </div>
            ))
          ) : (
            providers.map((prov) => {
              const providerImage = Array.isArray(prov.images)
                ? prov.images[0]
                : prov.images;

              return (
                <Link
                  key={prov._id}
                  to={`/courses-provider?providerId=${prov._id}`}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-surface border border-outline-variant/30 hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center ring-4 ring-primary/10 group-hover:ring-primary/40 transition-all">
                    {providerImage ? (
                      <img
                        src={providerImage}
                        alt={prov.provider_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-[40px]">
                        person
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-label-md text-[16px] text-on-surface line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {prov.provider_name}
                    </p>
                    <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-1">
                      {prov.career || "Giảng viên"}
                    </p>
                  </div>
                  <div className="mt-2 text-primary font-label-sm text-[12px] bg-primary/10 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    Xem hồ sơ
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
