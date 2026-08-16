import type { MetadataRoute } from "next";
import { PRODUCTION_SITE_URL, absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/dashboard",
          "/profile",
          "/projects",
          "/quotes",
          "/login",
          "/register",
          "/api",
          "/blog",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: PRODUCTION_SITE_URL,
  };
}
