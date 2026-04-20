import { BookingType } from "@prisma/client";
import { addHours, endOfDay, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { prisma } from "@/lib/prisma";

function getBookingDurationHours(type: BookingType) {
  switch (type) {
    case "MEAL_PREP":
      return 1;
    case "CATERING":
      return 4;
    case "CHEF_EVENT":
      return 4;
    default:
      return 2;
  }
}

export async function calculateBookingPrice(input: {
  type: BookingType;
  itemId: string;
  guestCount?: number;
  paymentOption: "deposit" | "full";
}) {
  let total = 0;

  if (input.type === "MEAL_PREP") {
    const plan = await prisma.mealPlan.findUniqueOrThrow({ where: { id: input.itemId } });
    total = Number(plan.price);
  }

  if (input.type === "CATERING") {
    const menu = await prisma.cateringMenu.findUniqueOrThrow({ where: { id: input.itemId } });
    const guests = Math.max(input.guestCount ?? menu.minimumGuestCount, menu.minimumGuestCount);
    total = Number(menu.pricePerPerson) * guests;
  }

  if (input.type === "CHEF_EVENT") {
    const service = await prisma.chefService.findUniqueOrThrow({ where: { id: input.itemId } });
    const guests = Math.max(input.guestCount ?? service.minimumGuests, service.minimumGuests);
    total =
      service.pricingModel === "hourly" && service.hourlyRate
        ? Number(service.basePrice) + Number(service.hourlyRate) * service.durationHours + guests * 12
        : Number(service.basePrice) + guests * 18;
  }

  return {
    totalPrice: total,
    depositAmount: input.paymentOption === "deposit" ? Number((total * 0.35).toFixed(2)) : total
  };
}

export async function resolveBookingWindow(input: {
  type: BookingType;
  startAt: string;
  timezone: string;
}) {
  const zonedStart = fromZonedTime(input.startAt, input.timezone);
  const endAt = addHours(zonedStart, getBookingDurationHours(input.type));

  return { startAt: zonedStart, endAt };
}

export async function isSlotAvailable(input: {
  startAt: Date;
  endAt: Date;
  timezone: string;
}) {
  const bookingDayStart = startOfDay(input.startAt);
  const bookingDayEnd = endOfDay(input.startAt);

  const [availability, overlappingBookings] = await Promise.all([
    prisma.availability.findFirst({
      where: {
        date: {
          gte: bookingDayStart,
          lte: bookingDayEnd
        },
        isAvailable: true,
        timezone: input.timezone
      },
      orderBy: { startHour: "asc" }
    }),
    prisma.booking.findMany({
      where: {
        startAt: { lt: addHours(input.endAt, 2) },
        endAt: { gt: addHours(input.startAt, -2) },
        status: { not: "CANCELED" }
      }
    })
  ]);

  if (!availability) {
    return { available: false, reason: "No availability window exists for that day." };
  }

  const requestedHour = input.startAt.getHours();
  const requestedEndHour = input.endAt.getHours();

  if (requestedHour < availability.startHour || requestedEndHour > availability.endHour) {
    return { available: false, reason: "Requested time is outside the admin availability window." };
  }

  const conflicts = overlappingBookings.filter((booking) => {
    const bufferedStart = addHours(booking.startAt, -availability.bufferHours);
    const bufferedEnd = addHours(booking.endAt, availability.bufferHours);
    return input.startAt < bufferedEnd && input.endAt > bufferedStart;
  });

  if (conflicts.length > 0) {
    return { available: false, reason: "That time is already reserved or in a buffer window." };
  }

  return { available: true };
}
