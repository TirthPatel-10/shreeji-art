import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { publicApi } from "@/lib/api";
import { getPublicSiteContact } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
import type { Service } from "@/types";

export const metadata: Metadata = pageMetadata({
  title: "Signage Services in Ahmedabad | Shreeji Art",
  description:
    "Explore Shreeji Art signage services in Ahmedabad, including LED sign boards, acrylic signage, 3D letters, ACP signage, stainless steel signs, wayfinding, branding and installation.",
  path: "/services",
});

export default async function ServicesPage() {
  let services: Service[] = [];
  const contact = await getPublicSiteContact();

  try {
    const servicesRes = await publicApi.getServices();
    services = (servicesRes.data as Service[]) ?? [];
  } catch {
    /* ServicesClient uses static service details as a visual fallback */
  }
  return <ServicesClient services={services} contact={contact} />;
}
