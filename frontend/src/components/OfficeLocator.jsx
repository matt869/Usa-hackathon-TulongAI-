import { useEffect, useState } from "react";

const copy = {
  en: {
    title: "Where to Apply",
    subtitle: "Government office contacts for your eligible programs",
    phone: "Phone",
    website: "Website",
    loading: "Loading office info...",
  },
  fil: {
    title: "Saan Mag-aapply",
    subtitle: "Mga contact ng opisina ng gobyerno para sa iyong mga programang kwalipikado",
    phone: "Telepono",
    website: "Website",
    loading: "Naglo-load ng impormasyon ng opisina...",
  },
};

const AGENCY_MAP = {
  "4ps": "DSWD",
  aics: "DSWD",
  solo_parent: "DSWD",
  philhealth: "PhilHealth",
  tupad: "DOLE",
  sss: "SSS",
  osca: "LGU",
  pwd_benefits: "LGU",
  unifast_tes: "CHED",
};

export default function OfficeLocator({ programs, language }) {
  const t = copy[language] || copy.en;
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  const eligibleAgencies = [
    ...new Set(
      programs
        .filter((p) => p.eligible)
        .map((p) => AGENCY_MAP[p.program_id])
        .filter(Boolean)
    ),
  ];

  useEffect(() => {
    if (eligibleAgencies.length === 0) {
      setLoading(false);
      return;
    }
    fetch("/api/offices")
      .then((r) => r.json())
      .then((data) => {
        const matched = data.offices.filter((o) =>
          eligibleAgencies.includes(o.agency)
        );
        setOffices(matched);
      })
      .catch(() => setOffices([]))
      .finally(() => setLoading(false));
  }, [programs]);

  if (eligibleAgencies.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
        {t.title}
      </h2>
      <p className="text-xs text-gray-400 mb-4">{t.subtitle}</p>

      {loading ? (
        <p className="text-sm text-gray-400">{t.loading}</p>
      ) : (
        <div className="space-y-3">
          {offices.map((office) => (
            <div
              key={office.name}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-tulong-blue uppercase tracking-wide">
                    {office.agency}
                  </p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5">
                    {office.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{office.address}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{office.region}</span>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-600">
                {office.phone && (
                  <span>
                    {t.phone}: <strong>{office.phone}</strong>
                  </span>
                )}
                {office.website && (
                  <a
                    href={office.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tulong-blue hover:underline"
                  >
                    {t.website} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
