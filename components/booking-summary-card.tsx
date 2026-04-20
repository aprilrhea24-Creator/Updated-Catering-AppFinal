import { formatCurrency } from "@/lib/utils";

export function BookingSummaryCard({
  title,
  subtitle,
  price,
  details
}: {
  title: string;
  subtitle: string;
  price: number | string;
  details: string[];
}) {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ember">{subtitle}</p>
          <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
        </div>
        <p className="text-sm font-medium text-olive">{formatCurrency(price)}</p>
      </div>
      <ul className="mt-5 space-y-2 text-sm leading-6 text-ink/75">
        {details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </div>
  );
}
