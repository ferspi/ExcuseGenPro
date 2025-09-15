import { useState, useEffect } from "react";
import { VenetianMask, Heart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApiKeyInput } from "@/components/api-key-input";
import { ExcuseForm } from "@/components/excuse-form";
import { ExcuseResults } from "@/components/excuse-results";
import { SavedExcuses } from "@/components/saved-excuses";
import { GeneratedExcuse, ExcuseRequest } from "@shared/schema";
import { ExcuseStorageService } from "@/lib/excuse-storage";
import { useExcuseGenerator } from "@/hooks/use-excuse-generator";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini-2024-07-18");
  const [generatedExcuses, setGeneratedExcuses] = useState<GeneratedExcuse[]>([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [formData, setFormData] = useState({ situation: "", audience: "" });
  
  const { mutate: generateExcuses, isPending } = useExcuseGenerator();
  const { toast } = useToast();

  useEffect(() => {
    // Load session count on component mount
    const count = ExcuseStorageService.getSessionCount();
    setSessionCount(count);
  }, []);

  const handleExcusesGenerated = (excuses: GeneratedExcuse[]) => {
    setGeneratedExcuses(excuses);
    setSessionCount(prev => prev + excuses.length);
    
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById("results-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };
  
  const handleGenerateRequest = (request: ExcuseRequest) => {
    generateExcuses(request, {
      onSuccess: (data) => {
        handleExcusesGenerated(data.excuses);
        // Set form data for context in saved excuses
        setFormData({ situation: request.situation, audience: request.audience });
        toast({
          title: "¡Éxito!",
          description: `¡Se generaron ${data.excuses.length} nuevas excusas!`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al generar excusas",
          variant: "destructive",
        });
      },
    });
  };

  const handleGenerateFirst = () => {
    // Scroll to form
    const formSection = document.querySelector("form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-muted/20 to-background pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <header className="text-center mb-12 animate-float">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg">
              <VenetianMask className="h-8 w-8 text-white" data-testid="icon-mask" />
            </div>
            <h1 className="text-5xl font-bold gradient-text" data-testid="text-app-title">
              Excuse Generator Pro
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-app-description">
            Genera excusas creativas y creíbles con inteligencia artificial. Perfecto para cualquier situación.
          </p>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <span className="text-sm text-muted-foreground">Excusas de la Sesión:</span>
            <Badge className="bg-neon-purple/20 text-neon-purple" data-testid="badge-session-count">
              {sessionCount}
            </Badge>
          </div>
        </header>

        {/* API Key Section */}
        <ApiKeyInput 
          apiKey={apiKey} 
          onApiKeyChange={setApiKey}
          model={model}
          onModelChange={setModel}
        />

        {/* Main Form Section */}
        <ExcuseForm
          apiKey={apiKey}
          model={model}
          onGenerateRequest={handleGenerateRequest}
          isLoading={isPending}
        />

        {/* Results Section */}
        <ExcuseResults
          excuses={generatedExcuses}
          situation={formData.situation}
          audience={formData.audience}
          isLoading={isPending}
        />

        {/* Saved Excuses Section */}
        <SavedExcuses onGenerateFirst={handleGenerateFirst} />

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span>Hecho con</span>
            <Heart className="text-neon-coral h-4 w-4 fill-current" />
            <span>para mentes creativas</span>
          </div>
          <p className="text-xs" data-testid="text-privacy-notice">
            <Shield className="inline h-3 w-3 mr-1" />
            Tus datos se almacenan localmente. Ninguna excusa se comparte o almacena en nuestros servidores.
          </p>
        </footer>
      </div>
    </div>
  );
}
