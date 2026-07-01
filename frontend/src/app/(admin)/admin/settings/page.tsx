import type { Metadata } from "next";

export const metadata: Metadata = { title: "Website Settings — Admin" };

const settingGroups = [
  {
    group: "Company Info",
    fields: ["Company Name", "Phone", "Email", "Address"],
  },
  {
    group: "Social Media",
    fields: ["Facebook URL", "Instagram URL", "WhatsApp Number"],
  },
  {
    group: "SEO",
    fields: ["Meta Title", "Meta Description"],
  },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Website Settings</h1>
      <div className="space-y-6 max-w-2xl">
        {settingGroups.map((g) => (
          <div key={g.group} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">{g.group}</h2>
            <div className="space-y-3">
              {g.fields.map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{f}</label>
                  <input
                    type="text"
                    placeholder={`Enter ${f.toLowerCase()}`}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="bg-brand-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-gold-dark transition-colors text-sm">
          Save Settings
        </button>
      </div>
    </div>
  );
}
