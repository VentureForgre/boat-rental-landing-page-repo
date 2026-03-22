export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-24 text-slate-50">
      <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
          Next.js baseline
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Luxe Lake Escapes
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          The repository now has a minimal App Router foundation, global styling,
          linting, and test coverage ready for the landing page implementation.
        </p>
      </section>
    </main>
  );
}

