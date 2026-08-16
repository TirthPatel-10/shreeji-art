import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Login | Shreeji Art",
  description: "Sign in to the Shreeji Art dashboard.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginForm />;
}
