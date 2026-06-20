export default function BilingualToggle({ language, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      <button
        onClick={() => onChange("en")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === "en"
            ? "bg-white text-tulong-blue shadow-sm"
            : "text-white/70 hover:text-white"
        }`}
      >
        English
      </button>
      <button
        onClick={() => onChange("fil")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === "fil"
            ? "bg-white text-tulong-blue shadow-sm"
            : "text-white/70 hover:text-white"
        }`}
      >
        Filipino
      </button>
    </div>
  );
}
