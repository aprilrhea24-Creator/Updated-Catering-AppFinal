import { BookingForm } from "@/components/forms/booking-form";
import { SectionTitle } from "@/components/section-title";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function CateringPage() {
  const [menus, user] = await Promise.all([
    prisma.cateringMenu.findMany({ where: { active: true }, orderBy: { pricePerPerson: "asc" } }),
    getCurrentUser()
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Catering"
        title="Professional catering packages for meetings, celebrations, weddings, and elevated gatherings."
        description="Clients can browse categories, view per-person pricing, enter guest counts, and lock in event timing with detailed notes."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {menus.map((menu) => (
          <div key={menu.id} className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-ember">{menu.category}</p>
            <h2 className="mt-3 font-display text-2xl text-ink">{menu.title}</h2>
            <p className="mt-3 text-sm text-ink/70">{menu.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/75">
              <li>{formatCurrency(menu.pricePerPerson)} per guest</li>
              <li>{menu.minimumGuestCount} guest minimum</li>
              <li>{menu.serviceHours} service hours included</li>
            </ul>
            <div className="mt-6">
              <BookingForm
                type="CATERING"
                itemId={menu.id}
                userId={user?.id}
                minimumGuests={menu.minimumGuestCount}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
