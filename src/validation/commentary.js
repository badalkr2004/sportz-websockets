import { z } from "zod";

/**
 * Schema for validating query parameters when listing commentary
 * @property {number} [limit] - Optional limit for number of results (1-100)
 */
export const listCommentaryQuerySchema = z.object({
    limit: z.coerce.number().positive().max(100).optional()
});

/**
 * Schema for validating commentary creation payload
 * @property {number} minutes - Non-negative integer representing match minutes
 * @property {number} sequence - Sequence number for ordering events
 * @property {string} period - Match period (e.g., "1st Half", "2nd Half", "Extra Time")
 * @property {string} eventType - Type of event (e.g., "goal", "foul", "substitution")
 * @property {string} actor - Player or entity performing the action
 * @property {string} team - Team associated with the event
 * @property {string} message - Required description of the event
 * @property {Record<string, any>} [metadata] - Optional additional metadata
 * @property {string[]} [tags] - Optional array of tags for categorization
 */
export const createCommentarySchema = z.object({
    minute: z.number().int().nonnegative().optional(),
    sequence: z.number().int(),
    period: z.string().optional(),
    eventType: z.string().min(1, "Event type is required"),
    actor: z.string().optional(),
    team: z.string().optional(),
    message: z.string().min(1, "Message is required"),
    metadata: z.record(z.string(), z.unknown()).optional(),
    tags: z.array(z.string()).optional()
});
