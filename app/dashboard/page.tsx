import { redirect } from "next/navigation";

import { BookingSummaryCard } from "@/components/booking-summary-card";
import { SectionTitle } from "@/components/section-title";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireUser();
  const user = await getDashboardData(session.userId);

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Client Dashboard"
        title={`Welcome back, ${user.name.split(" ")[0]}.`}
        description="Review your bookings, deposits, schedules, and service details from one streamlined workspace."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] bg-ink p-6 text-cream shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-gold">Profile</p>
          <p className="mt-4 text-lg">{user.email}</p>
          <p className="mt-1 text-sm text-cream/70">{user.phone}</p>
          <p className="mt-1 text-sm text-cream/70">{user.address}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-ember">Bookings</p>
          <p className="mt-4 font-display text-4xl text-ink">{user.bookings.length}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-ember">Open Balance Snapshot</p>
          <p className="mt-4 font-display text-4xl text-ink">
            {formatCurrency(
              user.bookings.reduce((total, booking) => {
                const paid = booking.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
                return total + (Number(booking.totalPrice) - paid);
              }, 0)
            )}
          </p>
        </div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {user.bookings.map((booking) => {
          const title =
            booking.mealPlan?.name ?? booking.cateringMenu?.title ?? booking.chefService?.title ?? "Service booking";

          return (
            <BookingSummaryCard
              key={booking.id}
              title={title}
              subtitle={booking.type.replace("_", " ")}
              price={Number(booking.totalPrice)}
              details={[
                `Status: ${booking.status}`,
                `Date: ${new Date(booking.startAt).toLocaleString()}`,
                `Timezone: ${booking.timezone}`,
                `Deposit: ${formatCurrency(Number(booking.depositAmount))}`,
                booking.eventAddress ? `Address: ${booking.eventAddress}` : "Address not required",
                booking.specialRequests ? `Notes: ${booking.specialRequests}` : "No special notes provided"
              ]}
            />
          );
        })}
      </div>
    </section>
  );
}
