import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { publicApi } from "@/lib/api";
import type { Service } from "@/types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Shreeji Art's complete signage services: LED signs, acrylic, 3D letters, ACP, SS signage, office branding, retail branding and more.",
};

export default async function ServicesPage() {
  let services: Service[] = [];
  try {
    const servicesRes = await publicApi.getServices();
    services = (servicesRes.data as Service[]) ?? [];
  } catch {
    /* ServicesClient uses static service details as a visual fallback */
  }
  return <ServicesClient services={services} />;
}
