const testimonials = [
  {
    quote:
      "The booking flow was effortless, and the dinner itself felt like hosting a restaurant in our home.",
    author: "Maya R.",
    label: "Private Chef Client"
  },
  {
    quote: "Our corporate lunch service arrived polished, on time, and beautifully presented.",
    author: "Jordan T.",
    label: "Corporate Catering Client"
  },
  {
    quote: "Meal prep finally feels luxurious instead of repetitive. The variety and quality are incredible.",
    author: "Andrea L.",
    label: "Weekly Meal Prep Client"
  }
];

export function Testimonials() {
  return (
    <section className="bg-oat py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.author} className="rounded-[2rem] bg-white p-8 shadow-soft">
              <p className="text-lg leading-8 text-ink">{item.quote}</p>
              <div className="mt-8">
                <p className="font-medium text-ink">{item.author}</p>
                <p className="text-sm text-ink/60">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
