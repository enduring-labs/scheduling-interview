import { z } from 'zod';

export const createAvailabilitySlotSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  workOrderId: z.string().uuid('Invalid work order ID'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const deleteAvailabilitySlotSchema = z.object({
  id: z.string().uuid('Invalid availability slot ID'),
});

export type CreateAvailabilitySlotRequest = z.infer<typeof createAvailabilitySlotSchema>;
export type DeleteAvailabilitySlotRequest = z.infer<typeof deleteAvailabilitySlotSchema>;
