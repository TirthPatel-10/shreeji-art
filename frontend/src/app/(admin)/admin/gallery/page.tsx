"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Pencil,
  RefreshCcw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { adminApi, apiErrorMessage, caughtApiErrorMessage } from "@/lib/api";
import type { GalleryItem, PortfolioItem } from "@/types";

type GalleryForm = {
  title: string;
  category: string;
  projectId: string;
  altText: string;
  caption: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyForm: GalleryForm = {
  title: "",
  category: "",
  projectId: "",
  altText: "",
  caption: "",
  featured: false,
  published: true,
  sortOrder: 0,
};

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    reload();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort();
  }, [items]);

  const projectMap = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project.title]));
  }, [projects]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const projectTitle = item.projectId ? projectMap.get(item.projectId) : "";
      const searchable = [item.title, item.category, item.caption, item.altText, projectTitle]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      return matchesQuery && matchesCategory;
    });
  }, [items, projectMap, query, categoryFilter]);

  async function reload() {
    setLoading(true);
    setError("");
    try {
      const [galleryRes, portfolioRes] = await Promise.all([
        adminApi.getGalleryItems(),
        adminApi.getPortfolioItems(),
      ]);

      if (!galleryRes.success) {
        setError(apiErrorMessage(galleryRes, "Could not load gallery images."));
        setItems([]);
      } else {
        setItems((((galleryRes.data as GalleryItem[]) ?? [])).sort(sortGallery));
      }

      if (portfolioRes.success) {
        setProjects((portfolioRes.data as PortfolioItem[]) ?? []);
      }
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while loading gallery management."));
    } finally {
      setLoading(false);
    }
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({
      title: item.title ?? "",
      category: item.category ?? "",
      projectId: item.projectId ? String(item.projectId) : "",
      altText: item.altText ?? "",
      caption: item.caption ?? "",
      featured: item.featured ?? item.isFeatured ?? false,
      published: item.published !== false,
      sortOrder: item.sortOrder ?? item.displayOrder ?? 0,
    });
    setError("");
  }

  function closeEdit() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadProgress("");
    setError("");

    try {
      for (let index = 0; index < files.length; index += 1) {
        const body = new FormData();
        const file = files[index];
        body.append("file", file);
        body.append("title", form.title || file.name.replace(/\.[^.]+$/, ""));
        body.append("category", form.category || "General");
        body.append("altText", form.altText || form.title || file.name);
        body.append("caption", form.caption);
        body.append("featured", String(form.featured));
        body.append("published", String(form.published));
        body.append("sortOrder", String(items.length + index));
        if (form.projectId) body.append("projectId", form.projectId);

        setUploadProgress(`Uploading ${index + 1} of ${files.length}`);
        const res = await adminApi.uploadGalleryItem(body);
        if (!res.success) {
          setError(apiErrorMessage(res, `Could not upload ${file.name}.`));
          break;
        }
      }

      closeEdit();
      await reload();
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while uploading gallery images."));
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");

    const body = {
      ...editing,
      title: form.title,
      category: form.category,
      projectId: form.projectId ? Number(form.projectId) : null,
      altText: form.altText,
      caption: form.caption,
      isFeatured: form.featured,
      featured: form.featured,
      published: form.published,
      sortOrder: form.sortOrder,
      displayOrder: form.sortOrder,
    };

    try {
      const res = await adminApi.updateGalleryItem(editing.id, body);
      if (!res.success) {
        setError(apiErrorMessage(res, "Could not update gallery image."));
        return;
      }
      closeEdit();
      await reload();
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while updating gallery image."));
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(item: GalleryItem) {
    const res = await adminApi.setGalleryPublished(item.id, item.published === false);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not update gallery publish state."));
      return;
    }
    reload();
  }

  async function toggleFeatured(item: GalleryItem) {
    const current = item.featured ?? item.isFeatured ?? false;
    const res = await adminApi.setGalleryFeatured(item.id, !current);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not update gallery featured state."));
      return;
    }
    reload();
  }

  async function deleteItem(item: GalleryItem) {
    if (!confirm(`Delete "${item.title || "this gallery image"}"? This cannot be undone.`)) {
      return;
    }
    const res = await adminApi.deleteGalleryItem(item.id);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not delete gallery image."));
      return;
    }
    reload();
  }

  async function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= filteredItems.length) return;

    const reorderedFiltered = [...filteredItems];
    [reorderedFiltered[index], reorderedFiltered[nextIndex]] = [
      reorderedFiltered[nextIndex],
      reorderedFiltered[index],
    ];

    const reorderedIds = new Map(
      reorderedFiltered.map((item, sortOrder) => [item.id, sortOrder])
    );
    const payload = items
      .map((item) => ({
        galleryItemId: item.id,
        sortOrder: reorderedIds.get(item.id) ?? item.sortOrder ?? item.displayOrder ?? 0,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    setItems((previous) =>
      previous
        .map((item) => ({
          ...item,
          sortOrder: reorderedIds.get(item.id) ?? item.sortOrder ?? item.displayOrder ?? 0,
        }))
        .sort(sortGallery)
    );

    const res = await adminApi.reorderGalleryItems(payload);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not reorder gallery images."));
      return;
    }
    reload();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white bg-white p-5 shadow-sa-lg sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
              Admin gallery
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-brand-navy">
              Manage Gallery
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Upload public gallery images, connect them to portfolio projects, and
              control publishing through the existing backend API.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-navy-deep">
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span aria-live="polite">
              {uploading ? uploadProgress || "Uploading..." : "Upload Images"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(event) => handleUpload(event.target.files)}
              className="sr-only"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_auto]">
          <label className="relative">
            <span className="sr-only">Search gallery</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, category, caption, project..."
              className={`${inputClass} pl-11`}
            />
          </label>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className={inputClass}
            aria-label="Filter gallery category"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-[2rem] bg-white" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-10 text-center">
              <ImagePlus className="mx-auto h-10 w-10 text-brand-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-brand-navy">
                No gallery images found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Upload images or clear filters to see current gallery items.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item, index) => {
                const featured = item.featured ?? item.isFeatured ?? false;
                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sa-lg"
                  >
                    <div className="relative aspect-[4/3] bg-brand-navy">
                      <Image
                        src={item.imageUrl}
                        alt={item.altText || item.title || "Gallery image"}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <Badge tone={item.published === false ? "muted" : "success"}>
                          {item.published === false ? "Hidden" : "Published"}
                        </Badge>
                        {featured ? <Badge tone="gold">Featured</Badge> : null}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-xl font-semibold text-brand-navy">
                        {item.title || "Untitled gallery image"}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                        {item.category || "General"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {item.projectId
                          ? `Linked to ${projectMap.get(item.projectId) || "selected project"}`
                          : item.caption || "No project connected yet."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-navy-deep"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => togglePublished(item)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                        >
                          {item.published === false ? "Publish" : "Hide"}
                        </button>
                        <button
                          onClick={() => toggleFeatured(item)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                        >
                          <Star className="h-3.5 w-3.5" />
                          {featured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move gallery image up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveItem(index, 1)}
                          disabled={index === filteredItems.length - 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move gallery image down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="rounded-[2rem] border border-white bg-white p-5 shadow-sa-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                {editing ? "Edit image" : "Upload defaults"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-brand-navy">
                {editing ? "Image details" : "Metadata"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {editing
                  ? "Update title, category, project connection and visibility."
                  : "Set optional defaults before uploading a batch."}
              </p>
            </div>
            {editing ? (
              <button
                type="button"
                onClick={closeEdit}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                aria-label="Close editor"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Field label="Title">
              <input
                value={form.title}
                onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Category">
              <input
                value={form.category}
                onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                placeholder="Retail, Corporate, Industrial..."
                className={inputClass}
              />
            </Field>
            <Field label="Connected project">
              <select
                value={form.projectId}
                onChange={(event) => setForm((previous) => ({ ...previous, projectId: event.target.value }))}
                className={inputClass}
              >
                <option value="">No project connection</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Alt text">
              <input
                value={form.altText}
                onChange={(event) => setForm((previous) => ({ ...previous, altText: event.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Caption">
              <textarea
                rows={3}
                value={form.caption}
                onChange={(event) => setForm((previous) => ({ ...previous, caption: event.target.value }))}
                className={inputClass}
              />
            </Field>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => setForm((previous) => ({ ...previous, published: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                />
                Published
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm((previous) => ({ ...previous, featured: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                />
                Featured
              </label>
            </div>
            {editing ? (
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-brand-navy shadow-[0_18px_36px_rgba(217,165,20,0.24)] transition hover:-translate-y-0.5 hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {saving ? "Saving..." : "Save image details"}
              </button>
            ) : (
              <p className="rounded-2xl bg-[#f8f6ef] p-4 text-sm leading-6 text-gray-500">
                Choose Upload Images after setting defaults. Each file is sent as
                multipart form data to the backend.
              </p>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "gold" | "success" | "muted";
}) {
  const toneClass = {
    gold: "border-brand-gold/30 bg-brand-gold/10 text-brand-gold-dark",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    muted: "border-gray-200 bg-gray-50 text-gray-500",
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${toneClass}`}>
      {children}
    </span>
  );
}

function sortGallery(a: GalleryItem, b: GalleryItem) {
  return (a.sortOrder ?? a.displayOrder ?? 0) - (b.sortOrder ?? b.displayOrder ?? 0);
}
