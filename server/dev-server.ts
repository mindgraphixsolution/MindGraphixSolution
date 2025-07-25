import express from "express";

export function createDevServer() {
  const app = express();
  
  // Basic middleware for development
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  
  // Basic health check
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Fusion API - Development Server",
      timestamp: new Date().toISOString(),
      status: "healthy",
    });
  });

  // Simple placeholder routes for development
  app.get("/api/demo", (_req, res) => {
    res.json({
      message: "Demo endpoint - Development mode",
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
