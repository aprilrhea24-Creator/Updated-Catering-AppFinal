import Link from "next/link";

import { Hero } from "@/components/hero";
import { SectionTitle } from "@/components/section-title";
import { ServiceCard } from "@/components/service-card";
import { Testimonials } from "@/components/testimonials";
import { getLandingData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function HomePage() {
  const { mealPlans, cateringMenus, chefServices, availability } = await getLandingData();

  return (
    <>
      <Hero />
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Signature Services"
            title="Built for weekly routines, milestone gatherings, and intimate chef experiences."
            description="Each service line has tailored pricing, availability logic, and booking flows so your clients can move from discovery to checkout without friction."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <ServiceCard
              title="Meal Prep Plans"
              subtitle="Recurring or one-time"
              price={`From ${formatCurrency(mealPlans[0]?.price ?? 0)}`}
              href="/meal-prep"
            >
              <p>Weekly and monthly chef-designed plans with dietary filters, delivery scheduling, and subscription-ready checkout.</p>
            </ServiceCard>
            <ServiceCard
              title="Catering Services"
              subtitle="Corporate to weddings"
              price={`${formatCurrency(cateringMenus[0]?.pricePerPerson ?? 0)} / guest`}
              href="/catering"
            >
              <p>Per-person pricing, minimum guest counts, event notes, scheduling, and custom event address capture.</p>
            </ServiceCard>
            <ServiceCard
              title="Personal Chef Events"
              subtitle="Private luxury dining"
              price={`From ${formatCurrency(chefServices[0]?.basePrice ?? 0)}`}
              href="/personal-chef"
            >
              <p>Private chef dinner parties, cooking classes, and special occasions with agreement acknowledgement and availability checks.</p>
            </ServiceCard>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Next Availability"
              title="A unified booking calendar keeps the schedule polished."
              description="Admin-managed windows, buffer times, and booking conflict prevention keep events realistic and easy to manage."
            />
          </div>
          <div className="grid gap-4">
            {availability.map((slot) => (
              <div key={slot.id} className="rounded-[1.75rem] border border-ink/10 bg-oat p-5">
                <p className="font-medium text-ink">
                  {new Date(slot.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
                <p className="mt-1 text-sm text-ink/70">
                  {slot.startHour}:00 - {slot.endHour}:00 ({slot.timezone})
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Testimonials />
      <section className="bg-ink py-20 text-cream">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Ready to Launch"
            title="Give clients a booking experience that feels as polished as your menu."
            description="Create an account to book services, manage orders, and move seamlessly into secure checkout."
            align="center"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="rounded-full bg-gold px-6 py-3 font-medium text-ink transition hover:bg-gold/90">
              Create Account
            </Link>
            <Link href="/login" className="rounded-full border border-white/10 px-6 py-3 font-medium transition hover:bg-white/5">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
