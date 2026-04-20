import { BookingForm } from "@/components/forms/booking-form";
import { SectionTitle } from "@/components/section-title";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function PersonalChefPage() {
  const [services, user] = await Promise.all([
    prisma.chefService.findMany({ where: { active: true }, orderBy: { basePrice: "asc" } }),
    getCurrentUser()
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Personal Chef Events"
        title="Luxury chef experiences for intimate dinners, interactive classes, and unforgettable milestones."
        description="Support flat-rate or hourly offers, service agreements, guest counts, and premium event details in a single booking flow."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-ember">{service.eventType}</p>
            <h2 className="mt-3 font-display text-2xl text-ink">{service.title}</h2>
            <p className="mt-3 text-sm text-ink/70">{service.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/75">
              <li>From {formatCurrency(service.basePrice)}</li>
              <li>{service.pricingModel === "hourly" ? `${formatCurrency(service.hourlyRate ?? 0)} hourly add-on` : "Flat-rate pricing"}</li>
              <li>{service.minimumGuests} guest minimum</li>
              <li>{service.durationHours} hour experience</li>
            </ul>
            <div className="mt-6">
              <BookingForm
                type="CHEF_EVENT"
                itemId={service.id}
                userId={user?.id}
                minimumGuests={service.minimumGuests}
                requireAgreement
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
