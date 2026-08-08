import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Shreeji Art",
  robots: { index: false, follow: false },
};

type AdminLoginPageProps = {
  searchParams?: {
    from?: string | string[];
  };
};

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const from =
    typeof searchParams?.from === "string"
      ? searchParams.from
      : searchParams?.from?.[0];
  const safeFrom =
    from && from.startsWith("/admin") && from !== "/admin/login"
      ? `?from=${encodeURIComponent(from)}`
      : "";

  redirect(`/login${safeFrom}`);
}
