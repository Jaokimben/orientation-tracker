import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("actions router", () => {
  describe("actions.list", () => {
    it("returns all actions with user progress", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const actions = await caller.actions.list();

      expect(actions).toBeDefined();
      expect(Array.isArray(actions)).toBe(true);
      expect(actions.length).toBeGreaterThan(0);
      
      // Check structure of first action
      const firstAction = actions[0];
      expect(firstAction).toHaveProperty("id");
      expect(firstAction).toHaveProperty("title");
      expect(firstAction).toHaveProperty("description");
      expect(firstAction).toHaveProperty("deadline");
      expect(firstAction).toHaveProperty("phase");
      expect(firstAction).toHaveProperty("status");
      expect(["pending", "completed"]).toContain(firstAction?.status);
    });
  });

  describe("actions.toggle", () => {
    it("toggles action completion status", async () => {
      const ctx = createAuthContext(2);
      const caller = appRouter.createCaller(ctx);

      // Get initial list
      const initialActions = await caller.actions.list();
      const testAction = initialActions[0];
      
      if (!testAction) {
        throw new Error("No actions found for testing");
      }

      const initialStatus = testAction.status === "completed";

      // Toggle the action
      const result = await caller.actions.toggle({
        actionId: testAction.id,
      });

      expect(result).toHaveProperty("actionId", testAction.id);
      expect(result).toHaveProperty("completed");
      expect(result.completed).toBe(!initialStatus);

      // Verify the change persisted
      const updatedActions = await caller.actions.list();
      const updatedAction = updatedActions.find(a => a.id === testAction.id);
      
      expect(updatedAction?.status).toBe(
        result.completed ? "completed" : "pending"
      );
    });

    it("creates progress entry for new action", async () => {
      const ctx = createAuthContext(3);
      const caller = appRouter.createCaller(ctx);

      // Get actions
      const actions = await caller.actions.list();
      const testAction = actions[0];
      
      if (!testAction) {
        throw new Error("No actions found for testing");
      }

      // Get initial state
      const initialProgress = await db.getUserProgress(ctx.user!.id);
      const initialEntry = initialProgress.find(p => p.actionId === testAction.id);
      const wasCompleted = initialEntry?.completed || false;

      // Toggle action
      const result = await caller.actions.toggle({
        actionId: testAction.id,
      });

      // Should toggle to opposite state
      expect(result.completed).toBe(!wasCompleted);

      // Verify the entry exists and has correct state
      const progress = await db.getUserProgress(ctx.user!.id);
      const entry = progress.find(p => p.actionId === testAction.id);
      
      expect(entry).toBeDefined();
      expect(entry?.completed).toBe(!wasCompleted);
    });
  });

  describe("actions.stats", () => {
    it("returns correct progress statistics", async () => {
      const ctx = createAuthContext(4);
      const caller = appRouter.createCaller(ctx);

      // Get initial stats
      const initialStats = await caller.actions.stats();

      expect(initialStats).toHaveProperty("total");
      expect(initialStats).toHaveProperty("completed");
      expect(initialStats).toHaveProperty("percentage");
      expect(initialStats.total).toBeGreaterThan(0);
      expect(initialStats.completed).toBeGreaterThanOrEqual(0);
      expect(initialStats.percentage).toBeGreaterThanOrEqual(0);
      expect(initialStats.percentage).toBeLessThanOrEqual(100);

      // Toggle an action
      const actions = await caller.actions.list();
      const testAction = actions.find(a => a.status === "pending");
      
      if (testAction) {
        await caller.actions.toggle({ actionId: testAction.id });

        // Check stats updated
        const updatedStats = await caller.actions.stats();
        expect(updatedStats.completed).toBe(initialStats.completed + 1);
      }
    });

    it("calculates correct percentage", async () => {
      const ctx = createAuthContext(5);
      const caller = appRouter.createCaller(ctx);

      const stats = await caller.actions.stats();
      const expectedPercentage = Math.round(
        (stats.completed / stats.total) * 100
      );

      expect(stats.percentage).toBe(expectedPercentage);
    });
  });
});
