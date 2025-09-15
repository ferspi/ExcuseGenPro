import { z } from "zod";

// Excuse generation request schema
export const excuseRequestSchema = z.object({
  situation: z.string().min(1, "Situation is required"),
  audience: z.enum(["professor", "boss", "parents", "partner", "friends"]),
  creativity: z.number().min(1).max(10),
  urgency: z.enum(["last-minute", "planned"]),
  apiKey: z.string().min(1, "API key is required"),
  model: z.string().default("gpt-4o-mini-2024-07-18"),
});

export type ExcuseRequest = z.infer<typeof excuseRequestSchema>;

// Generated excuse schema
export const generatedExcuseSchema = z.object({
  id: z.string(),
  text: z.string(),
  credibilityScore: z.number().min(1).max(10),
  originalityScore: z.number().min(1).max(10),
  riskLevel: z.enum(["low", "medium", "high"]),
  deliveryTip: z.string(),
  totalScore: z.number(),
});

export type GeneratedExcuse = z.infer<typeof generatedExcuseSchema>;

// Saved excuse schema
export const savedExcuseSchema = z.object({
  id: z.string(),
  text: z.string(),
  situation: z.string(),
  audience: z.string(),
  credibilityScore: z.number(),
  originalityScore: z.number(),
  riskLevel: z.enum(["low", "medium", "high"]),
  deliveryTip: z.string(),
  totalScore: z.number(),
  savedDate: z.string(),
  isUsed: z.boolean().default(false),
  usedDate: z.string().optional(),
});

export type SavedExcuse = z.infer<typeof savedExcuseSchema>;

// API response schemas
export const excuseGenerationResponseSchema = z.object({
  excuses: z.array(generatedExcuseSchema),
  sessionCount: z.number(),
});

export type ExcuseGenerationResponse = z.infer<typeof excuseGenerationResponseSchema>;
