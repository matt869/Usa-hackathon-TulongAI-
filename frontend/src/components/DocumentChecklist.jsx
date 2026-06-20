import { useState } from "react";

export default function DocumentChecklist({ documents, language }) {
  const [checked, setChecked] = useState({});

  if (!documents || documents.length === 0) return null;

  const toggleCheck = (i) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {language === "fil" ? "Mga Dokumentong Kailangan" : "Documents Needed"}
        </h3>
        <span className="text-xs text-gray-500">
          {checkedCount}/{documents.length} {language === "fil" ? "handa" : "ready"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-emerald-400 transition-all duration-300"
          style={{ width: `${documents.length > 0 ? (checkedCount / documents.length) * 100 : 0}%` }}
        />
      </div>

      <div className="divide-y divide-gray-50">
        {documents.map((doc, i) => (
          <label
            key={i}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={() => toggleCheck(i)}
              className="w-4 h-4 rounded border-gray-300 text-tulong-blue focus:ring-tulong-blue/30"
            />
            <span className={`text-sm ${checked[i] ? "line-through text-gray-400" : "text-gray-700"}`}>
              {doc}
            </span>
          </label>
        ))}
      </div>

      {checkedCount === documents.length && documents.length > 0 && (
        <div className="bg-emerald-50 px-4 py-3 text-center">
          <p className="text-xs font-semibold text-emerald-600">
            {language === "fil"
              ? "✅ Handa ka na! Pumunta na sa iyong opisina."
              : "✅ You're ready! Head to your local office to apply."}
          </p>
        </div>
      )}
    </div>
  );
}
