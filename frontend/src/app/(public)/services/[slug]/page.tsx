import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicApi } from "@/lib/api";
import type { Service } from "@/types";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await publicApi.getServices();
    const services = (res.data as Service[]) ?? [];
    const service = services.find((s) => s.slug === params.slug);
    if (service) {
      return {
        title: service.name,
        description: `Learn about Shreeji Art's ${service.name} service in Ahmedabad.`,
      };
    }
  } catch { /* fallback */ }

  const name = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { title: name };
}

export default async function ServiceDetailPage({ params }: Props) {
  let service: Service | undefined;
  try {
    const res = await publicApi.getServices();
    const services = (res.data as Service[]) ?? [];
    service = services.find((s) => s.slug === params.slug);
  } catch { /* fall through to notFound */ }

  if (!service) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/services" className="text-brand-gold text-sm hover:underline">
        ← Back to Services
      </Link>
      <h1 className="text-4xl font-display font-bold text-brand-navy mt-6 mb-4">
        {service.name}
      </h1>
      <p className="text-gray-600 text-lg mb-4">{service.shortDescription}</p>
      {service.description && (
        <p className="text-gray-500 mb-8">{service.description}</p>
      )}
      <Link
        href={`/quote?service=${encodeURIComponent(service.name)}`}
        className="inline-block bg-brand-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-gold-dark transition-colors"
      >
        Request a Quote for {service.name}
      </Link>
    </main>
  );
}
