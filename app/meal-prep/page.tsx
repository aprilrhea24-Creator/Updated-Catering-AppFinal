import { BookingForm } from "@/components/forms/booking-form";
import { SectionTitle } from "@/components/section-title";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function MealPrepPage() {
  const [plans, user] = await Promise.all([
    prisma.mealPlan.findMany({ where: { active: true }, orderBy: { price: "asc" } }),
    getCurrentUser()
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Meal Prep Plans"
        title="Weekly chef-crafted meals for clients who want convenience without compromise."
        description="Offer subscriptions or one-time drop-offs, collect dietary notes, and start each plan on a date that fits your schedule."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-ink">{plan.name}</h2>
                <p className="mt-2 text-sm text-ink/70">{plan.description}</p>
              </div>
              <p className="text-sm font-medium text-olive">{formatCurrency(plan.price)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {plan.dietaryTags.map((tag) => (
                <span key={tag} className="rounded-full bg-oat px-3 py-1 text-xs uppercase tracking-[0.16em] text-ink/70">
                  {tag}
                </span>
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-ink/75">
              <li>{plan.mealsPerWeek} meals per week</li>
              <li>{plan.calories ? `${plan.calories} calories target` : "Calories customized on request"}</li>
              <li>{plan.isSubscription ? "Subscription available" : "One-time order"}</li>
              <li>Delivery days: {plan.deliveryDays.join(", ")}</li>
            </ul>
            <div className="mt-6">
              <BookingForm type="MEAL_PREP" itemId={plan.id} userId={user?.id} allowRecurring />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
