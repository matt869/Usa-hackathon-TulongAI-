export default function PathToEligibility({ path, language }) {
  if (!path || path.length === 0) return null;

  return (
    <div className="bg-tulong-blue/5 border border-tulong-blue/20 rounded-xl p-4">
      <h3 className="text-sm font-bold text-tulong-blue mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        {language === "fil" ? "Iyong Susunod na Hakbang" : "Your Recommended Path"}
      </h3>
      <ol className="space-y-2">
        {path.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-tulong-blue text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
