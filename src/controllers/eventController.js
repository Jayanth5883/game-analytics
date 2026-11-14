
import { eventsSchema } from "../validators/eventValidator.js";
import { saveGameEvents } from "../services/eventService.js";

export const createEvents = async (req, res, next) => {
    try {
        const { events } = eventsSchema.parse(req.body);

        const result = await saveGameEvents(
            req.params.id,
            req.user.id,
            events
        );

        res.status(201).json({
            success: true,
            message: "Gameplay events saved successfully",
            ...result
        });
    } catch (error) {
        next(error);
    }
};
