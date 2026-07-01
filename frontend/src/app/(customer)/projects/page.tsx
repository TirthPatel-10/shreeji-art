import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Projects" };

export default function CustomerProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">My Projects</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
        <p className="text-4xl mb-3">🏗️</p>
        <p className="font-medium">No active projects</p>
        <p className="text-sm mt-1">
          Your ongoing and completed projects will be tracked here.
        </p>
      </div>
    </div>
  );
}
