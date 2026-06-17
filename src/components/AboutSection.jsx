import profilePhoto from "@/assets/profile-photo.jpeg";

const info = [
  { label: "Education", value: "Telkom University" },
  { label: "Major", value: "Informatics" },
  { label: "Location", value: "Bandung, ID" },
  { label: "Year", value: "2023 — Present" },
];

const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-16 bg-white border-b-[3px] border-black">
      {/* Section header */}
      <div className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 py-4">
            <span className="section-label">01</span>
            <div className="w-8 border-t-[3px] border-black/30" />
            <span className="section-label">About</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Headline */}
        <h2 className="font-display text-black mb-12 max-w-4xl">
          An Informatics Student With a Deep Passion for Building Meaningful Digital Experiences.
        </h2>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Photo */}
          <div className="lg:col-span-4">
            <div className="border-[5px] border-black overflow-hidden aspect-[4/5]">
              <img
                src={profilePhoto}
                alt="Jian Hazel Sitorus"
                className="w-full h-full object-cover object-[center_20%] grayscale hover:grayscale-0 transition-[filter] duration-500"
              />
            </div>
            <div className="border-[3px] border-black border-t-0 px-4 py-2 flex items-center justify-between">
              <span className="section-label">Portrait</span>
              <span className="section-label">2026</span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8 space-y-8">
            <p className="text-xl md:text-2xl text-black leading-relaxed">
              I'm an Informatics student with a strong passion for software development and AI.
              Always enthusiastic about learning new things and working on challenging projects.
            </p>
            <p className="text-base text-black/60 leading-relaxed max-w-2xl">
              In my free time, I enjoy exploring the latest technologies, contributing to open
              source, and sharing knowledge with the developer community.
            </p>

            {/* Info grid */}
            <div className="border-t-[3px] border-black pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                {info.map((item, i) => (
                  <div
                    key={item.label}
                    className={`py-6 pr-6 ${i < info.length - 1 ? "border-r-[3px] border-black pl-6 first:pl-0" : "pl-6"}`}
                  >
                    <p className="label-raw text-xs mb-2 text-black/50">{item.label}</p>
                    <p className="font-body text-sm font-semibold text-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CV download */}
            <div className="border-t-[3px] border-black pt-8">
              <a
                href="/CV_Jian Hazel Sitorus.pdf"
                download="Jian-Hazel-Sitorus-CV.pdf"
                className="btn-secondary inline-flex"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
