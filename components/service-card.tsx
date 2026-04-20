import Link from "next/link";
import type { ReactNode } from "react";

export function ServiceCard({
  title,
  subtitle,
  price,
  href,
  children
}: {
  title: string;
  subtitle: string;
  price: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ember">{subtitle}</p>
          <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
        </div>
        <p className="text-sm font-medium text-olive">{price}</p>
      </div>
      <div className="mt-5 space-y-3 text-sm leading-6 text-ink/75">{children}</div>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition hover:bg-olive"
      >
        Explore Service
      </Link>
    </div>
  );
}
