"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Testimonial } from "@/types";

type Mode = "list" | "create" | "edit";

const emptyForm = { customerName: "", company: "", content: "", rating: 5, isApproved: false };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { reload(); }, []);

  function reload() {
    setLoading(true);
    adminApi.getTestimonials()
      .then((res) => setItems((res.data as Testimonial[]) ?? []))
      .finally(() => setLoading(false));
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setMode("create");
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      customerName: t.customerName,
      company: t.company ?? "",
      content: t.content,
      rating: t.rating,
      isApproved: (t as unknown as Record<string, boolean>).isApproved ?? false,
    });
    setError("");
    setMode("edit");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        const res = await adminApi.createTestimonial(form);
        if (!res.success) { setError(res.message || "Failed to create."); return; }
      } else if (editing) {
        const res = await adminApi.updateTestimonial(editing.id, form);
        if (!res.success) { setError(res.message || "Failed to update."); return; }
      }
      reload();
      setMode("list");
    } catch { setError("Connection error."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await adminApi.deleteTestimonial(id);
    reload();
  }

  async function toggleApprove(t: Testimonial) {
    const isApproved = !(t as unknown as Record<string, boolean>).isApproved;
    await adminApi.updateTestimonial(t.id, { ...t, isApproved });
    reload();
  }

  if (mode !== "list") {
    return (
      <div className="max-w-lg">
        <button onClick={() => setMode("list")} className="text-brand-gold text-sm hover:underline mb-4 block">
          ← Back to Testimonials
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === "create" ? "Add Testimonial" : "Edit Testimonial"}
        </h1>
        {error && (
          <div className="mb-4 text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
            <input type="text" required value={form.customerName}
              onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
            <textarea required rows={4} value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1–5)</label>
            <input type="number" min={1} max={5} value={form.rating}
              onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.isApproved}
              onChange={(e) => setForm((p) => ({ ...p, isApproved: e.target.checked }))}
              className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold" />
            Approved (show on website)
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-brand-gold text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors text-sm disabled:opacity-60">
              {saving ? "Saving…" : mode === "create" ? "Add Testimonial" : "Update"}
            </button>
            <button type="button" onClick={() => setMode("list")}
              className="border border-gray-200 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={openCreate}
          className="bg-brand-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors">
          + Add Testimonial
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white h-14 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">⭐</p>
          <p className="font-medium">No testimonials yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => {
            const isApproved = (t as unknown as Record<string, boolean>).isApproved;
            return (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{t.customerName}</p>
                  {t.company && <p className="text-xs text-gray-400">{t.company}</p>}
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{t.content}</p>
                  <p className="text-xs text-brand-gold mt-1">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isApproved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {isApproved ? "Approved" : "Pending"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleApprove(t)} className="text-xs text-blue-500 hover:underline">
                      {isApproved ? "Unapprove" : "Approve"}
                    </button>
                    <button onClick={() => openEdit(t)} className="text-brand-gold text-xs hover:underline">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-400 text-xs hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
