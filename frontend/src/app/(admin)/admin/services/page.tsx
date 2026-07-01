import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services — Admin" };

export default function AdminServicesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Services</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">⚡</p>
        <p className="font-medium">Service catalog loads from API</p>
        <p className="text-sm mt-1">Edit descriptions, images, and display order here.</p>
      </div>
    </div>
  );
}
