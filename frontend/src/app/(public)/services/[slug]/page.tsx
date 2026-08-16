import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceDetail, SERVICE_SLUGS } from "@/lib/service-details";
import { getPublicSiteContact } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
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
      title: { absolute: "Service Not Found | Shreeji Art" },
      robots: { index: false, follow: false },
    };
  }

  return pageMetadata({
    title: `${service.label} in Ahmedabad | Shreeji Art`,
    description: service.description,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = getServiceDetail(params.slug);

  if (!service) notFound();

  const contact = await getPublicSiteContact();

  return <ServiceDetailClient service={service} contact={contact} />;
}
