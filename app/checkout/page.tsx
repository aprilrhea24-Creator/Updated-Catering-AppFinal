import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  await requireUser();
  const { bookingId } = await searchParams;

  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          mealPlan: true,
          cateringMenu: true,
          chefService: true,
          payments: true
        }
      })
    : null;

  const title =
    booking?.mealPlan?.name ?? booking?.cateringMenu?.title ?? booking?.chefService?.title ?? "Booking";

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] border border-ink/10 bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-ember">Checkout</p>
        <h1 className="mt-4 font-display text-5xl text-ink">Review your order and collect payment securely.</h1>
        {booking ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] bg-oat p-6">
              <p className="font-display text-2xl text-ink">{title}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                <li>Total price: {formatCurrency(booking.totalPrice)}</li>
                <li>Deposit due now: {formatCurrency(booking.depositAmount)}</li>
                <li>Event date: {new Date(booking.startAt).toLocaleString()}</li>
                <li>Booking type: {booking.type.replace("_", " ")}</li>
              </ul>
            </div>
            <form action="/api/payments/checkout" method="POST" className="space-y-4 rounded-[2rem] border border-ink/10 p-6">
              <input type="hidden" name="bookingId" value={booking.id} />
              <button className="w-full rounded-full bg-ink px-5 py-3 font-medium text-cream transition hover:bg-olive">
                Start Stripe Checkout
              </button>
              <p className="text-sm text-ink/70">
                If Stripe keys are missing, the API will fall back to a simulated payment record so the booking flow stays testable.
              </p>
            </form>
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] bg-oat p-6 text-sm text-ink/75">
            No booking selected. Reserve a service first to continue to checkout.
          </div>
        )}
        <Link href="/dashboard" className="mt-6 inline-flex text-sm text-ember">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
