import { NextResponse } from "next/server";

import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

    if (existingUser) {
      return NextResponse.json({ error: "An account already exists with that email." }, { status: 409 });
    }

    const role = body.email === process.env.ADMIN_EMAIL ? "ADMIN" : "CUSTOMER";
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        role,
        passwordHash: await hashPassword(body.password)
      }
    });

    await createSession({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      ok: true,
      redirectTo: user.role === "ADMIN" ? "/admin" : "/dashboard"
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to register account." },
      { status: 400 }
    );
  }
}
