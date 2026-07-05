"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Service } from "@/types";

type Mode = "list" | "create" | "edit";

const emptyForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  iconName: "",
  displayOrder: 0,
  isActive: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    setLoading(true);
    adminApi
      .getServices()
      .then((res) => setServices((res.data as Service[]) ?? []))
      .finally(() => setLoading(false));
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setMode("create");
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription ?? "",
      description: s.description ?? "",
      iconName: (s as unknown as Record<string, unknown>).iconName as string ?? "",
      displayOrder: s.displayOrder,
      isActive: true,
    });
    setError("");
    setMode("edit");
  }

  function set(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>
      setForm((prev) => ({
        ...prev,
        [field]:
          field === "displayOrder" ? Number(e.target.value) : e.target.value,
      }));
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        const res = await adminApi.createService(form);
        if (!res.success) { setError(res.message || "Failed to create."); return; }
      } else if (editing) {
        const res = await adminApi.updateService(editing.id, form);
        if (!res.success) { setError(res.message || "Failed to update."); return; }
      }
      reload();
      setMode("list");
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this service?")) return;
    await adminApi.deleteService(id);
    reload();
  }

  if (mode !== "list") {
    return (
      <div className="max-w-2xl">
        <button
          onClick={() => setMode("list")}
          className="text-brand-gold text-sm hover:underline mb-4 block"
        >
          ← Back to Services
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === "create" ? "Add Service" : "Edit Service"}
        </h1>
        {error && (
          <div className="mb-4 text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: mode === "create" ? autoSlug(e.target.value) : prev.slug,
                }));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={set("slug")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={set("shortDescription")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={set("description")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
              <input
                type="text"
                value={form.iconName}
                onChange={set("iconName")}
                placeholder="e.g. monitor"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={set("displayOrder")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-gold text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : mode === "create" ? "Create Service" : "Update Service"}
            </button>
            <button
              type="button"
              onClick={() => setMode("list")}
              className="border border-gray-200 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
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
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button
          onClick={openCreate}
          className="bg-brand-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors"
        >
          + Add Service
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white h-14 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-center hidden lg:table-cell">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden md:table-cell">
                    {s.slug}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400 hidden lg:table-cell">
                    {s.displayOrder}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(s)}
                      className="text-brand-gold text-xs hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Delete
                    </button>
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
