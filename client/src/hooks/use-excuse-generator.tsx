import { useMutation } from "@tanstack/react-query";
import { ExcuseRequest, ExcuseGenerationResponse } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ExcuseStorageService } from "@/lib/excuse-storage";

export function useExcuseGenerator() {
  return useMutation({
    mutationFn: async (request: ExcuseRequest): Promise<ExcuseGenerationResponse> => {
      const response = await apiRequest("POST", "/api/excuses/generate", request);
      const data = await response.json();
      
      // Update session count in localStorage
      ExcuseStorageService.updateSessionCount(data.excuses.length);
      
      return data;
    },
    onError: (error) => {
      console.error("Failed to generate excuses:", error);
    },
  });
}
