import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { getRequestBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const body = await getRequestBody(request);
    const bookingId = String(body.bookingId ?? "");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        mealPlan: true,
        cateringMenu: true,
        chefService: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (session.role !== "ADMIN" && booking.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const amount = Number(booking.depositAmount);
    const title =
      booking.mealPlan?.name ?? booking.cateringMenu?.title ?? booking.chefService?.title ?? "Chef service booking";

    if (!stripe) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount,
          status: "PAID",
          paidAt: new Date()
        }
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED" }
      });

      return NextResponse.redirect(new URL(`/dashboard?payment=simulated`, request.url));
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?bookingId=${booking.id}&payment=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: `Deposit for ${booking.type.replace("_", " ")}`
            },
            unit_amount: Math.round(amount * 100)
          }
        }
      ],
      metadata: {
        bookingId: booking.id,
        userId: booking.userId
      }
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripeSessionId: checkoutSession.id,
        amount,
        status: "PENDING"
      }
    });

    return NextResponse.redirect(checkoutSession.url ?? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout." },
      { status: 400 }
    );
  }
}
