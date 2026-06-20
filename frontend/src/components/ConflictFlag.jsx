export default function ConflictFlag({ conflicts, language }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        {language === "fil" ? "Mga Babala sa Salungatan" : "Conflict Warnings"}
      </h3>
      {conflicts.map((conflict, i) => (
        <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
              {language === "fil" ? "Salungatan" : "Conflict"}
            </span>
            <div className="flex gap-1">
              {conflict.programs.map((p) => (
                <span key={p} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium uppercase">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-amber-800 mb-2">{conflict.reason}</p>
          <p className="text-xs text-amber-700 font-medium">
            {language === "fil" ? "Solusyon: " : "Resolution: "}
            <span className="font-normal">{conflict.resolution}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
