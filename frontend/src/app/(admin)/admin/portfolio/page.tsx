"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { PortfolioItem } from "@/types";

type Mode = "list" | "create" | "edit";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  clientName: "",
  isFeatured: false,
  displayOrder: 0,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { reload(); }, []);

  function reload() {
    setLoading(true);
    adminApi.getPortfolioItems()
      .then((res) => setItems((res.data as PortfolioItem[]) ?? []))
      .finally(() => setLoading(false));
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setMode("create");
  }

  function openEdit(p: PortfolioItem) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description ?? "",
      clientName: p.clientName ?? "",
      isFeatured: p.isFeatured,
      displayOrder: (p as unknown as Record<string, number>).displayOrder ?? 0,
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
        const res = await adminApi.createPortfolioItem(form);
        if (!res.success) { setError(res.message || "Failed to create."); return; }
      } else if (editing) {
        const res = await adminApi.updatePortfolioItem(editing.id, form);
        if (!res.success) { setError(res.message || "Failed to update."); return; }
      }
      reload();
      setMode("list");
    } catch { setError("Connection error."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this portfolio item?")) return;
    await adminApi.deletePortfolioItem(id);
    reload();
  }

  if (mode !== "list") {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setMode("list")} className="text-brand-gold text-sm hover:underline mb-4 block">
          ← Back to Portfolio
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === "create" ? "Add Portfolio Item" : "Edit Portfolio Item"}
        </h1>
        {error && (
          <div className="mb-4 text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: mode === "create" ? autoSlug(e.target.value) : p.slug }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input type="text" required value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input type="text" value={form.clientName}
              onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured}
                onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                className="rounded border-gray-300" />
              Featured
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Display Order</label>
              <input type="number" value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
                className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-brand-gold text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors text-sm disabled:opacity-60">
              {saving ? "Saving…" : mode === "create" ? "Add Item" : "Update Item"}
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
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <button onClick={openCreate}
          className="bg-brand-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors">
          + Add Item
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
          <p className="text-4xl mb-3">🖼️</p>
          <p className="font-medium">No portfolio items yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Client</th>
                <th className="px-4 py-3 text-center hidden lg:table-cell">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.clientName || "—"}</td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    {p.isFeatured ? "⭐" : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-brand-gold text-xs hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 text-xs hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
