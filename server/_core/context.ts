import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database(process.env.DATABASE_URL || "./database.db");
const db = drizzle(sqlite);
const DEFAULT_OPENID = 'student-default-openid';

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // If not authenticated, use default account
    const defaultUsers = await db.select().from(users).where(eq(users.openId, DEFAULT_OPENID));
    if (defaultUsers.length > 0) {
      user = defaultUsers[0];
    } else {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
