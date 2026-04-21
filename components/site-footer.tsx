export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-ink/70 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-xl text-ink">Chef Thai</p>
          <p className="mt-2">Premium meal prep, refined catering, and unforgettable chef-led events.</p>
        </div>
        <div>
          <p className="font-medium text-ink">Contact</p>
          <p className="mt-2">hello@emberandthyme.com</p>
          <p>(555) 555-0186</p>
        </div>
        <div>
          <p className="font-medium text-ink">Service Region</p>
          <p className="mt-2">Greater Los Angeles, Orange County, and destination private events by request.</p>
        </div>
      </div>
    </footer>
  );
}
