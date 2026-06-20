export default function NGOFallback({ programs, language }) {
  const ngos = programs
    .filter((p) => !p.eligible && p.ngo_alternatives && p.ngo_alternatives.length > 0)
    .flatMap((p) => p.ngo_alternatives);

  // Deduplicate by name
  const seen = new Set();
  const unique = ngos.filter((n) => {
    if (seen.has(n.name)) return false;
    seen.add(n.name);
    return true;
  });

  if (unique.length === 0) return null;

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
      <h3 className="text-sm font-bold text-indigo-800 mb-1 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {language === "fil" ? "Mga Alternatibong Organisasyon" : "NGO Alternatives"}
      </h3>
      <p className="text-xs text-indigo-600 mb-4">
        {language === "fil"
          ? "Hindi ka kwalipikado sa ilang programa ng gobyerno, ngunit ang mga organisasyong ito ay maaaring makatulong."
          : "You may not qualify for some government programs, but these organizations may still help."}
      </p>
      <div className="space-y-3">
        {unique.map((ngo, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-indigo-100">
            <p className="text-sm font-semibold text-gray-800 mb-1">{ngo.name}</p>
            <p className="text-xs text-gray-600 mb-2">{ngo.description}</p>
            <div className="flex gap-3">
              {ngo.website && (
                <a
                  href={ngo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-tulong-blue hover:underline font-medium"
                >
                  {language === "fil" ? "Bisitahin ang Website" : "Visit Website"} →
                </a>
              )}
              {ngo.contact && (
                <span className="text-xs text-gray-400">{ngo.contact}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
