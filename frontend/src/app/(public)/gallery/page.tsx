"use client";

import { useState, useEffect } from "react";
import { publicApi } from "@/lib/api";
import type { GalleryItem } from "@/types";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getGallery()
      .then((res) => {
        const all = (res.data as GalleryItem[]) ?? [];
        setItems(all);
        const unique = Array.from(
          new Set(all.map((i) => i.category).filter(Boolean))
        );
        setCategories(unique);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayed =
    category ? items.filter((i) => i.category === category) : items;

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Gallery
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Browse our work — filter by signage type
      </p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === ""
                ? "bg-brand-gold text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c
                  ? "bg-brand-gold text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg aspect-square animate-pulse"
            />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">🖼️</p>
          <p>No gallery items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 rounded-lg aspect-square overflow-hidden relative group"
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">
                  {item.title}
                </div>
              )}
              <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs font-medium">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
