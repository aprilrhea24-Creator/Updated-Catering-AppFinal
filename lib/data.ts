import { prisma } from "@/lib/prisma";

export async function getLandingData() {
  const [mealPlans, cateringMenus, chefServices, availability] = await Promise.all([
    prisma.mealPlan.findMany({ where: { active: true }, orderBy: { price: "asc" } }),
    prisma.cateringMenu.findMany({ where: { active: true }, orderBy: { pricePerPerson: "asc" } }),
    prisma.chefService.findMany({ where: { active: true }, orderBy: { basePrice: "asc" } }),
    prisma.availability.findMany({
      where: { isAvailable: true },
      orderBy: [{ date: "asc" }, { startHour: "asc" }],
      take: 7
    })
  ]);

  return {
    mealPlans,
    cateringMenus,
    chefServices,
    availability
  };
}

export async function getDashboardData(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: {
        include: {
          mealPlan: true,
          cateringMenu: true,
          chefService: true,
          payments: true
        },
        orderBy: { startAt: "desc" }
      }
    }
  });
}

export async function getAdminData() {
  const [mealPlans, cateringMenus, chefServices, bookings, availability, users] =
    await Promise.all([
      prisma.mealPlan.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.cateringMenu.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.chefService.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.booking.findMany({
        include: {
          user: true,
          mealPlan: true,
          cateringMenu: true,
          chefService: true,
          payments: true
        },
        orderBy: { startAt: "asc" }
      }),
      prisma.availability.findMany({ orderBy: [{ date: "asc" }, { startHour: "asc" }] }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" } })
    ]);

  return { mealPlans, cateringMenus, chefServices, bookings, availability, users };
}
