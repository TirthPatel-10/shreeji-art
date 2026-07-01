import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: name,
    description: `Learn about Shreeji Art's ${name} service in Ahmedabad.`,
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const name = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/services" className="text-brand-gold text-sm hover:underline">
        ← Back to Services
      </Link>
      <h1 className="text-4xl font-display font-bold text-brand-navy mt-6 mb-4">
        {name}
      </h1>
      <p className="text-gray-500 mb-8">
        Detailed content for this service will be loaded from the CMS.
      </p>
      <Link
        href="/quote"
        className="bg-brand-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-gold-dark transition-colors"
      >
        Request a Quote for {name}
      </Link>
    </main>
  );
}
