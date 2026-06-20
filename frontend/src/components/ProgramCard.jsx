const agencyColors = {
  DSWD: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PhilHealth: "bg-blue-50 text-blue-700 border-blue-200",
  DOLE: "bg-amber-50 text-amber-700 border-amber-200",
  SSS: "bg-violet-50 text-violet-700 border-violet-200",
};

const agencyIcons = {
  DSWD: "🏠",
  PhilHealth: "🏥",
  DOLE: "💼",
  SSS: "🛡️",
};

export default function ProgramCard({ program }) {
  const colorClass = agencyColors[program.agency] || "bg-gray-50 text-gray-700 border-gray-200";
  const icon = agencyIcons[program.agency] || "📋";

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-all ${
        program.eligible
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
          : "border-gray-100 bg-gray-50 opacity-75"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>
              {program.agency}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {program.eligible ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Eligible
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Not Eligible
            </span>
          )}
          <span className="text-xs text-gray-400">{Math.round(program.confidence * 100)}%</span>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{program.name}</h3>
      <p className="text-xs text-gray-500 mb-3">{program.description}</p>

      {/* Benefits */}
      <div className="bg-white/70 rounded-lg px-3 py-2 mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Benefits</p>
        <p className="text-sm font-medium text-gray-800">{program.benefits}</p>
      </div>

      {/* Gaps */}
      {program.gaps && program.gaps.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-amber-600 mb-1">Why you may not qualify:</p>
          <ul className="space-y-1">
            {program.gaps.map((gap, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {program.eligible && program.next_steps && program.next_steps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-tulong-blue mb-1">Next steps:</p>
          <ol className="space-y-1">
            {program.next_steps.slice(0, 3).map((step, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-tulong-blue/10 text-tulong-blue text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* NGO Alternatives */}
      {!program.eligible && program.ngo_alternatives && program.ngo_alternatives.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">NGO alternatives:</p>
          {program.ngo_alternatives.slice(0, 2).map((ngo, i) => (
            <div key={i} className="text-xs text-gray-600 mb-1">
              <span className="font-medium text-tulong-blue">{ngo.name}</span>
              {" — "}{ngo.description.substring(0, 80)}...
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
