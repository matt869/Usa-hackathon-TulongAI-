import { useLocation, useNavigate } from "react-router-dom";
import ProgramCard from "../components/ProgramCard";
import ReasoningTrace from "../components/ReasoningTrace";
import PathToEligibility from "../components/PathToEligibility";
import ConflictFlag from "../components/ConflictFlag";
import DocumentChecklist from "../components/DocumentChecklist";
import NGOFallback from "../components/NGOFallback";
import OfficeLocator from "../components/OfficeLocator";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, language } = location.state || {};

  if (!results) {
    navigate("/");
    return null;
  }

  const eligible = results.programs.filter((p) => p.eligible);
  const ineligible = results.programs.filter((p) => !p.eligible);

  const copy = {
    en: {
      back: "← Check Again",
      title: "Your Eligibility Results",
      eligible: `${eligible.length} program${eligible.length !== 1 ? "s" : ""} matched`,
      ineligibleLabel: "Programs you currently don't qualify for",
      explanation: "What this means for you",
    },
    fil: {
      back: "← Suriin Muli",
      title: "Mga Resulta ng Iyong Eligibility",
      eligible: `${eligible.length} programang naaayon`,
      ineligibleLabel: "Mga programang hindi ka kasalukuyang kwalipikado",
      explanation: "Ano ang ibig sabihin nito para sa iyo",
    },
  };
  const t = copy[language] || copy.en;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-tulong-blue text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate("/")}
            className="text-white/60 hover:text-white text-sm mb-4 transition-colors"
          >
            {t.back}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>
              <p className="text-white/60 text-sm mt-1">
                {eligible.length > 0 ? (
                  <span className="text-emerald-400 font-semibold">{t.eligible}</span>
                ) : (
                  <span className="text-amber-400">
                    {language === "fil" ? "Walang programa ang nakatugma" : "No programs matched"}
                  </span>
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🇵🇭</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* AI Explanation */}
        {results.explanation && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-tulong-blue/10 rounded flex items-center justify-center text-tulong-blue text-xs">✨</span>
              {t.explanation}
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">{results.explanation}</p>
          </div>
        )}

        {/* Conflict Warnings */}
        {results.conflicts && results.conflicts.length > 0 && (
          <ConflictFlag conflicts={results.conflicts} language={language} />
        )}

        {/* Eligible Programs */}
        {eligible.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {language === "fil" ? "Mga Programang Karapat-dapat Ka" : "Programs You Qualify For"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {eligible.map((program) => (
                <ProgramCard key={program.program_id} program={program} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Path */}
        {results.recommended_path && results.recommended_path.length > 0 && (
          <PathToEligibility path={results.recommended_path} language={language} />
        )}

        {/* Document Checklist */}
        {results.documents_needed && results.documents_needed.length > 0 && (
          <DocumentChecklist documents={results.documents_needed} language={language} />
        )}

        {/* Office Locator */}
        <OfficeLocator programs={results.programs} language={language} />

        {/* Ineligible Programs */}
        {ineligible.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {t.ineligibleLabel}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {ineligible.map((program) => (
                <ProgramCard key={program.program_id} program={program} />
              ))}
            </div>
          </section>
        )}

        {/* NGO Fallbacks */}
        <NGOFallback programs={results.programs} language={language} />

        {/* Reasoning Trace */}
        <ReasoningTrace trace={results.reasoning_trace} language={language} />

        {/* Footer CTA */}
        <div className="text-center py-4">
          <button
            onClick={() => navigate("/")}
            className="text-tulong-blue hover:underline text-sm font-medium"
          >
            {language === "fil" ? "Gumawa ng bagong pagsuri →" : "Start a new assessment →"}
          </button>
          <p className="text-xs text-gray-400 mt-2">
            {language === "fil"
              ? "Tulong AI ay para sa impormasyon lamang. Kumonsulta sa iyong lokal na opisina para sa opisyal na pag-aplay."
              : "Tulong AI is for informational purposes only. Consult your local office for official application."}
          </p>
        </div>
      </div>
    </div>
  );
}
