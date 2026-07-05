"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { BlogPost, BlogStatus } from "@/types";

type Mode = "list" | "create" | "edit";

const STATUS_OPTIONS: BlogStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-orange-100 text-orange-700",
};

const emptyForm = { title: "", slug: "", excerpt: "", content: "", status: "DRAFT" as BlogStatus };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { reload(); }, []);

  function reload() {
    setLoading(true);
    adminApi.getBlogPosts()
      .then((res) => setPosts((res.data as BlogPost[]) ?? []))
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

  function openEdit(p: BlogPost) {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", content: p.content ?? "", status: p.status });
    setError("");
    setMode("edit");
  }

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        const res = await adminApi.createBlogPost(form);
        if (!res.success) { setError(res.message || "Failed to create."); return; }
      } else if (editing) {
        const res = await adminApi.updateBlogPost(editing.id, form);
        if (!res.success) { setError(res.message || "Failed to update."); return; }
      }
      reload();
      setMode("list");
    } catch { setError("Connection error."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    await adminApi.deleteBlogPost(id);
    reload();
  }

  if (mode !== "list") {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setMode("list")} className="text-brand-gold text-sm hover:underline mb-4 block">
          ← Back to Blog
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === "create" ? "New Post" : "Edit Post"}
        </h1>
        {error && (
          <div className="mb-4 text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value, slug: mode === "create" ? autoSlug(e.target.value) : prev.slug }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input type="text" required value={form.slug} onChange={set("slug")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={set("excerpt")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea required rows={8} value={form.content} onChange={set("content")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={set("status")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-brand-gold text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors text-sm disabled:opacity-60">
              {saving ? "Saving…" : mode === "create" ? "Publish Post" : "Update Post"}
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
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <button onClick={openCreate}
          className="bg-brand-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors">
          + New Post
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white h-14 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">✍️</p>
          <p className="font-medium">No blog posts yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden md:table-cell">{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
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
