import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Shreeji Art — Ahmedabad's trusted signage manufacturing and branding company.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-6">
        About Shreeji Art
      </h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Shreeji Art is Ahmedabad&apos;s premier signage manufacturing and branding
        company. For over a decade, we have helped businesses across Gujarat
        communicate their brand through impactful, durable, and beautifully
        crafted signs.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        From small retail shops to large corporate campuses, we design, fabricate,
        and install every sign in-house — ensuring consistent quality and fast
        turnaround.
      </p>
      <h2 className="text-2xl font-display font-bold text-brand-navy mt-10 mb-4">
        Our Values
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-600">
        <li>Quality craftsmanship on every project</li>
        <li>Transparent pricing and timelines</li>
        <li>End-to-end service — design, fabrication, installation</li>
        <li>Long-term relationships with our clients</li>
      </ul>
    </main>
  );
}
