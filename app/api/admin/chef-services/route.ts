import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const chefService = await prisma.chefService.create({
      data: {
        eventType: String(body.eventType),
        title: String(body.title),
        description: String(body.description),
        pricingModel: String(body.pricingModel),
        basePrice: Number(body.basePrice),
        hourlyRate: body.hourlyRate ? Number(body.hourlyRate) : null,
        minimumGuests: Number(body.minimumGuests),
        durationHours: Number(body.durationHours)
      }
    });

    return NextResponse.json({ ok: true, chefService }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create chef service." },
      { status: 400 }
    );
  }
}
