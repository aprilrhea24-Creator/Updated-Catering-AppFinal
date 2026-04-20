"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookingFormProps = {
  type: "MEAL_PREP" | "CATERING" | "CHEF_EVENT";
  itemId: string;
  userId?: string;
  minimumGuests?: number;
  allowRecurring?: boolean;
  requireAgreement?: boolean;
};

export function BookingForm({
  type,
  itemId,
  userId,
  minimumGuests = 1,
  allowRecurring = false,
  requireAgreement = false
}: BookingFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        type,
        itemId,
        userId
      })
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Unable to create booking.");
      setLoading(false);
      return;
    }

    router.push(`/checkout?bookingId=${result.booking.id}`);
    router.refresh();
  }

  if (!userId) {
    return (
      <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm text-ink/75">Create an account before reserving your service.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
      <input
        type="datetime-local"
        name="startAt"
        className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
        required
      />
      <input
        name="timezone"
        defaultValue="America/Los_Angeles"
        className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
        required
      />
      {type !== "MEAL_PREP" ? (
        <input
          type="number"
          name="guestCount"
          min={minimumGuests}
          defaultValue={minimumGuests}
          className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
          required
        />
      ) : null}
      {type === "MEAL_PREP" ? (
        <select name="deliveryFrequency" className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none">
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
        </select>
      ) : null}
      {type !== "MEAL_PREP" ? (
        <textarea
          name="eventAddress"
          placeholder="Event address"
          className="min-h-24 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
          required
        />
      ) : null}
      <textarea
        name="specialRequests"
        placeholder="Special requests or dietary notes"
        className="min-h-24 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
      />
      {allowRecurring ? (
        <label className="flex items-center gap-3 text-sm text-ink/75">
          <input type="checkbox" name="isRecurring" value="true" />
          Make this a recurring service
        </label>
      ) : null}
      {requireAgreement ? (
        <label className="flex items-start gap-3 text-sm text-ink/75">
          <input type="checkbox" name="serviceAgreement" value="true" required />
          I agree to the service terms, timing policies, and kitchen/site access requirements.
        </label>
      ) : null}
      <select name="paymentOption" className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none">
        <option value="deposit">Pay deposit</option>
        <option value="full">Pay in full</option>
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ink px-5 py-3 font-medium text-cream transition hover:bg-olive disabled:opacity-60"
      >
        {loading ? "Reserving..." : "Reserve & Continue"}
      </button>
    </form>
  );
}
