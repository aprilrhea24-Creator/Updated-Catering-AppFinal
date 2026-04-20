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

    const cateringMenu = await prisma.cateringMenu.update({
      where: { id },
      data: {
        category: body.category,
        title: body.title,
        description: body.description,
        pricePerPerson: body.pricePerPerson ? Number(body.pricePerPerson) : undefined,
        minimumGuestCount: body.minimumGuestCount ? Number(body.minimumGuestCount) : undefined,
        serviceHours: body.serviceHours ? Number(body.serviceHours) : undefined,
        active: body.active !== undefined ? Boolean(body.active) : undefined
      }
    });

    return NextResponse.json({ ok: true, cateringMenu });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update catering menu." },
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
    await prisma.cateringMenu.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete catering menu." },
      { status: 400 }
    );
  }
}
