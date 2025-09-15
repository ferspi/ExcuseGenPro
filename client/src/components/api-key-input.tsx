import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Shield,
  Key,
  Bot,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { ExcuseStorageService } from "@/lib/excuse-storage";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
  model: string;
  onModelChange: (model: string) => void;
}

export function ApiKeyInput({
  apiKey,
  onApiKeyChange,
  model,
  onModelChange,
}: ApiKeyInputProps) {
  const [provider, setProvider] = useState("openai");
  const [isOpen, setIsOpen] = useState(true);

  // Check if configuration is complete
  const isConfigComplete = false;

  useEffect(() => {
    // Load saved API key on component mount
    const savedApiKey = ExcuseStorageService.getApiKey();
    if (savedApiKey && !apiKey) {
      onApiKeyChange(savedApiKey);
    }
  }, [apiKey, onApiKeyChange]);

  const handleApiKeyChange = (value: string) => {
    onApiKeyChange(value);
    ExcuseStorageService.saveApiKey(value);
  };

  const handleModelChange = (value: string) => {
    onModelChange(value);
  };

  // Auto-collapse when configuration is complete
  useEffect(() => {
    if (isConfigComplete && isOpen) {
      setTimeout(() => setIsOpen(false), 1000);
    }
  }, [isConfigComplete, isOpen]);

  return (
    <section className="mb-8">
      <Card className="glass-effect neon-border">
        <CardContent className="p-6">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between items-center p-0 h-auto hover:bg-transparent"
                data-testid="button-ai-config-toggle"
              >
                <div className="flex items-center">
                  <Key className="text-neon-blue mr-3 h-5 w-5" />
                  <h2
                    className="text-xl font-semibold"
                    data-testid="text-ai-configuration"
                  >
                    Configuración de IA
                  </h2>
                  {isConfigComplete && !isOpen && (
                    <CheckCircle className="text-neon-green ml-2 h-4 w-4" />
                  )}
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Proveedor de IA
                  </Label>
                  <Select
                    value={provider}
                    onValueChange={setProvider}
                    data-testid="select-api-provider"
                  >
                    <SelectTrigger className="w-full bg-input border border-border rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                      <SelectItem value="gemini">Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Clave API
                  </Label>
                  <Input
                    type="password"
                    placeholder="Ingresa tu clave API..."
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg"
                    data-testid="input-api-key"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">
                  <Bot className="text-neon-green mr-2 h-4 w-4 inline" />
                  Modelo de IA
                </Label>
                <Input
                  placeholder="ej. gpt-4o-mini-2024-07-18, gpt-4, etc."
                  value={model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg"
                  data-testid="input-model"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Especifica qué modelo de OpenAI usar. Por defecto:
                  gpt-4o-mini-2024-07-18
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                <Shield className="inline h-3 w-3 mr-1" />
                Tu clave API se almacena localmente y nunca se comparte con
                terceros.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </section>
  );
}
