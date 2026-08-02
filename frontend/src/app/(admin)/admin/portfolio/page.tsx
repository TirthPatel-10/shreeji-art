"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { adminApi, apiErrorMessage, caughtApiErrorMessage } from "@/lib/api";
import type { GalleryItem, PortfolioImage, PortfolioItem } from "@/types";

type Mode = "list" | "create" | "edit";

type PortfolioForm = {
  title: string;
  slug: string;
  clientName: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  description: string;
  location: string;
  completionYear: string;
  isFeatured: boolean;
  published: boolean;
  displayOrder: number;
};

const emptyForm: PortfolioForm = {
  title: "",
  slug: "",
  clientName: "",
  category: "",
  shortDescription: "",
  fullDescription: "",
  description: "",
  location: "",
  completionYear: "",
  isFeatured: false,
  published: true,
  displayOrder: 0,
};

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15";

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<PortfolioForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copyingToGallery, setCopyingToGallery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [copyNotice, setCopyNotice] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    if (!dirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const searchable = [
        item.title,
        item.slug,
        item.clientName,
        item.category,
        item.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && item.published !== false) ||
        (statusFilter === "draft" && item.published === false) ||
        (statusFilter === "featured" && item.isFeatured);

      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  const galleryImageUrlsForEditing = useMemo(() => {
    if (!editing) return new Set<string>();

    return new Set(
      galleryItems
        .filter((item) => item.projectId === editing.id)
        .map((item) => item.imageUrl)
    );
  }, [editing, galleryItems]);

  async function reload() {
    setLoading(true);
    setError("");
    try {
      const [portfolioRes, galleryRes] = await Promise.all([
        adminApi.getPortfolioItems(),
        adminApi.getGalleryItems(),
      ]);
      if (!portfolioRes.success || !galleryRes.success) {
        setError(
          apiErrorMessage(
            !portfolioRes.success ? portfolioRes : galleryRes,
            "Could not load portfolio projects."
          )
        );
        setItems([]);
        return;
      }
      setItems((portfolioRes.data as PortfolioItem[]) ?? []);
      setGalleryItems((galleryRes.data as GalleryItem[]) ?? []);
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while loading portfolio projects."));
    } finally {
      setLoading(false);
    }
  }

  async function loadImages(projectId: number) {
    setImageLoading(true);
    try {
      const res = await adminApi.getPortfolioImages(projectId);
      if (res.success) {
        setImages(((res.data as PortfolioImage[]) ?? []).sort(sortImages));
      } else {
        setError(apiErrorMessage(res, "Could not load project images."));
      }
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while loading project images."));
    } finally {
      setImageLoading(false);
    }
  }

  function updateField<K extends keyof PortfolioForm>(key: K, value: PortfolioForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setDirty(true);
  }

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function openCreate() {
    setEditing(null);
    setImages([]);
    setSelectedImageIds([]);
    setCopyNotice("");
    setForm(emptyForm);
    setError("");
    setDirty(false);
    setMode("create");
  }

  function openEdit(project: PortfolioItem) {
    setEditing(project);
    setSelectedImageIds([]);
    setCopyNotice("");
    setForm({
      title: project.title ?? "",
      slug: project.slug ?? "",
      clientName: project.clientName ?? "",
      category: project.category ?? "",
      shortDescription: project.shortDescription ?? "",
      fullDescription: project.fullDescription ?? "",
      description: project.description ?? "",
      location: project.location ?? "",
      completionYear: project.completionYear ? String(project.completionYear) : "",
      isFeatured: Boolean(project.isFeatured),
      published: project.published !== false,
      displayOrder: project.displayOrder ?? 0,
    });
    setError("");
    setDirty(false);
    setMode("edit");
    loadImages(project.id);
  }

  function backToList() {
    if (dirty && !confirm("Discard unsaved portfolio changes?")) return;
    setMode("list");
    setEditing(null);
    setImages([]);
    setSelectedImageIds([]);
    setCopyNotice("");
    setDirty(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      description: form.description || form.shortDescription,
      completionYear: form.completionYear ? Number(form.completionYear) : null,
    };

    try {
      const res =
        mode === "create"
          ? await adminApi.createPortfolioItem(payload)
          : editing
            ? await adminApi.updatePortfolioItem(editing.id, payload)
            : null;

      if (!res?.success) {
        setError(apiErrorMessage(res, "Could not save portfolio project."));
        return;
      }

      setDirty(false);
      await reload();

      const saved = res.data as PortfolioItem | null;
      if (mode === "create" && saved?.id) {
        openEdit(saved);
      } else {
        setMode("list");
      }
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while saving the portfolio project."));
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(project: PortfolioItem) {
    const res = await adminApi.setPortfolioPublished(project.id, project.published === false);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not update portfolio publish state."));
      return;
    }
    reload();
  }

  async function toggleFeatured(project: PortfolioItem) {
    const res = await adminApi.setPortfolioFeatured(project.id, !project.isFeatured);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not update portfolio featured state."));
      return;
    }
    reload();
  }

  async function handleDelete(project: PortfolioItem) {
    if (
      !confirm(
        `Delete "${project.title}" and its managed project images? This cannot be undone.`
      )
    ) {
      return;
    }

    const res = await adminApi.deletePortfolioItem(project.id);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not delete portfolio project."));
      return;
    }
    reload();
  }

  async function uploadFiles(files: FileList | null, coverImage = false) {
    if (!editing || !files?.length) return;
    setUploading(true);
    setUploadProgress("");
    setError("");

    try {
      for (let index = 0; index < files.length; index += 1) {
        const body = new FormData();
        body.append("file", files[index]);
        body.append("coverImage", String(coverImage || images.length === 0));
        body.append("published", "true");
        body.append("sortOrder", String(images.length + index));
        setUploadProgress(`Uploading ${index + 1} of ${files.length}`);

        const res = await adminApi.uploadPortfolioImage(editing.id, body);
        if (!res.success) {
          setError(apiErrorMessage(res, `Could not upload ${files[index].name}.`));
          break;
        }
      }

      await loadImages(editing.id);
      await reload();
      setSelectedImageIds([]);
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while uploading project images."));
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  }

  async function updateImage(image: PortfolioImage, changes: Partial<PortfolioImage>) {
    if (!editing) return;
    const body = {
      altText: changes.altText ?? image.altText ?? "",
      caption: changes.caption ?? image.caption ?? "",
      sortOrder: changes.sortOrder ?? image.sortOrder,
      published: changes.published ?? image.published,
    };
    const res = await adminApi.updatePortfolioImage(editing.id, image.id, body);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not update project image."));
      return;
    }
    loadImages(editing.id);
  }

  async function deleteImage(image: PortfolioImage) {
    if (!editing || !confirm("Delete this project image?")) return;
    const res = await adminApi.deletePortfolioImage(editing.id, image.id);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not delete project image."));
      return;
    }
    await loadImages(editing.id);
    await reload();
    setSelectedImageIds((prev) => prev.filter((id) => id !== image.id));
  }

  async function setCover(image: PortfolioImage) {
    if (!editing) return;
    const res = await adminApi.setPortfolioCoverImage(editing.id, image.id);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not set cover image."));
      return;
    }
    await loadImages(editing.id);
    await reload();
  }

  async function moveImage(index: number, direction: -1 | 1) {
    if (!editing) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const reordered = [...images];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    const payload = reordered.map((image, sortOrder) => ({
      imageId: image.id,
      sortOrder,
    }));

    setImages(reordered.map((image, sortOrder) => ({ ...image, sortOrder })));
    const res = await adminApi.reorderPortfolioImages(editing.id, payload);
    if (!res.success) {
      setError(apiErrorMessage(res, "Could not reorder project images."));
      return;
    }
    loadImages(editing.id);
  }

  function toggleImageSelection(image: PortfolioImage) {
    if (galleryImageUrlsForEditing.has(image.imageUrl)) return;
    setCopyNotice("");
    setSelectedImageIds((previous) =>
      previous.includes(image.id)
        ? previous.filter((id) => id !== image.id)
        : [...previous, image.id]
    );
  }

  function selectGalleryCandidates() {
    const availableIds = images
      .filter((image) => !galleryImageUrlsForEditing.has(image.imageUrl))
      .map((image) => image.id);
    setCopyNotice("");
    setSelectedImageIds(availableIds);
  }

  async function addSelectedImagesToGallery() {
    if (!editing || selectedImageIds.length === 0) return;
    if (
      !confirm(
        "Add the selected project images to Gallery as unpublished gallery items?"
      )
    ) {
      return;
    }

    setCopyingToGallery(true);
    setError("");
    setCopyNotice("");
    try {
      const res = await adminApi.addPortfolioImagesToGallery(editing.id, {
        imageIds: selectedImageIds,
        title: editing.title,
        category: form.category || editing.category || undefined,
        published: false,
        featured: false,
      });

      if (!res.success) {
        setError(apiErrorMessage(res, "Could not add selected images to Gallery."));
        return;
      }

      const data = res.data as
        | {
            created?: GalleryItem[];
            skippedDuplicateImageIds?: number[];
          }
        | null;
      const createdCount = data?.created?.length ?? 0;
      const skippedCount = data?.skippedDuplicateImageIds?.length ?? 0;
      setCopyNotice(
        createdCount > 0
          ? `${createdCount} image${createdCount === 1 ? "" : "s"} added to Gallery as unpublished item${createdCount === 1 ? "" : "s"}.${
              skippedCount ? ` ${skippedCount} duplicate${skippedCount === 1 ? "" : "s"} skipped.` : ""
            }`
          : "Those images are already in Gallery. No duplicates were created."
      );
      setSelectedImageIds([]);
      const galleryRes = await adminApi.getGalleryItems();
      if (galleryRes.success) {
        setGalleryItems((galleryRes.data as GalleryItem[]) ?? []);
      }
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while adding images to Gallery."));
    } finally {
      setCopyingToGallery(false);
    }
  }

  if (mode !== "list") {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={backToList}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-dark"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Back to project list
        </button>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white bg-white p-5 shadow-sa-lg sm:p-7"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                {mode === "create" ? "New portfolio project" : "Edit portfolio project"}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-brand-navy">
                Project details
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Manage the public portfolio project metadata without changing the public
                route contract.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Project title" required>
                <input
                  required
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((previous) => ({
                      ...previous,
                      title,
                      slug: mode === "create" ? autoSlug(title) : previous.slug,
                    }));
                    setDirty(true);
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Slug" required>
                <input
                  required
                  value={form.slug}
                  onChange={(event) => updateField("slug", autoSlug(event.target.value))}
                  className={`${inputClass} font-mono`}
                />
              </Field>
              <Field label="Client name">
                <input
                  value={form.clientName}
                  onChange={(event) => updateField("clientName", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  placeholder="Retail, Corporate, Industrial..."
                  className={inputClass}
                />
              </Field>
              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="Ahmedabad"
                  className={inputClass}
                />
              </Field>
              <Field label="Completion year">
                <input
                  type="number"
                  min="1990"
                  max="2100"
                  value={form.completionYear}
                  onChange={(event) => updateField("completionYear", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Short description" className="md:col-span-2">
                <textarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={(event) => updateField("shortDescription", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Full description" className="md:col-span-2">
                <textarea
                  rows={6}
                  value={form.fullDescription}
                  onChange={(event) => updateField("fullDescription", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => updateField("published", event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                />
                Published
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => updateField("isFeatured", event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                Display order
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(event) => updateField("displayOrder", Number(event.target.value))}
                  className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15"
                />
              </label>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-brand-navy shadow-[0_18px_36px_rgba(217,165,20,0.24)] transition hover:-translate-y-0.5 hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {saving ? "Saving..." : "Save project"}
              </button>
              <button
                type="button"
                onClick={backToList}
                className="rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              {editing?.slug ? (
                <Link
                  href={`/portfolio/${editing.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Preview
                </Link>
              ) : null}
            </div>
          </form>

          <ProjectImagesPanel
            editing={editing}
            images={images}
            imageLoading={imageLoading}
            uploading={uploading}
            copyingToGallery={copyingToGallery}
            uploadProgress={uploadProgress}
            selectedImageIds={selectedImageIds}
            galleryImageUrls={galleryImageUrlsForEditing}
            copyNotice={copyNotice}
            onUpload={uploadFiles}
            onUpdate={updateImage}
            onDelete={deleteImage}
            onCover={setCover}
            onMove={moveImage}
            onToggleSelection={toggleImageSelection}
            onSelectAll={selectGalleryCandidates}
            onAddSelectedToGallery={addSelectedImagesToGallery}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white bg-white p-5 shadow-sa-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Admin portfolio
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-brand-navy">
            Manage Projects
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create portfolio projects, control publication, and manage project images.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-navy-deep"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Project
        </button>
      </div>

      <div className="grid gap-3 rounded-[1.5rem] border border-white bg-white/80 p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
        <label className="relative">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, client, category, location..."
            className={`${inputClass} pl-11`}
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
          aria-label="Filter projects"
        >
          <option value="all">All projects</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured</option>
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

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-[2rem] bg-white" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-10 text-center">
          <ImagePlus className="mx-auto h-10 w-10 text-brand-gold" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl font-semibold text-brand-navy">
            No portfolio projects found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Add a project or clear filters to see existing work.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredItems.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sa-lg"
            >
              <div className="grid gap-0 sm:grid-cols-[190px_1fr]">
                <ProjectThumb project={project} />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={project.published === false ? "muted" : "success"}>
                      {project.published === false ? "Draft" : "Published"}
                    </Badge>
                    {project.isFeatured ? <Badge tone="gold">Featured</Badge> : null}
                    {project.category ? <Badge tone="muted">{project.category}</Badge> : null}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-brand-navy">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {project.clientName || "No client"} {project.location ? `- ${project.location}` : ""}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {project.shortDescription || project.description || "No description added yet."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => openEdit(project)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-navy-deep"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublished(project)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                    >
                      {project.published === false ? "Publish" : "Unpublish"}
                    </button>
                    <button
                      onClick={() => toggleFeatured(project)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                    >
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      {project.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function ProjectImagesPanel({
  editing,
  images,
  imageLoading,
  uploading,
  copyingToGallery,
  uploadProgress,
  selectedImageIds,
  galleryImageUrls,
  copyNotice,
  onUpload,
  onUpdate,
  onDelete,
  onCover,
  onMove,
  onToggleSelection,
  onSelectAll,
  onAddSelectedToGallery,
}: {
  editing: PortfolioItem | null;
  images: PortfolioImage[];
  imageLoading: boolean;
  uploading: boolean;
  copyingToGallery: boolean;
  uploadProgress: string;
  selectedImageIds: number[];
  galleryImageUrls: Set<string>;
  copyNotice: string;
  onUpload: (files: FileList | null, coverImage?: boolean) => void;
  onUpdate: (image: PortfolioImage, changes: Partial<PortfolioImage>) => void;
  onDelete: (image: PortfolioImage) => void;
  onCover: (image: PortfolioImage) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onToggleSelection: (image: PortfolioImage) => void;
  onSelectAll: () => void;
  onAddSelectedToGallery: () => void;
}) {
  if (!editing) {
    return (
      <aside className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-6 text-center shadow-sm">
        <Upload className="mx-auto h-9 w-9 text-brand-gold" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-brand-navy">
          Save first
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Create the portfolio project before uploading project images.
        </p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <div className="rounded-[2rem] border border-white bg-brand-navy p-5 text-white shadow-sa-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
          Project images
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold">
          Upload, cover, order
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/62">
          Images upload through the Spring Boot admin API and remain protected by the
          existing admin token.
        </p>
        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/[0.06] px-4 py-8 text-center transition hover:border-brand-gold/70 hover:bg-brand-gold/10">
          <Upload className="h-8 w-8 text-brand-gold" aria-hidden="true" />
          <span className="mt-3 text-sm font-bold" aria-live="polite">
            {uploading ? uploadProgress || "Uploading..." : "Choose images"}
          </span>
          <span className="mt-1 text-xs text-white/45">PNG, JPG or WebP</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(event) => onUpload(event.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      <div className="rounded-[2rem] border border-white bg-white p-5 shadow-sa-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Gallery reuse
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-brand-navy">
              Add project images to Gallery
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Selected images reuse the existing Portfolio image URL and are added as
              unpublished Gallery items. Existing Gallery matches are skipped.
            </p>
          </div>
          <Badge tone="muted">
            {selectedImageIds.length} selected
          </Badge>
        </div>

        {copyNotice ? (
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
            {copyNotice}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            disabled={imageLoading || images.every((image) => galleryImageUrls.has(image.imageUrl))}
            className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Select available
          </button>
          <button
            type="button"
            onClick={onAddSelectedToGallery}
            disabled={copyingToGallery || selectedImageIds.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-4 py-2 text-xs font-bold text-brand-navy transition hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copyingToGallery ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copyingToGallery ? "Adding..." : "Add Selected Images to Gallery"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {imageLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-white" />
          ))
        ) : images.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No images uploaded yet.
          </div>
        ) : (
          images.map((image, index) => {
            const inGallery = galleryImageUrls.has(image.imageUrl);
            const selected = selectedImageIds.includes(image.id);

            return (
            <div key={image.id} className="rounded-3xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="flex gap-3">
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={image.imageUrl}
                    alt={image.altText || image.caption || "Portfolio project image"}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-600">
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={inGallery}
                        onChange={() => onToggleSelection(image)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold disabled:cursor-not-allowed"
                      />
                      Select
                    </label>
                    {image.coverImage ? <Badge tone="gold">Cover</Badge> : null}
                    <Badge tone={image.published ? "success" : "muted"}>
                      {image.published ? "Visible" : "Hidden"}
                    </Badge>
                    {inGallery ? (
                      <Badge tone="success">
                        <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                        In Gallery
                      </Badge>
                    ) : null}
                  </div>
                  <input
                    defaultValue={image.altText ?? ""}
                    placeholder="Alt text"
                    onBlur={(event) => onUpdate(image, { altText: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-brand-gold"
                  />
                  <input
                    defaultValue={image.caption ?? ""}
                    placeholder="Caption"
                    onBlur={(event) => onUpdate(image, { caption: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => onCover(image)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  Set cover
                </button>
                <button
                  onClick={() => onUpdate(image, { published: !image.published })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  {image.published ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => onMove(index, -1)}
                  disabled={index === 0}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move image up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onMove(index, 1)}
                  disabled={index === images.length - 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move image down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(image)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function ProjectThumb({ project }: { project: PortfolioItem }) {
  const imageUrl =
    project.coverImageUrl ||
    project.imageRecords?.find((image) => image.coverImage)?.imageUrl ||
    project.imageRecords?.[0]?.imageUrl ||
    project.images?.[0];

  return (
    <div className="relative min-h-48 overflow-hidden bg-brand-navy sm:min-h-full">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 190px, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full min-h-48 items-center justify-center text-brand-gold">
          <ImagePlus className="h-10 w-10" aria-hidden="true" />
        </div>
      )}
    </div>
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

function sortImages(a: PortfolioImage, b: PortfolioImage) {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
}
