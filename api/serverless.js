// Vercel Serverless Function Handler
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// Import compiled modules
import { appRouter } from "../dist/routers.js";
import { createContext } from "../dist/_core/context.js";

const app = express();

// Configure body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// Default handler
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

export default app;


