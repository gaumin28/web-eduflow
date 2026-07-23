import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll("section > div");
    elements.forEach((el) => {
      el.classList.add(
        "transition-all",
        "duration-700",
        "opacity-0",
        "translate-y-8",
      );
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-fixed-dim selection:text-primary ">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[819px] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="EduFlow Background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDFGEgyDJxMW4qUQ42209he163lNbJEwyp8q7BWvhZIuWY5SDp6VmQJjQ_mg8TNV8zW7CspVBqAE92X2yFzpK_lqHf6r06AdmGOv76VqPIQjYkrmkeya2NddDxV2G0rjlKA2wPafmpI_OhZQ0RDFnNSkC9WIzJ5NamqCKvZ2D8ymJDG6CkARE1SoxHTYZ3GLp6F7hcjS875wUAKMKpFtfMrRoaf6ahRZCINfX5Pe4xyu0im2RFRYozw2xy2fgQgzjdahNrr1MsViY"
            />
            <div className="absolute inset-0 bg-linear-to-br from-primary/90 to-tertiary/70 mix-blend-multiply opacity-90"></div>
          </div>
          <div className="relative z-10 px-margin-desktop max-w-7xl mx-auto w-full text-white">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full font-label-sm text-label-sm mb-stack-md uppercase tracking-wider">
                Chào mừng đến với EduFlow
              </span>
              <h1 className="font-display text-display mb-stack-md leading-tight">
                Nâng tầm tri thức Việt qua giáo dục số hiện đại.
              </h1>
              <p className="font-body-lg text-body-lg text-white/80 mb-stack-lg max-w-2xl">
                Chúng tôi không chỉ cung cấp các khóa học, chúng tôi xây dựng một
                cộng đồng học tập không giới hạn, nơi kiến thức được truyền tải một
                cách chuyên nghiệp và tinh tế nhất.
              </p>
              <div className="flex flex-wrap gap-stack-md">
                <Link
                  to="/courses/search"
                  className="px-8 py-4 bg-white text-primary font-label-md text-label-md rounded-xl font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  Khám phá ngay
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="relative z-20 -mt-16 px-margin-desktop max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-stack-lg shadow-2xl flex flex-wrap justify-around items-center gap-stack-lg text-center border border-outline-variant/50">
            <div className="flex flex-col gap-unit">
              <span className="font-display text-display text-primary">100k+</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Học viên tin tưởng
              </span>
            </div>
            <div className="w-px h-16 bg-outline-variant hidden lg:block"></div>
            <div className="flex flex-col gap-unit">
              <span className="font-display text-display text-primary">500+</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Giảng viên chuyên gia
              </span>
            </div>
            <div className="w-px h-16 bg-outline-variant hidden lg:block"></div>
            <div className="flex flex-col gap-unit">
              <span className="font-display text-display text-primary">1000+</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Khóa học thực chiến
              </span>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 px-margin-desktop max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-stack-md">
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Tầm nhìn & Sứ mệnh
              </h2>
              <div className="p-stack-lg bg-surface-container rounded-3xl border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md mb-stack-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    visibility
                  </span>{" "}
                  Tầm nhìn
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Trở thành nền tảng giáo dục số hàng đầu Đông Nam Á, nơi mọi cá
                  nhân đều có thể tiếp cận với tri thức tinh hoa từ các chuyên gia
                  hàng đầu một cách dễ dàng và hiệu quả nhất.
                </p>
              </div>
              <div className="p-stack-lg bg-white/70 backdrop-blur-md rounded-3xl border border-primary/20">
                <h3 className="font-headline-md text-headline-md mb-stack-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    rocket_launch
                  </span>{" "}
                  Sứ mệnh
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Bình đẳng hóa cơ hội học tập thông qua công nghệ, cung cấp lộ
                  trình học tập cá nhân hóa và hỗ trợ cộng đồng tri thức Việt vươn
                  tầm quốc tế.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
              <img
                className="relative rounded-[40px] shadow-2xl w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                alt="Vision"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZUvOzNXPa5Ihz4XyC6GWsR-Tdgnngl5ksYxhxkUt3GKvIBkK0-6FKA-YNzM8DfZTulj3wpvGsaV2cWoJkFdmxsH50aGt3G6xLjOzD7xF7rLlC9XdKUJk2ovD6zLDEdz41BaYYwHfNCxsDO1EkqBj8I5dA4CB0u0tFiTsfbiSaYdPALnlAwGOEggVUSqhCLwMDLOA69tQgNIGHEOB0hUd-qWF5A-znGNU3ToBcd4-O_HNGAgtbP6ZWjNz4a6Q4t4XcKckTo5ng1MI"
              />
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-surface-container-low">
          <div className="px-margin-desktop max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg mb-stack-sm">
                Giá trị cốt lõi
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Những nguyên tắc vàng giúp EduFlow xây dựng niềm tin và sự thành
                công bền vững cùng học viên.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-stack-lg bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant hover:border-primary transition-colors group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-stack-md group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-4xl">
                    verified
                  </span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-stack-sm">
                  Chất lượng
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tất cả bài giảng đều được kiểm duyệt gắt gao về mặt chuyên môn và
                  kỹ thuật sản xuất, đảm bảo trải nghiệm học tập tốt nhất.
                </p>
              </div>
              <div className="p-stack-lg bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant hover:border-primary transition-colors group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-stack-md group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-4xl">
                    lightbulb
                  </span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-stack-sm">
                  Sáng tạo
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chúng tôi không ngừng đổi mới phương pháp giảng dạy và ứng dụng AI
                  để tối ưu hóa lộ trình học tập cá nhân hóa.
                </p>
              </div>
              <div className="p-stack-lg bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant hover:border-primary transition-colors group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-stack-md group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-4xl">
                    favorite
                  </span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-stack-sm">
                  Tận tâm
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Đội ngũ hỗ trợ và giảng viên luôn sẵn sàng đồng hành cùng học viên
                  24/7 trên con đường chinh phục tri thức mới.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-24 px-margin-desktop max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-stack-sm">
              Đội ngũ lãnh đạo
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Hội tụ những chuyên gia tâm huyết với nền giáo dục Việt Nam và kinh
              nghiệm từ các tập đoàn công nghệ toàn cầu.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="group text-center">
              <div className="relative mb-stack-md overflow-hidden rounded-[32px]">
                <img
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="CEO"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOj0FxnMa362KsACO_mBdG-Z7mNI50ecx8idzw_DtUDgxzkL6_sIRGKBtVVpBYiroHS6ROjtq-NOMr4RBsi4-QA4yV6jUBWVa3FxYIrMVcvTq7Ti5v43zl5bb0_5SECXDXjJ_pzq0ncbgWYNvYD-_YE_bYk2FkfTK9uG_EhRYMzsnfsBgcxCaoW4pdzh4_hcI08BUpriAs3B-X9J8B19KYI9RtiH_iqarKMP_HMrbXlNSy2PtrhM2GfmtZYfnRvPJ8fjwvxADmrv4"
                />
              </div>
              <h5 className="font-headline-md text-headline-md mb-1">
                Dr. Nguyễn Minh Quân
              </h5>
              <p className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">
                Founder & CEO
              </p>
            </div>
            <div className="group text-center">
              <div className="relative mb-stack-md overflow-hidden rounded-[32px]">
                <img
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="CTO"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyAcGywcvlnvHZ4nxQRxFgZq09EPwGZTC8jyeiN_pWQi83x5R92cU65qatS4lH6e4wqvVjD-HW7vR_y5dwhOeN0BsH0MjZIbKp8tkmscf7C1kZI-M5gOrFbMsvi1uxXSjrasgl7in41CJmYSgBJQuL_iZZwY0hEPpXBIoKr4VEyTFQQhaoFUOVhBzSfoQnfFcQwv61mw3Q5pDzAEYEeAx59aNp873QpvPDFaAgT01CLC3TgJgFj8DRstGS70np55JgpY5ech8SYGk"
                />
              </div>
              <h5 className="font-headline-md text-headline-md mb-1">
                Trần Thu Hương
              </h5>
              <p className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">
                Chief Technology Officer
              </p>
            </div>
            <div className="group text-center">
              <div className="relative mb-stack-md overflow-hidden rounded-[32px]">
                <img
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="CPO"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCAcJ4UmNIA_fRf-fJjBkzWR_DkSad2OpKJVWog5PfdGEx23DX1OnJUOzXN47OTlbQU0na1z4JHKXpqWTWshcD32EVQE2aKMWuq1uCODklLPTU_RwrPW6h1h0AXUxJyjHf_wHpryEigEou57hb_fgK-5VOn9jn5zR4XfHQZhGlgV6GySplroZl4Xz9fXbWw5S_Ts4uA6JtbL-fQI5miWp8WV446cBM9SuM6pQk8gp03uK5k7W_3g6Ku7xskXjW64xenxlSNnMqw_A"
                />
              </div>
              <h5 className="font-headline-md text-headline-md mb-1">
                Lê Hoàng Nam
              </h5>
              <p className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">
                Chief Product Officer
              </p>
            </div>
            <div className="group text-center">
              <div className="relative mb-stack-md overflow-hidden rounded-[32px]">
                <img
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Head of Education"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5DyhruXTTGRGwAb6PtTPNluLvoNB-CM_mfNXeDOb8vbU_Rz2jqQmygr91eNTl_a88jQYXG7YmzJoOwANZybWt8RNTRUTfiSchhoNu3gVIIQtbecsySpZFxrA5chC6qG92GYpoh9pA9j6Sdp4uiWp4bzxnBh1OccSOP58mSk5bI5sVyRoqmfyPCqIDw6mOctGo5uye8YkpHW-o3KVekS1P4nkfjnb1yGHpJaJFEod9DFSIKX__WJYC110mG8RsuCUmVinqZatuZ8o"
                />
              </div>
              <h5 className="font-headline-md text-headline-md mb-1">
                Phạm Ngọc Ánh
              </h5>
              <p className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">
                Head of Education
              </p>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="px-margin-desktop max-w-7xl mx-auto">
            <p className="text-center font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-12">
              Đối tác chiến lược
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 grayscale opacity-60 hover:grayscale-0 transition-all duration-500">
              <div className="h-10 w-32 flex items-center justify-center font-headline-md text-headline-md font-bold text-on-surface-variant">
                UNI-TECH
              </div>
              <div className="h-10 w-32 flex items-center justify-center font-headline-md text-headline-md font-bold text-on-surface-variant">
                GlobalDev
              </div>
              <div className="h-10 w-32 flex items-center justify-center font-headline-md text-headline-md font-bold text-on-surface-variant">
                FutureEd
              </div>
              <div className="h-10 w-32 flex items-center justify-center font-headline-md text-headline-md font-bold text-on-surface-variant">
                CloudSys
              </div>
              <div className="h-10 w-32 flex items-center justify-center font-headline-md text-headline-md font-bold text-on-surface-variant">
                NextGen
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-margin-desktop max-w-7xl mx-auto">
          <div className="relative rounded-[48px] overflow-hidden bg-primary px-stack-lg py-20 text-center">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-display text-display text-white mb-stack-md">
                Sẵn sàng để bắt đầu hành trình mới?
              </h2>
              <p className="font-body-lg text-body-lg text-white/80 mb-stack-lg">
                Tham gia cùng hơn 100,000 học viên khác hoặc trở thành giảng viên
                để chia sẻ kiến thức của bạn với cộng đồng.
              </p>
              <div className="flex flex-wrap justify-center gap-stack-md">
                <Link
                  to="/register"
                  className="px-10 py-5 bg-white text-primary font-label-md text-label-md font-bold rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Đăng ký học viên
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
