import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "owner@example.com" },
    update: {},
    create: {
      name: "Chef Owner",
      email: process.env.ADMIN_EMAIL ?? "owner@example.com",
      passwordHash,
      phone: "(555) 111-2030",
      address: "101 Market St, San Francisco, CA",
      role: UserRole.ADMIN
    }
  });

  await prisma.mealPlan.createMany({
    data: [
      {
        name: "Balanced Weekly Reset",
        description: "Chef-crafted weekly meals for busy professionals.",
        mealsPerWeek: 10,
        calories: 1800,
        dietaryTags: ["high-protein", "gluten-free option"],
        price: 165,
        isSubscription: true,
        deliveryDays: ["Monday", "Thursday"]
      },
      {
        name: "Plant-Forward Signature",
        description: "Seasonal vegetarian dishes with premium produce.",
        mealsPerWeek: 12,
        calories: 1700,
        dietaryTags: ["vegetarian", "vegan-friendly"],
        price: 182,
        isSubscription: true,
        deliveryDays: ["Tuesday", "Friday"]
      },
      {
        name: "One-Time Family Prep Drop",
        description: "A one-time stocked fridge with reheatable family meals.",
        mealsPerWeek: 8,
        calories: null,
        dietaryTags: ["family-style"],
        price: 140,
        isSubscription: false,
        deliveryDays: ["Wednesday"]
      }
    ],
    skipDuplicates: true
  });

  await prisma.cateringMenu.createMany({
    data: [
      {
        category: "Corporate",
        title: "Boardroom Lunch Service",
        description: "Elegant boxed lunches and buffet trays for business teams.",
        pricePerPerson: 24,
        minimumGuestCount: 15,
        serviceHours: 2
      },
      {
        category: "Parties",
        title: "Celebration Grazing Spread",
        description: "Chef-hosted small bites and grazing tables for private events.",
        pricePerPerson: 38,
        minimumGuestCount: 20,
        serviceHours: 4
      },
      {
        category: "Weddings",
        title: "Wedding Reception Menu",
        description: "Full-service plated or family-style wedding reception dining.",
        pricePerPerson: 72,
        minimumGuestCount: 40,
        serviceHours: 6
      }
    ],
    skipDuplicates: true
  });

  await prisma.chefService.createMany({
    data: [
      {
        eventType: "Dinner Party",
        title: "Private Tasting Dinner",
        description: "Multi-course fine dining in your home with tableside presentation.",
        pricingModel: "flat",
        basePrice: 650,
        hourlyRate: null,
        minimumGuests: 2,
        durationHours: 4
      },
      {
        eventType: "Romantic Dinner",
        title: "Chef's Table for Two",
        description: "An intimate personal chef experience with curated menu planning.",
        pricingModel: "flat",
        basePrice: 420,
        hourlyRate: null,
        minimumGuests: 2,
        durationHours: 3
      },
      {
        eventType: "Cooking Class",
        title: "Interactive Cooking Experience",
        description: "Hands-on chef-led cooking lesson for small groups.",
        pricingModel: "hourly",
        basePrice: 250,
        hourlyRate: 110,
        minimumGuests: 4,
        durationHours: 3
      }
    ],
    skipDuplicates: true
  });

  await prisma.availability.createMany({
    data: [
      {
        date: new Date("2026-04-20"),
        startHour: 10,
        endHour: 20,
        isAvailable: true,
        bufferHours: 2
      },
      {
        date: new Date("2026-04-21"),
        startHour: 10,
        endHour: 20,
        isAvailable: true,
        bufferHours: 2
      },
      {
        date: new Date("2026-04-22"),
        startHour: 10,
        endHour: 20,
        isAvailable: true,
        bufferHours: 2
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
