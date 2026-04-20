import { NextRequest, NextResponse } from "next/server";

import { calculateBookingPrice, isSlotAvailable, resolveBookingWindow } from "@/lib/booking";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";

export async function GET() {
  try {
    const session = await requireUser();
    const bookings = await prisma.booking.findMany({
      where: session.role === "ADMIN" ? {} : { userId: session.userId },
      include: {
        mealPlan: true,
        cateringMenu: true,
        chefService: true,
        payments: true
      },
      orderBy: { startAt: "desc" }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const body = bookingSchema.parse(await request.json());

    if (session.userId !== body.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "You cannot create bookings for another user." }, { status: 403 });
    }

    const { startAt, endAt } = await resolveBookingWindow({
      type: body.type,
      startAt: body.startAt,
      timezone: body.timezone
    });

    const availability = await isSlotAvailable({
      startAt,
      endAt,
      timezone: body.timezone
    });

    if (!availability.available) {
      return NextResponse.json({ error: availability.reason }, { status: 409 });
    }

    const pricing = await calculateBookingPrice({
      type: body.type,
      itemId: body.itemId,
      guestCount: body.guestCount,
      paymentOption: body.paymentOption
    });

    const booking = await prisma.booking.create({
      data: {
        type: body.type,
        userId: body.userId,
        guestCount: body.guestCount,
        startAt,
        endAt,
        timezone: body.timezone,
        eventAddress: body.eventAddress,
        specialRequests: body.specialRequests,
        serviceAgreement: body.serviceAgreement ?? false,
        deliveryFrequency: body.deliveryFrequency,
        isRecurring: body.isRecurring ?? false,
        totalPrice: pricing.totalPrice,
        depositAmount: pricing.depositAmount,
        ...(body.type === "MEAL_PREP" ? { mealPlanId: body.itemId } : {}),
        ...(body.type === "CATERING" ? { cateringMenuId: body.itemId } : {}),
        ...(body.type === "CHEF_EVENT" ? { chefServiceId: body.itemId } : {})
      }
    });

    return NextResponse.json({ ok: true, booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking." },
      { status: 400 }
    );
  }
}
