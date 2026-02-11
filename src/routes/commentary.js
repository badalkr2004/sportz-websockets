import { Router } from "express";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { createCommentarySchema, listCommentaryQuerySchema } from "../validation/commentary.js";
import { matchIdParamSchema } from "../validation/matches.js";
import { eq, desc } from "drizzle-orm";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

/**
 * GET /matches/:matchId/commentary
 * List all commentary for a specific match
 */
commentaryRouter.get("/", async (req, res) => {
    try {
        // Validate match ID from URL params
        const parsedParams = matchIdParamSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({
                error: "Invalid match ID",
                details: parsedParams.error.errors
            });
        }

        // Validate query parameters
        const parsedQuery = listCommentaryQuerySchema.safeParse(req.query);

        if (!parsedQuery.success) {
            return res.status(400).json({
                error: "Invalid query parameters",
                details: parsedQuery.error.errors
            });
        }

        const { matchId } = parsedParams.data;
        const limit = Math.min(parsedQuery.data.limit ?? 100, MAX_LIMIT);

        // Fetch commentary from database
        const data = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, matchId))
            .orderBy(desc(commentary.createdAt))
            .limit(limit);

        res.status(200).json({ data });
    } catch (error) {
        console.error("Failed to fetch commentary:", error);
        res.status(500).json({
            error: "Failed to fetch commentary",
        });
    }
});


/**
 * POST /matches/:id/commentary
 * Create a new commentary entry for a specific match
 */
commentaryRouter.post("/", async (req, res) => {
    try {
        // Validate match ID from URL params
        const parsedParams = matchIdParamSchema.safeParse(req.params);

        if (!parsedParams.success) {
            return res.status(400).json({
                error: "Invalid match ID",
                details: parsedParams.error.errors
            });
        }

        // Validate request body
        const parsedBody = createCommentarySchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                error: "Invalid commentary data",
                details: parsedBody.error.errors
            });
        }

        const { matchId } = parsedParams.data;

        // Insert commentary into database
        const [newCommentary] = await db
            .insert(commentary)
            .values({
                matchId,
                ...parsedBody.data
            })
            .returning();

        if (res.app.locals.broadcastCommentary) {
            res.app.locals.broadcastCommentary(matchId, newCommentary)
        }

        res.status(201).json({ data: newCommentary });
    } catch (error) {
        console.error("Failed to create commentary:", error);
        res.status(500).json({
            error: "Failed to create commentary",
        });
    }
}); 