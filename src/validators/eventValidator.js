
import { z } from "zod";

const eventSchema = z.object({
    eventType: z.string().trim().min(1),
    eventTime: z.iso.datetime().optional(),
    data: z.record(z.string(), z.unknown()).default({})
});

export const eventsSchema = z.object({
    events: z.array(eventSchema).min(1).max(100)
});
