
import { z } from "zod";

export const startSessionSchema = z.object({
    gameId: z.string().trim().min(1),
    difficulty: z.string().trim().min(1)
});
