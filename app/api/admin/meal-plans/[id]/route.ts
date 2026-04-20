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

    const mealPlan = await prisma.mealPlan.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        mealsPerWeek: body.mealsPerWeek ? Number(body.mealsPerWeek) : undefined,
        calories: body.calories ? Number(body.calories) : undefined,
        dietaryTags: body.dietaryTags
          ? String(body.dietaryTags)
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean)
          : undefined,
        price: body.price ? Number(body.price) : undefined,
        deliveryDays: body.deliveryDays
          ? String(body.deliveryDays)
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean)
          : undefined,
        active: body.active !== undefined ? Boolean(body.active) : undefined
      }
    });

    return NextResponse.json({ ok: true, mealPlan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update meal plan." },
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
    await prisma.mealPlan.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete meal plan." },
      { status: 400 }
    );
  }
}
