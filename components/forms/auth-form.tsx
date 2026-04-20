"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push(result.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft">
      {mode === "register" ? (
        <input name="name" placeholder="Full name" className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none" required />
      ) : null}
      <input
        name="email"
        type="email"
        placeholder="Email address"
        className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
        required
      />
      {mode === "register" ? (
        <>
          <input name="phone" placeholder="Phone number" className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none" required />
          <textarea
            name="address"
            placeholder="Primary address"
            className="min-h-24 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
            required
          />
        </>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ink px-5 py-3 font-medium text-cream transition hover:bg-olive disabled:opacity-60"
      >
        {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
