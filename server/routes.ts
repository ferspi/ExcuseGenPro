import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { excuseRequestSchema, excuseGenerationResponseSchema } from "@shared/schema";
import { ExcuseGeneratorService } from "./services/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate excuses endpoint
  app.post("/api/excuses/generate", async (req, res) => {
    try {
      const validatedRequest = excuseRequestSchema.parse(req.body);
      
      const excuseService = new ExcuseGeneratorService(validatedRequest.apiKey);
      const excuses = await excuseService.generateExcuses(validatedRequest);
      
      const response = {
        excuses,
        sessionCount: excuses.length, // In real app, this would track session totals
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating excuses:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          return res.status(401).json({ message: "Invalid API key" });
        }
        return res.status(500).json({ message: error.message });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
