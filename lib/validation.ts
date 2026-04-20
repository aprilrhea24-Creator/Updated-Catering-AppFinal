import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(7),
  address: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const bookingSchema = z.object({
  type: z.enum(["MEAL_PREP", "CATERING", "CHEF_EVENT"]),
  userId: z.string().min(1),
  itemId: z.string().min(1),
  guestCount: z.coerce.number().int().positive().optional(),
  startAt: z.string().min(1),
  timezone: z.string().min(3),
  eventAddress: z.string().optional(),
  specialRequests: z.string().optional(),
  serviceAgreement: z.coerce.boolean().optional(),
  deliveryFrequency: z.string().optional(),
  isRecurring: z.coerce.boolean().optional(),
  paymentOption: z.enum(["deposit", "full"]).default("deposit")
});

export const availabilitySchema = z.object({
  date: z.string().min(1),
  startHour: z.coerce.number().int().min(0).max(23),
  endHour: z.coerce.number().int().min(1).max(24),
  isAvailable: z.coerce.boolean().default(true),
  timezone: z.string().default("America/Los_Angeles"),
  bufferHours: z.coerce.number().int().min(0).max(12).default(2),
  notes: z.string().optional()
});
