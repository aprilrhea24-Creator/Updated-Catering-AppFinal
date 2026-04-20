import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const mealPlan = await prisma.mealPlan.create({
      data: {
        name: String(body.name),
        description: String(body.description),
        mealsPerWeek: Number(body.mealsPerWeek),
        calories: body.calories ? Number(body.calories) : null,
        dietaryTags: String(body.dietaryTags)
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        price: Number(body.price),
        deliveryDays: String(body.deliveryDays)
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        isSubscription: true
      }
    });

    return NextResponse.json({ ok: true, mealPlan }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create meal plan." },
      { status: 400 }
    );
  }
}
