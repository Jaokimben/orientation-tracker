// Vercel Serverless Function
// This must export a function that handles (req, res)

import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// Import compiled modules from api directory (built by vercel-build)
import { appRouter } from "./routers.js";
import { createContext } from "./_core/context.js";

// Create Express app
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

// Export handler for Vercel
export default (req, res) => {
  // Vercel needs the handler to return a promise
  return app(req, res);
};


