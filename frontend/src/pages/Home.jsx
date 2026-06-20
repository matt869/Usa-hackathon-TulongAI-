import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BilingualToggle from "../components/BilingualToggle";
import IntakeForm from "../components/IntakeForm";
import ProgramGrid from "../components/ProgramGrid";
import { useEligibility } from "../hooks/useEligibility";

const hero = {
  en: {
    badge: "Free • Confidential • Instant",
    heading: "Find the help you deserve.",
    sub: "Tulong AI checks your eligibility for 4Ps, PhilHealth, TUPAD, SSS, AICS, Solo Parent, OSCA, PWD, and UniFAST TES — in seconds.",
    programs: ["4Ps", "PhilHealth", "TUPAD", "SSS", "AICS", "Solo Parent", "OSCA", "PWD", "UniFAST"],
  },
  fil: {
    badge: "Libre • Kumpidensyal • Agaran",
    heading: "Hanapin ang tulong na nararapat sa iyo.",
    sub: "Sinusuri ng Tulong AI ang iyong pagiging karapat-dapat para sa 4Ps, PhilHealth, TUPAD, SSS, AICS, Solo Parent, OSCA, PWD, at UniFAST TES — sa loob ng ilang segundo.",
    programs: ["4Ps", "PhilHealth", "TUPAD", "SSS", "AICS", "Solo Parent", "OSCA", "PWD", "UniFAST"],
  },
};

export default function Home() {
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const { checkFromText, checkStructured, loading, error } = useEligibility();
  const t = hero[language];

  const handleSubmit = async (submission) => {
    let results;
    if (submission.type === "freetext") {
      results = await checkFromText(submission.text, language);
    } else {
      results = await checkStructured({ ...submission.data, language });
    }
    if (results) {
      navigate("/results", { state: { results, language } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-tulong-blue to-blue-700">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-tulong-blue font-black text-sm">T</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Tulong AI</span>
        </div>
        <BilingualToggle language={language} onChange={setLanguage} />
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Hero */}
        <div className="text-white">
          <span className="inline-block text-xs font-semibold bg-white/15 text-white/90 px-3 py-1 rounded-full mb-6 tracking-wide">
            {t.badge}
          </span>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
            {t.heading}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8">{t.sub}</p>

          {/* Program Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {t.programs.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 bg-white/10 text-white/80 text-sm rounded-full border border-white/20"
              >
                {p}
              </span>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="space-y-2">
            {[
              { icon: "🔒", en: "Your answers are never stored", fil: "Ang iyong mga sagot ay hindi naka-store" },
              { icon: "🤖", en: "AI-powered, human-verified rules", fil: "AI-powered, pinatunayan ng tao" },
              { icon: "🇵🇭", en: "Built for Filipinos, by Filipinos", fil: "Ginawa para sa mga Pilipino" },
            ].map((item) => (
              <div key={item.en} className="flex items-center gap-2 text-white/60 text-sm">
                <span>{item.icon}</span>
                <span>{item[language]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}
          <IntakeForm language={language} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>

      <ProgramGrid language={language} />
    </div>
  );
}
