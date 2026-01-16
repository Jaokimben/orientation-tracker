import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, actions, userProgress, InsertAction, InsertUserProgress } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ ACTIONS QUERIES ============

/**
 * Get all actions
 */
export async function getAllActions() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(actions).orderBy(actions.id);
}

/**
 * Seed actions into the database (only if empty)
 */
export async function seedActions(actionsList: InsertAction[]) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if actions already exist
  const existing = await db.select().from(actions).limit(1);
  if (existing.length > 0) {
    return; // Already seeded
  }

  // Insert all actions
  await db.insert(actions).values(actionsList);
}

// ============ USER PROGRESS QUERIES ============

/**
 * Get user's progress for all actions
 */
export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId));
}

/**
 * Toggle action completion for a user
 */
export async function toggleActionCompletion(userId: number, actionId: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if progress entry exists
  const existing = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.actionId, actionId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Toggle existing entry
    const current = existing[0]!;
    const newCompleted = !current.completed;
    
    await db
      .update(userProgress)
      .set({
        completed: newCompleted,
        completedAt: newCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(userProgress.id, current.id));

    return newCompleted;
  } else {
    // Create new entry (mark as completed)
    await db.insert(userProgress).values({
      userId,
      actionId,
      completed: true,
      completedAt: new Date(),
    });

    return true;
  }
}

/**
 * Get progress statistics for a user
 */
export async function getUserProgressStats(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const [allActions, userProgressData] = await Promise.all([
    db.select().from(actions),
    db.select().from(userProgress).where(eq(userProgress.userId, userId)),
  ]);

  const total = allActions.length;
  const completed = userProgressData.filter(p => p.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    percentage,
  };
}
