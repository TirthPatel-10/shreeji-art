import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function GalleryLoading() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-brand-deep text-white">
        <section className="relative isolate border-b border-white/10 pt-28">
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(212,160,23,0.18),transparent_34%),linear-gradient(135deg,#070917_0%,#0B1024_52%,#050610_100%)]"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16">
            <div className="h-9 w-44 animate-pulse rounded-full bg-brand-gold/10" />
            <div className="mt-6 h-16 w-72 max-w-full animate-pulse rounded-2xl bg-white/10 sm:w-96" />
            <div className="mt-5 h-6 w-full max-w-2xl animate-pulse rounded-full bg-white/10" />
            <div className="mt-3 h-6 w-2/3 max-w-xl animate-pulse rounded-full bg-white/10" />
          </div>
        </section>

        <section className="border-b border-white/10 bg-brand-deep/85">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-white/[0.07]"
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {Array.from({ length: 9 }, (_, index) => (
              <div
                key={index}
                className={`mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] ${
                  index % 3 === 1 ? "h-80" : index % 3 === 2 ? "h-64" : "h-96"
                }`}
              >
                <div className="h-full w-full animate-pulse bg-gradient-to-br from-white/[0.10] via-white/[0.04] to-brand-gold/[0.08]" />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
