import { NextRequest, NextResponse } from "next/server";

import { getRequestBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { availabilitySchema } from "@/lib/validation";

export async function GET() {
  const availability = await prisma.availability.findMany({
    orderBy: [{ date: "asc" }, { startHour: "asc" }]
  });

  return NextResponse.json({ availability });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = availabilitySchema.parse(await getRequestBody(request));

    const availability = await prisma.availability.create({
      data: {
        date: new Date(body.date),
        startHour: body.startHour,
        endHour: body.endHour,
        isAvailable: body.isAvailable,
        timezone: body.timezone,
        bufferHours: body.bufferHours,
        notes: body.notes
      }
    });

    if (request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ ok: true, availability }, { status: 201 });
    }

    return NextResponse.redirect(new URL("/admin", request.url));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save availability." },
      { status: 400 }
    );
  }
}
