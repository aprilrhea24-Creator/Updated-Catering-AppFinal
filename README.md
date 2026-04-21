# Chef Thai Booking Platform

A premium, mobile-first catering and personal chef booking application built with Next.js, Tailwind CSS, Prisma, PostgreSQL, JWT-based cookie auth, and Stripe checkout hooks.

## Included Features

- Responsive landing page with premium chef-focused branding
- Email/password authentication with protected customer and admin areas
- Meal prep booking flows with recurring frequency options
- Catering booking flows with per-person pricing and guest minimums
- Personal chef event booking flows with service agreement confirmation
- Unified availability engine with conflict prevention and buffer windows
- Stripe checkout route plus webhook support
- Admin dashboard for content creation, booking review, pricing, and availability windows
- Prisma schema and seed data for quick testing

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Stripe
- Zod validation
- JOSE JWT sessions

## Project Structure

```text
app/
  api/
  admin/
  catering/
  checkout/
  dashboard/
  login/
  meal-prep/
  personal-chef/
  register/
components/
  forms/
lib/
prisma/
```

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chef_booking"
JWT_SECRET="replace-with-a-long-random-secret"
STRIPE_SECRET_KEY="sk_test_replace_me"
STRIPE_WEBHOOK_SECRET="whsec_replace_me"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_replace_me"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="owner@example.com"
```

## Local Setup

1. Install Node.js 20+ and npm.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run database migrations:

```bash
npm run prisma:migrate
```

5. Seed the database:

```bash
npm run prisma:seed
```

6. Start the development server:

```bash
npm run dev
```

## Seeded Accounts

- Admin: `owner@example.com`
- Password: `Password123!`

You can change the admin email via `ADMIN_EMAIL`.

## Deployment Notes

This codebase is structured for Vercel-style deployment:

- Host the app on Vercel
- Use a managed PostgreSQL provider like Neon, Supabase, or Railway
- Add the environment variables in your hosting dashboard
- Run Prisma migrations during deployment or via CI
- Point Stripe webhook events to `/api/payments/webhook`

## Important Implementation Notes

- Auth uses a signed JWT stored in an HTTP-only cookie.
- The booking engine calculates pricing and checks availability before inserting a booking.
- Availability supports admin-defined windows and buffer hours to avoid back-to-back overbooking.
- If Stripe keys are not set, checkout falls back to a simulated paid booking so UI flows remain testable.
- Admin create routes are included, and update/delete API endpoints are also present for future dashboard controls.

## Suggested Next Steps

- Add a richer cart experience for bundling services
- Add email delivery using Resend, SendGrid, or Postmark
- Add Stripe webhook reconciliation tests
- Add image CMS support for live menu photography
- Add unit and integration tests once Node is installed locally
