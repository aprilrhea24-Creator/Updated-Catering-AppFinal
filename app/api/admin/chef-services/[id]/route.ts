import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const chefService = await prisma.chefService.update({
      where: { id },
      data: {
        eventType: body.eventType,
        title: body.title,
        description: body.description,
        pricingModel: body.pricingModel,
        basePrice: body.basePrice ? Number(body.basePrice) : undefined,
        hourlyRate: body.hourlyRate ? Number(body.hourlyRate) : undefined,
        minimumGuests: body.minimumGuests ? Number(body.minimumGuests) : undefined,
        durationHours: body.durationHours ? Number(body.durationHours) : undefined,
        active: body.active !== undefined ? Boolean(body.active) : undefined
      }
    });

    return NextResponse.json({ ok: true, chefService });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update chef service." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.chefService.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete chef service." },
      { status: 400 }
    );
  }
}
