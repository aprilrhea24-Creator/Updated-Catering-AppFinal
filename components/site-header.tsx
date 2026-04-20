import Link from "next/link";

import { getSession } from "@/lib/auth";

const navItems = [
  { href: "/meal-prep", label: "Meal Prep" },
  { href: "/catering", label: "Catering" },
  { href: "/personal-chef", label: "Personal Chef" }
];

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl text-cream">
          Ember & Thyme
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-cream/80 transition hover:text-cream">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href={session.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="rounded-full border border-gold/60 px-4 py-2 text-sm text-cream transition hover:bg-gold hover:text-ink"
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button className="rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink transition hover:bg-oat">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-cream/80 transition hover:text-cream">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink transition hover:bg-gold/90"
              >
                Book Now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
