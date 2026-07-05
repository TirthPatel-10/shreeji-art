import type { Metadata } from "next";
import QuoteForm from "./QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Request a free signage quote from Shreeji Art, Ahmedabad.",
};

export default function QuotePage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-2 text-center">
        Request a Free Quote
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Fill in your details and we&apos;ll get back to you within 24 hours
      </p>
      <QuoteForm />
    </main>
  );
}
