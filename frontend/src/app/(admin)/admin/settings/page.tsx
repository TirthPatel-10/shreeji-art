"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface SiteSetting {
  key: string;
  value: string;
  description?: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => {
        const data = (res.data as SiteSetting[]) ?? [];
        setSettings(data);
        const initial: Record<string, string> = {};
        data.forEach((s) => { initial[s.key] = s.value; });
        setEdits(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("saving");
    setErrorMsg("");
    try {
      const changed = settings.filter((s) => edits[s.key] !== s.value);
      await Promise.all(
        changed.map((s) => adminApi.updateSetting(s.key, edits[s.key] ?? ""))
      );
      setSettings((prev) =>
        prev.map((s) => ({ ...s, value: edits[s.key] ?? s.value }))
      );
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      setErrorMsg("Failed to save settings. Please try again.");
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Website Settings</h1>
        <div className="space-y-4 max-w-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white h-16 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Website Settings</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-4">
        {saveStatus === "error" && (
          <div className="text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          {settings.map((s) => (
            <div key={s.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {s.key
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </label>
              {s.description && (
                <p className="text-xs text-gray-400 mb-1">{s.description}</p>
              )}
              <input
                type="text"
                value={edits[s.key] ?? ""}
                onChange={(e) =>
                  setEdits((prev) => ({ ...prev, [s.key]: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saveStatus === "saving"}
          className="bg-brand-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-gold-dark transition-colors text-sm disabled:opacity-60"
        >
          {saveStatus === "saving"
            ? "Saving…"
            : saveStatus === "saved"
            ? "Saved ✓"
            : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
