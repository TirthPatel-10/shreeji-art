import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Create Account | Shreeji Art",
  description: "Create a Shreeji Art customer account.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return <RegisterForm />;
}
