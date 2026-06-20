import { useState } from "react";

const labels = {
  en: {
    title: "Tell us about yourself",
    subtitle: "Share your situation in your own words, or fill out the form below.",
    freeTextPlaceholder:
      "Example: I'm 35 years old, living in Quezon City with my spouse and 2 children. I lost my job 3 months ago and we earn about ₱6,000 a month from small selling...",
    orDivider: "or fill out the form",
    age: "Age",
    income: "Monthly Household Income (₱)",
    household: "Household Size (# of people)",
    employment: "Employment Status",
    employmentOptions: {
      unemployed: "Unemployed",
      employed: "Formally Employed",
      self_employed: "Self-Employed / Negosyante",
      informal: "Informal Worker (vendor, tricycle, etc.)",
    },
    isPwd: "I am a Person with Disability (PWD)",
    isSenior: "I am a Senior Citizen (60+)",
    hasPhilhealth: "I already have PhilHealth",
    hasSss: "I already have SSS",
    isSoloParent: "I am a solo parent (sole caregiver)",
    hasChildren: "I have children under 18",
    hasCollegeStudent: "Someone in my household is in college",
    inCrisis: "I am facing a crisis (medical emergency, death, disaster)",
    submit: "Check My Eligibility",
    submitting: "Checking...",
  },
  fil: {
    title: "Sabihin mo sa amin ang tungkol sa iyo",
    subtitle: "Ibahagi ang iyong sitwasyon sa iyong sariling mga salita, o punan ang form sa ibaba.",
    freeTextPlaceholder:
      "Halimbawa: Ako ay 35 taong gulang, nakatira sa Quezon City kasama ang aking asawa at 2 anak. Nawalan ako ng trabaho 3 buwan na ang nakalipas at kumikita kami ng mga ₱6,000 bawat buwan mula sa maliit na pagbebenta...",
    orDivider: "o punan ang form",
    age: "Edad",
    income: "Buwanang Kita ng Sambahayan (₱)",
    household: "Laki ng Sambahayan (bilang ng tao)",
    employment: "Katayuan sa Trabaho",
    employmentOptions: {
      unemployed: "Walang trabaho",
      employed: "May regular na trabaho",
      self_employed: "Negosyante / Self-Employed",
      informal: "Manggagawang Impormal (vendor, traysikel, atbp.)",
    },
    isPwd: "Ako ay Taong may Kapansanan (PWD)",
    isSenior: "Ako ay Matatandang Mamamayan (60+)",
    hasPhilhealth: "Mayroon na akong PhilHealth",
    hasSss: "Mayroon na akong SSS",
    isSoloParent: "Ako ay solo parent (nag-iisang nag-aalaga)",
    hasChildren: "Mayroon akong anak na wala pang 18",
    hasCollegeStudent: "May kasamang nag-aaral sa kolehiyo sa aming sambahayan",
    inCrisis: "May krisis ako (medikal na emergency, pagkamatay, kalamidad)",
    submit: "Suriin ang Aking Eligibility",
    submitting: "Sinusuri...",
  },
};

export default function IntakeForm({ language, onSubmit, loading }) {
  const t = labels[language];
  const [mode, setMode] = useState("freetext"); // freetext | structured
  const [freeText, setFreeText] = useState("");
  const [form, setForm] = useState({
    age: "",
    monthly_income: "",
    household_size: "",
    employment_status: "unemployed",
    is_pwd: false,
    is_senior: false,
    has_philhealth: false,
    has_sss: false,
    is_solo_parent: false,
    has_children_under_18: false,
    has_college_student: false,
    in_crisis: false,
    location_type: "urban",
  });

  const handleFreeTextSubmit = (e) => {
    e.preventDefault();
    if (freeText.trim().length < 20) return;
    onSubmit({ type: "freetext", text: freeText });
  };

  const handleStructuredSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: "structured",
      data: {
        ...form,
        age: parseInt(form.age) || 30,
        monthly_income: parseFloat(form.monthly_income) || 5000,
        household_size: parseInt(form.household_size) || 4,
        language,
      },
    });
  };

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 border-b border-gray-100 pb-4">
        <button
          onClick={() => setMode("freetext")}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            mode === "freetext"
              ? "bg-tulong-blue text-white font-medium"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {language === "en" ? "Free Text" : "Libreng Teksto"}
        </button>
        <button
          onClick={() => setMode("structured")}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            mode === "structured"
              ? "bg-tulong-blue text-white font-medium"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {language === "en" ? "Fill Form" : "Punan ang Form"}
        </button>
      </div>

      {mode === "freetext" ? (
        <form onSubmit={handleFreeTextSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.title}
            </label>
            <p className="text-xs text-gray-500 mb-3">{t.subtitle}</p>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder={t.freeTextPlaceholder}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tulong-blue/30 focus:border-tulong-blue resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {freeText.length}/500 — {language === "en" ? "minimum 20 characters" : "minimum 20 karakter"}
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || freeText.trim().length < 20}
            className="w-full py-3 px-6 bg-tulong-blue text-white rounded-xl font-semibold text-sm hover:bg-tulong-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      ) : (
        <form onSubmit={handleStructuredSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t.age}</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="35"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tulong-blue/30 focus:border-tulong-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t.household}</label>
              <input
                type="number"
                value={form.household_size}
                onChange={(e) => update("household_size", e.target.value)}
                placeholder="4"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tulong-blue/30 focus:border-tulong-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t.income}</label>
            <input
              type="number"
              value={form.monthly_income}
              onChange={(e) => update("monthly_income", e.target.value)}
              placeholder="5000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tulong-blue/30 focus:border-tulong-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t.employment}</label>
            <select
              value={form.employment_status}
              onChange={(e) => update("employment_status", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tulong-blue/30 focus:border-tulong-blue bg-white"
            >
              {Object.entries(t.employmentOptions).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-1">
            {[
              ["is_pwd", t.isPwd],
              ["is_senior", t.isSenior],
              ["has_philhealth", t.hasPhilhealth],
              ["has_sss", t.hasSss],
              ["is_solo_parent", t.isSoloParent],
              ["has_children_under_18", t.hasChildren],
              ["has_college_student", t.hasCollegeStudent],
              ["in_crisis", t.inCrisis],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-tulong-blue focus:ring-tulong-blue/30"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-tulong-blue text-white rounded-xl font-semibold text-sm hover:bg-tulong-blue/90 disabled:opacity-50 transition-all"
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      )}
    </div>
  );
}
