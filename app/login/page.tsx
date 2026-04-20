import Link from "next/link";

import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-ember">Welcome back</p>
          <h1 className="mt-4 font-display text-5xl text-ink">Sign in to manage bookings and upcoming events.</h1>
          <p className="mt-6 max-w-lg text-ink/70">
            View order summaries, complete payment, and keep your meal prep or event schedule organized in one place.
          </p>
        </div>
        <div>
          <AuthForm mode="login" />
          <p className="mt-4 text-sm text-ink/70">
            Need an account?{" "}
            <Link href="/register" className="text-ember">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
