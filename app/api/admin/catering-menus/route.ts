import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const cateringMenu = await prisma.cateringMenu.create({
      data: {
        category: String(body.category),
        title: String(body.title),
        description: String(body.description),
        pricePerPerson: Number(body.pricePerPerson),
        minimumGuestCount: Number(body.minimumGuestCount),
        serviceHours: body.serviceHours ? Number(body.serviceHours) : 3
      }
    });

    return NextResponse.json({ ok: true, cateringMenu }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create catering menu." },
      { status: 400 }
    );
  }
}
