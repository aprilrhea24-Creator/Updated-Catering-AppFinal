import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="text-sm uppercase tracking-[0.25em] text-ember">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-ink/70">{description}</p> : null}
    </div>
  );
}
