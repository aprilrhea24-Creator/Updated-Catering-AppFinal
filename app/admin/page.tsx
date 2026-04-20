import { AdminContentForm } from "@/components/forms/admin-content-form";
import { SectionTitle } from "@/components/section-title";
import { getAdminData } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  await requireAdmin();
  const data = await getAdminData();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Admin Dashboard"
        title="Manage menus, services, bookings, availability, and customer details."
        description="This dashboard is structured to grow with your operations: content management, pricing updates, event logistics, and scheduling all live together."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-ink p-6 text-cream shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-gold">Customers</p>
          <p className="mt-4 font-display text-4xl">{data.users.length}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-ember">Bookings</p>
          <p className="mt-4 font-display text-4xl text-ink">{data.bookings.length}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-ember">Revenue Booked</p>
          <p className="mt-4 font-display text-4xl text-ink">
            {formatCurrency(data.bookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0))}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <AdminContentForm
          endpoint="/api/admin/meal-plans"
          title="Add Meal Plan"
          fields={[
            { name: "name", label: "Plan name" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "mealsPerWeek", label: "Meals per week", type: "number" },
            { name: "price", label: "Price", type: "number" },
            { name: "dietaryTags", label: "Dietary tags (comma-separated)" },
            { name: "deliveryDays", label: "Delivery days (comma-separated)" }
          ]}
        />
        <AdminContentForm
          endpoint="/api/admin/catering-menus"
          title="Add Catering Menu"
          fields={[
            { name: "category", label: "Category" },
            { name: "title", label: "Menu title" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "pricePerPerson", label: "Price per person", type: "number" },
            { name: "minimumGuestCount", label: "Minimum guest count", type: "number" }
          ]}
        />
        <AdminContentForm
          endpoint="/api/admin/chef-services"
          title="Add Chef Service"
          fields={[
            { name: "eventType", label: "Event type" },
            { name: "title", label: "Service title" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "pricingModel", label: "Pricing model" },
            { name: "basePrice", label: "Base price", type: "number" },
            { name: "minimumGuests", label: "Minimum guests", type: "number" },
            { name: "durationHours", label: "Duration hours", type: "number" }
          ]}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink">Upcoming Bookings</h2>
          <div className="mt-6 space-y-4">
            {data.bookings.map((booking) => (
              <div key={booking.id} className="rounded-[1.5rem] bg-oat p-4">
                <p className="font-medium text-ink">
                  {booking.user.name} · {booking.mealPlan?.name ?? booking.cateringMenu?.title ?? booking.chefService?.title}
                </p>
                <p className="mt-1 text-sm text-ink/70">
                  {new Date(booking.startAt).toLocaleString()} · {booking.status} · {formatCurrency(booking.totalPrice)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink">Availability</h2>
          <form action="/api/availability" method="POST" className="mt-6 grid gap-4 md:grid-cols-2">
            <input type="datetime-local" name="date" className="rounded-2xl border border-ink/10 px-4 py-3 outline-none" required />
            <input type="number" name="startHour" min="0" max="23" placeholder="Start hour" className="rounded-2xl border border-ink/10 px-4 py-3 outline-none" required />
            <input type="number" name="endHour" min="1" max="24" placeholder="End hour" className="rounded-2xl border border-ink/10 px-4 py-3 outline-none" required />
            <input type="number" name="bufferHours" min="0" max="12" placeholder="Buffer hours" className="rounded-2xl border border-ink/10 px-4 py-3 outline-none" required />
            <input type="text" name="timezone" defaultValue="America/Los_Angeles" className="rounded-2xl border border-ink/10 px-4 py-3 outline-none md:col-span-2" required />
            <button className="rounded-full bg-ink px-5 py-3 font-medium text-cream transition hover:bg-olive md:col-span-2">
              Add Availability Window
            </button>
          </form>
          <div className="mt-6 space-y-4">
            {data.availability.map((slot) => (
              <div key={slot.id} className="rounded-[1.5rem] bg-oat p-4">
                <p className="font-medium text-ink">{new Date(slot.date).toLocaleDateString()}</p>
                <p className="mt-1 text-sm text-ink/70">
                  {slot.startHour}:00 - {slot.endHour}:00 · buffer {slot.bufferHours}h · {slot.timezone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
