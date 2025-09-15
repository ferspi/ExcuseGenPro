import { type SavedExcuse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Since we're using localStorage on frontend, server storage is minimal
  // Could be extended for future database integration
}

export class MemStorage implements IStorage {
  constructor() {
    // Minimal server storage for this localStorage-based app
  }
}

export const storage = new MemStorage();
