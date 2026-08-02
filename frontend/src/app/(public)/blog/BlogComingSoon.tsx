import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogComingSoon() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-off-white text-brand-navy">
        <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white bg-white p-8 text-center shadow-sa-xl sm:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
              <Clock3 className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
              Coming Soon
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl">
              Shreeji Art insights are being prepared.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
              Our signage and branding articles are temporarily unavailable while
              we prepare this section for launch.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-navy shadow-sa-md transition-colors hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Back to Home
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer compact />
    </>
  );
}
