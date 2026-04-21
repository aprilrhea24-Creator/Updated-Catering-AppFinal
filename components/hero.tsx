import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink bg-chef-glow text-cream">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.15),transparent_40%,rgba(215,169,91,0.08))]" />
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Chef-led hospitality</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Catering, meal prep, and private chef experiences with a polished, modern touch.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/80">
            Designed for clients who want elegant food, seamless booking, and a premium experience from the first click
            to the final course.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/meal-prep" className="rounded-full bg-gold px-6 py-3 font-medium text-ink transition hover:bg-gold/90">
              Meal Prep Plans
            </Link>
            <Link href="/catering" className="rounded-full border border-cream/20 px-6 py-3 font-medium transition hover:bg-white/5">
              Catering
            </Link>
            <Link href="/personal-chef" className="rounded-full border border-cream/20 px-6 py-3 font-medium transition hover:bg-white/5">
              Personal Chef Events
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div
              className="h-[420px] rounded-[2rem] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80')
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
