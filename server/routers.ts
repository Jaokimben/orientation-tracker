import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { initialActions } from "../client/src/lib/data";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/dev-server.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  actions: router({
    /**
     * Get all actions with user's progress
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      // Seed actions if database is empty
      const actionsData = initialActions.map(action => ({
        id: action.id,
        title: action.title,
        description: action.description,
        deadline: action.deadline,
        phase: action.phase,
        link: action.link || null,
      }));
      
      await db.seedActions(actionsData);
      
      // Get all actions and user progress
      const [allActions, userProgress] = await Promise.all([
        db.getAllActions(),
        db.getUserProgress(ctx.user.id),
      ]);

      // Merge actions with user progress
      const progressMap = new Map(
        userProgress.map(p => [p.actionId, p.completed])
      );

      return allActions.map(action => ({
        ...action,
        status: progressMap.get(action.id) ? 'completed' as const : 'pending' as const,
      }));
    }),

    /**
     * Toggle action completion
     */
    toggle: protectedProcedure
      .input(z.object({ actionId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const newStatus = await db.toggleActionCompletion(
          ctx.user.id,
          input.actionId
        );
        
        return {
          actionId: input.actionId,
          completed: newStatus,
        };
      }),

    /**
     * Get progress statistics
     */
    stats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProgressStats(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
