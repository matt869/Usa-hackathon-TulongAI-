import { useState } from "react";

export default function ReasoningTrace({ trace, language }) {
  const [open, setOpen] = useState(false);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {language === "fil" ? "Bakas ng Pagsusuri" : "Reasoning Trace"}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 py-3 bg-white">
          <div className="font-mono text-[11px] text-gray-500 space-y-1 leading-relaxed">
            {trace.map((line, i) => (
              <div
                key={i}
                className={`${
                  line.startsWith("✅")
                    ? "text-emerald-600"
                    : line.startsWith("❌")
                    ? "text-red-500"
                    : line.startsWith("---")
                    ? "border-t border-gray-100 pt-1 mt-1"
                    : line.startsWith("  •")
                    ? "pl-3 text-amber-600"
                    : ""
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
