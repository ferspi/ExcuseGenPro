import { SavedExcuse } from "@shared/schema";

const STORAGE_KEYS = {
  SAVED_EXCUSES: "excuse-generator-saved-excuses",
  API_KEY: "excuse-generator-api-key",
  SESSION_COUNT: "excuse-generator-session-count",
  USER_PREFERENCES: "excuse-generator-preferences",
} as const;

export class ExcuseStorageService {
  static getSavedExcuses(): SavedExcuse[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_EXCUSES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading saved excuses:", error);
      return [];
    }
  }

  static saveExcuse(excuse: SavedExcuse): void {
    try {
      const existingExcuses = this.getSavedExcuses();
      const updatedExcuses = [excuse, ...existingExcuses];
      localStorage.setItem(STORAGE_KEYS.SAVED_EXCUSES, JSON.stringify(updatedExcuses));
    } catch (error) {
      console.error("Error saving excuse:", error);
      throw new Error("Failed to save excuse");
    }
  }

  static deleteExcuse(id: string): void {
    try {
      const existingExcuses = this.getSavedExcuses();
      const filteredExcuses = existingExcuses.filter(excuse => excuse.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_EXCUSES, JSON.stringify(filteredExcuses));
    } catch (error) {
      console.error("Error deleting excuse:", error);
      throw new Error("Failed to delete excuse");
    }
  }

  static markExcuseAsUsed(id: string): void {
    try {
      const existingExcuses = this.getSavedExcuses();
      const updatedExcuses = existingExcuses.map(excuse => 
        excuse.id === id 
          ? { ...excuse, isUsed: true, usedDate: new Date().toISOString() }
          : excuse
      );
      localStorage.setItem(STORAGE_KEYS.SAVED_EXCUSES, JSON.stringify(updatedExcuses));
    } catch (error) {
      console.error("Error marking excuse as used:", error);
      throw new Error("Failed to mark excuse as used");
    }
  }

  static getApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
  }

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  }

  static getSessionCount(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION_COUNT);
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      return 0;
    }
  }

  static updateSessionCount(count: number): void {
    const currentCount = this.getSessionCount();
    const newCount = currentCount + count;
    localStorage.setItem(STORAGE_KEYS.SESSION_COUNT, newCount.toString());
  }

  static getUserPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : {
        defaultAudience: "",
        defaultCreativity: 5,
        defaultUrgency: "last-minute",
      };
    } catch (error) {
      return {
        defaultAudience: "",
        defaultCreativity: 5,
        defaultUrgency: "last-minute",
      };
    }
  }

  static saveUserPreferences(preferences: any): void {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  }
}
