import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const copy = {
  en: {
    title: "Programs We Check",
    subtitle: "9 government programs across DSWD, DOLE, PhilHealth, SSS, CHED, and LGU",
    docs: "documents required",
    viewAll: "Start eligibility check →",
  },
  fil: {
    title: "Mga Programang Sinusuri Namin",
    subtitle: "9 programang pang-gobyerno mula sa DSWD, DOLE, PhilHealth, SSS, CHED, at LGU",
    docs: "mga dokumentong kailangan",
    viewAll: "Simulan ang pagsuri →",
  },
};

export default function ProgramGrid({ language }) {
  const t = copy[language] || copy.en;
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then((data) => setPrograms(data.programs || []))
      .catch(() => setPrograms([]));
  }, []);

  if (programs.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">{t.title}</h2>
        <p className="text-white/60 text-sm mt-2">{t.subtitle}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((p) => (
          <div
            key={p.id}
            className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-white"
          >
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">
              {p.agency}
            </p>
            <p className="font-bold text-sm mt-1 leading-snug">{p.name}</p>
            <p className="text-xs text-white/60 mt-2 line-clamp-2">{p.description}</p>
            <p className="text-xs text-emerald-300/80 mt-2">{p.benefits}</p>
            <p className="text-xs text-white/40 mt-2">
              {p.documents_count} {t.docs}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/"
          className="text-white/70 hover:text-white text-sm font-medium transition-colors"
        >
          {t.viewAll}
        </Link>
      </div>
    </section>
  );
}
