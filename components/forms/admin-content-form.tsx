"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminContentForm({ endpoint, fields, title }: {
  endpoint: string;
  title: string;
  fields: Array<{ name: string; label: string; type?: "text" | "number" | "textarea" }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Save failed.");
      setLoading(false);
      return;
    }

    event.currentTarget.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <div className="mt-4 space-y-4">
        {fields.map((field) =>
          field.type === "textarea" ? (
            <textarea
              key={field.name}
              name={field.name}
              placeholder={field.label}
              className="min-h-24 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
              required
            />
          ) : (
            <input
              key={field.name}
              type={field.type ?? "text"}
              name={field.name}
              placeholder={field.label}
              className="w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none"
              required
            />
          )
        )}
      </div>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition hover:bg-olive disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
