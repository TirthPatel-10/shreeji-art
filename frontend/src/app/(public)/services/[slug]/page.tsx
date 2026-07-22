import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceDetail, SERVICE_SLUGS } from "@/lib/service-details";
import ServiceDetailClient from "./ServiceDetailClient";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceDetail(params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.label} | Shreeji Art`,
    description: service.description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.label} | Shreeji Art`,
      description: service.description,
      type: "website",
    },
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const service = getServiceDetail(params.slug);

  if (!service) notFound();

  return <ServiceDetailClient service={service} />;
}
